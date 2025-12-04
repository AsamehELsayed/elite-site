"use client"

import { useState, useRef, useCallback } from 'react'
import { Upload, X, Image as ImageIcon, Loader2 } from 'lucide-react'
import { Button } from './button'

export function ImageUpload({ 
  value = [], 
  onChange, 
  multiple = true,
  maxImages = 50,
  showSkewOptions = false,
  className = ''
}) {
  const [uploading, setUploading] = useState(false)
  const [dragActive, setDragActive] = useState(false)
  const fileInputRef = useRef(null)
  const [uploadProgress, setUploadProgress] = useState({})

  const images = Array.isArray(value) ? value : []

  const handleUpload = async (files) => {
    const fileArray = Array.from(files).slice(0, maxImages - images.length)
    
    if (fileArray.length === 0) {
      alert(`Maximum ${maxImages} images allowed`)
      return
    }

    setUploading(true)
    const newImages = [...images]
    const uploadPromises = []

    for (let i = 0; i < fileArray.length; i++) {
      const file = fileArray[i]
      const fileId = `${Date.now()}-${i}`
      
      // Validate file type
      if (!file.type.startsWith('image/')) {
        alert(`${file.name} is not an image file`)
        continue
      }

      // Validate file size (10MB)
      if (file.size > 10 * 1024 * 1024) {
        alert(`${file.name} is too large. Maximum size is 10MB`)
        continue
      }

      setUploadProgress(prev => ({ ...prev, [fileId]: 0 }))

      const formData = new FormData()
      formData.append('file', file)

      const uploadPromise = fetch('/api/upload', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: formData
      })
        .then(async (response) => {
          if (!response.ok) {
            const error = await response.json()
            throw new Error(error.error || 'Upload failed')
          }
          return response.json()
        })
        .then((data) => {
          setUploadProgress(prev => {
            const newPrev = { ...prev }
            delete newPrev[fileId]
            return newPrev
          })
          return showSkewOptions ? { src: data.url, skew: '' } : { src: data.url }
        })
        .catch((error) => {
          setUploadProgress(prev => {
            const newPrev = { ...prev }
            delete newPrev[fileId]
            return newPrev
          })
          alert(`Failed to upload ${file.name}: ${error.message}`)
          return null
        })

      uploadPromises.push(uploadPromise)
    }

    const results = await Promise.all(uploadPromises)
    const successfulUploads = results.filter(img => img !== null)
    
    if (successfulUploads.length > 0) {
      onChange([...newImages, ...successfulUploads])
    }

    setUploading(false)
  }

  const handleDrag = useCallback((e) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }, [])

  const handleDrop = useCallback((e) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleUpload(e.dataTransfer.files)
    }
  }, [images])

  const handleFileInput = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      handleUpload(e.target.files)
    }
  }

  const removeImage = (index) => {
    const newImages = images.filter((_, i) => i !== index)
    onChange(newImages)
  }

  const updateImageSkew = (index, skew) => {
    const newImages = [...images]
    newImages[index] = { ...newImages[index], skew }
    onChange(newImages)
  }

  return (
    <div className={className}>
      {/* Upload Area */}
      <div
        className={`
          border-2 border-dashed rounded-lg p-8 text-center transition-colors
          ${dragActive 
            ? 'border-primary bg-primary/10' 
            : 'border-zinc-700 bg-zinc-900/50 hover:border-zinc-600'
          }
          ${uploading ? 'opacity-50 pointer-events-none' : ''}
        `}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple={multiple}
          onChange={handleFileInput}
          className="hidden"
        />
        
        <div className="flex flex-col items-center gap-4">
          {uploading ? (
            <>
              <Loader2 className="w-12 h-12 text-primary animate-spin" />
              <p className="text-zinc-400">Uploading images...</p>
            </>
          ) : (
            <>
              <Upload className="w-12 h-12 text-zinc-400" />
              <div>
                <p className="text-zinc-300 mb-2">
                  Drag and drop images here, or{' '}
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="text-primary hover:underline"
                  >
                    browse
                  </button>
                </p>
                <p className="text-xs text-zinc-500">
                  Supports: JPEG, PNG, WebP, GIF (Max 10MB per file)
                </p>
                {images.length > 0 && (
                  <p className="text-xs text-zinc-500 mt-1">
                    {images.length} / {maxImages} images
                  </p>
                )}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Image Grid */}
      {images.length > 0 && (
        <div className="mt-6">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {images.map((img, index) => (
              <div
                key={index}
                className="group relative aspect-square rounded-lg overflow-hidden border border-zinc-800 bg-zinc-900"
              >
                <img
                  src={img.src}
                  alt={`Upload ${index + 1}`}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="p-2 bg-red-600 hover:bg-red-700 rounded-full transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
                {showSkewOptions && (
                  <div className="absolute bottom-2 left-2 right-2">
                    <select
                      value={img.skew || ''}
                      onChange={(e) => updateImageSkew(index, e.target.value)}
                      className="w-full text-xs bg-zinc-800 border border-zinc-700 rounded px-2 py-1 text-white"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <option value="">No skew</option>
                      <option value="-skew-x-12">Skew left</option>
                      <option value="skew-x-12">Skew right</option>
                    </select>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* JSON Output (for debugging/editing) */}
      {images.length > 0 && (
        <div className="mt-6">
          <details className="bg-zinc-900 rounded-lg border border-zinc-800">
            <summary className="p-4 cursor-pointer text-sm text-zinc-400 hover:text-zinc-300">
              View/Edit JSON
            </summary>
            <div className="p-4 border-t border-zinc-800">
              <textarea
                value={JSON.stringify(images, null, 2)}
                onChange={(e) => {
                  try {
                    const parsed = JSON.parse(e.target.value)
                    if (Array.isArray(parsed)) {
                      onChange(parsed)
                    }
                  } catch (err) {
                    // Invalid JSON, ignore
                  }
                }}
                className="w-full bg-zinc-800 border border-zinc-700 rounded p-3 font-mono text-xs text-white min-h-[200px]"
              />
            </div>
          </details>
        </div>
      )}
    </div>
  )
}

