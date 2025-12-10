"use client"

import { useState, useEffect, useRef, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  Plus,
  Edit,
  Trash2,
  Home,
  BookOpen,
  MessageSquare,
  Briefcase,
  BarChart3,
  Calendar,
  LogOut,
  Image as ImageIcon,
  FileText,
  AlertCircle,
  Upload,
  X,
  Image,
  Loader2
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { navigationItems } from '@/lib/navigation'
import { useLocale } from '@/components/locale-provider'
import { Input } from '@/components/ui/input'
import { RichTextEditor } from '@/components/ui/rich-text-editor'
import { apiGet, apiPost, apiPut, apiDelete } from '@/lib/api'

const getEmptyForm = () => ({
  title: '',
  slug: '',
  category: '',
  image: '',
  year: '',
  description: '',
  link: '',
  order: 0
})

export default function CaseStudiesPage() {
  const router = useRouter()
  const { locale, setLocale } = useLocale()
  const [caseStudies, setCaseStudies] = useState([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(null)
  const [formError, setFormError] = useState('')
  const [formData, setFormData] = useState(getEmptyForm())

  // Single Image Upload Component
  const SingleImageUpload = ({ value, onChange, label = "Image" }) => {
    const [uploading, setUploading] = useState(false)
    const [dragActive, setDragActive] = useState(false)
    const fileInputRef = useRef(null)

    const handleUpload = async (files) => {
      const file = files[0] // Only handle first file for single upload

      if (!file) return

      // Validate file type
      if (!file.type.startsWith('image/')) {
        alert(`${file.name} is not an image file`)
        return
      }

      // Validate file size (10MB)
      if (file.size > 10 * 1024 * 1024) {
        alert(`${file.name} is too large. Maximum size is 10MB`)
        return
      }

      setUploading(true)

      const formData = new FormData()
      formData.append('file', file)

      try {
        const response = await fetch('/api/upload', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
          body: formData
        })

        if (!response.ok) {
          const error = await response.json()
          throw new Error(error.error || 'Upload failed')
        }

        const data = await response.json()
        onChange(data.url)
      } catch (error) {
        alert(`Failed to upload ${file.name}: ${error.message}`)
      } finally {
        setUploading(false)
      }
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
    }, [])

    const handleFileInput = (e) => {
      if (e.target.files && e.target.files.length > 0) {
        handleUpload(e.target.files)
      }
    }

    const removeImage = () => {
      onChange('')
    }

    return (
      <div>
        <label className="block text-sm mb-2">{label}</label>

        {value ? (
          // Display uploaded image with remove option
          <div className="relative">
            <img
              src={value}
              alt="Case study"
              className="w-full h-48 object-cover rounded-lg border border-zinc-700"
            />
            <button
              type="button"
              onClick={removeImage}
              className="absolute top-2 right-2 p-2 bg-red-600 hover:bg-red-700 rounded-full transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ) : (
          // Upload area
          <div
            className={`
              border-2 border-dashed rounded-lg p-8 text-center transition-colors cursor-pointer
              ${dragActive
                ? 'border-primary bg-primary/10'
                : 'border-zinc-700 bg-zinc-900/50 hover:border-zinc-600'
              }
              ${uploading ? 'opacity-50 pointer-events-none' : ''}
            `}
            onClick={() => !uploading && fileInputRef.current?.click()}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileInput}
              className="hidden"
            />

            <div className="flex flex-col items-center gap-4">
              {uploading ? (
                <>
                  <Loader2 className="w-12 h-12 text-primary animate-spin" />
                  <p className="text-zinc-400">Uploading image...</p>
                </>
              ) : (
                <>
                  <Upload className="w-12 h-12 text-zinc-400" />
                  <div>
                    <p className="text-zinc-300 mb-2">
                      Drag and drop an image here, or{' '}
                      <span className="text-primary hover:underline">browse</span>
                    </p>
                    <p className="text-xs text-zinc-500">
                      Supports: JPEG, PNG, WebP, GIF (Max 10MB)
                    </p>
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    )
  }

  const menuItems = navigationItems

  const handleLogout = () => {
    localStorage.removeItem('token')
    router.push('/dashboard/login')
  }

  useEffect(() => {
    fetchCaseStudies()
  }, [locale])

  useEffect(() => {
    // Keep the form in sync with the selected locale to avoid overwriting other languages
    if (!editing) {
      setFormData(getEmptyForm())
      setFormError('')
      return
    }

    const current = caseStudies.find(
      (item) => (item.slug || item.id) === editing
    )

    if (!current) {
      setEditing(null)
      setFormData(getEmptyForm())
      setFormError('')
      return
    }

    setFormData({
      title: current.title || '',
      slug: current.slug || '',
      category: current.category || '',
      image: current.image || '',
      year: current.year || '',
      description: current.description || '',
      link: current.link || '',
      order: current.order ?? 0
    })
  }, [locale, caseStudies, editing])

  const fetchCaseStudies = async () => {
    try {
      const data = await apiGet(`/api/case-studies?lang=${locale}`)
      setCaseStudies(data)
    } catch (error) {
      console.error('Failed to fetch case studies:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setFormError('')

    const trimmed = {
      title: formData.title.trim(),
      category: formData.category.trim(),
      image: formData.image?.trim(),
      year: formData.year.trim(),
      description: formData.description.trim(),
    }

    const missingFields = Object.entries(trimmed)
      .filter(([, value]) => !value)
      .map(([key]) => key)

    if (missingFields.length) {
      setFormError(`Please add: ${missingFields.join(', ')}`)
      return
    }

    try {
      const payload = {
        ...formData,
        slug: formData.slug?.trim() || undefined,
        order: parseInt(formData.order) || 0
      }

      if (editing) {
        await apiPut(`/api/case-studies/${editing}?lang=${locale}`, payload)
      } else {
        await apiPost(`/api/case-studies?lang=${locale}`, payload)
      }

      setFormData(getEmptyForm())
      setEditing(null)
      setFormError('')
      fetchCaseStudies()
    } catch (error) {
      console.error('Failed to save case study:', error)
      setFormError(error.message || 'Failed to save case study')
    }
  }

  const handleEdit = (caseStudy) => {
    const identifier = caseStudy.slug || caseStudy.id
    setEditing(identifier)
    setFormData({
      title: caseStudy.title,
      slug: caseStudy.slug || '',
      category: caseStudy.category,
      image: caseStudy.image,
      year: caseStudy.year,
      description: caseStudy.description,
      link: caseStudy.link || '',
      order: caseStudy.order
    })
  }

  const handleDelete = async (identifier) => {
    if (!confirm('Are you sure you want to delete this case study?')) return
    try {
      await apiDelete(`/api/case-studies/${identifier}`)
      fetchCaseStudies()
    } catch (error) {
      console.error('Failed to delete case study:', error)
      alert('Failed to delete case study')
    }
  }

  if (loading) {
    return <div className="min-h-screen bg-black text-white flex items-center justify-center">Loading...</div>
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-zinc-900 border-r border-zinc-800 min-h-screen p-6">
          <div className="mb-8">
            <Link href="/dashboard">
              <h1 className="text-2xl font-serif text-primary cursor-pointer">Elite Dashboard</h1>
            </Link>
            <p className="text-sm text-zinc-400 mt-1">Content Management</p>
          </div>
          
          <nav className="space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon
              const isActive = item.href === '/dashboard/case-studies'
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    isActive 
                      ? 'bg-zinc-800 text-white' 
                      : 'text-zinc-300 hover:bg-zinc-800 hover:text-white'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </Link>
              )
            })}
          </nav>

          <div className="mt-8 pt-8 border-t border-zinc-800">
            <Button
              onClick={handleLogout}
              variant="outline"
              className="w-full border-zinc-700 text-zinc-300 hover:bg-zinc-800"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-8">
          <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8 gap-4">
          <h1 className="text-4xl font-serif">Case Studies</h1>
          <div className="flex items-center gap-2">
            {['en', 'ar'].map((lng) => (
              <Button
                key={lng}
                type="button"
                variant={locale === lng ? 'default' : 'outline'}
                className={locale === lng ? 'bg-primary text-black' : 'border-zinc-700 text-zinc-300'}
                onClick={() => setLocale(lng)}
              >
                {lng.toUpperCase()}
              </Button>
            ))}
          </div>
          <Button
            onClick={() => {
              setEditing(null)
              setFormData(getEmptyForm())
            }}
            className="bg-primary text-black"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add New
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Form */}
          <div className="bg-zinc-900 rounded-lg p-6 border border-zinc-800">
            <h2 className="text-2xl font-serif mb-4">
              {editing ? 'Edit Case Study' : 'Add Case Study'}
            </h2>
            {formError && (
              <div className="mb-4 flex items-start gap-2 rounded-lg border border-red-500/40 bg-red-500/10 px-3 py-2 text-sm text-red-200">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <p>{formError}</p>
              </div>
            )}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm mb-2">Title</label>
                <Input
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                  className="bg-zinc-800 border-zinc-700"
                />
              </div>
              <div>
                <label className="block text-sm mb-2">
                  Slug <span className="text-xs text-zinc-500">(optional)</span>
                </label>
                <Input
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  placeholder="e.g. lumina-fashion"
                  className="bg-zinc-800 border-zinc-700"
                />
                <p className="text-xs text-zinc-500 mt-1">Leave empty to auto-generate from the title.</p>
              </div>
              <div>
                <label className="block text-sm mb-2">Category</label>
                <Input
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  required
                  className="bg-zinc-800 border-zinc-700"
                />
              </div>
              <SingleImageUpload
                value={formData.image}
                onChange={(url) => setFormData({ ...formData, image: url })}
                label="Case Study Image"
              />
              <div>
                <label className="block text-sm mb-2">Year</label>
                <Input
                  value={formData.year}
                  onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                  required
                  className="bg-zinc-800 border-zinc-700"
                />
              </div>
              <div>
                <label className="block text-sm mb-2">Description</label>
                <RichTextEditor
                  value={formData.description}
                  onChange={(description) => setFormData({ ...formData, description })}
                  placeholder="Describe the project (rich text supported)"
                  className="bg-zinc-900/60"
                />
              </div>
              <div>
                <label className="block text-sm mb-2">Link (optional)</label>
                <Input
                  value={formData.link}
                  onChange={(e) => setFormData({ ...formData, link: e.target.value })}
                  className="bg-zinc-800 border-zinc-700"
                />
              </div>
              <div>
                <label className="block text-sm mb-2">Order</label>
                <Input
                  type="number"
                  value={formData.order}
                  onChange={(e) => setFormData({ ...formData, order: e.target.value })}
                  className="bg-zinc-800 border-zinc-700"
                />
              </div>
              <Button type="submit" className="w-full bg-primary text-black">
                {editing ? 'Update' : 'Create'} Case Study
              </Button>
            </form>
          </div>

          {/* List */}
          <div className="space-y-4">
            {caseStudies.map((caseStudy) => (
              <div
                key={caseStudy.id}
                className="bg-zinc-900 rounded-lg p-6 border border-zinc-800"
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-serif">{caseStudy.title}</h3>
                    <p className="text-sm text-zinc-400">{caseStudy.category} • {caseStudy.year}</p>
                    {caseStudy.slug && (
                      <p className="text-xs text-zinc-500">/{caseStudy.slug}</p>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <Button
                      onClick={() => handleEdit(caseStudy)}
                      variant="outline"
                      size="sm"
                      className="border-zinc-700"
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      onClick={() => handleDelete(caseStudy.slug || caseStudy.id)}
                      variant="outline"
                      size="sm"
                      className="border-red-500 text-red-400 hover:bg-red-500/10"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                {caseStudy.image && (
                  <img
                    src={caseStudy.image}
                    alt={caseStudy.title}
                    className="w-full h-48 object-cover rounded-lg mb-4"
                  />
                )}
                {caseStudy.description ? (
                  <div
                    className="text-zinc-300 mb-2 leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: caseStudy.description }}
                  />
                ) : null}
                {caseStudy.link && (
                  <a
                    href={caseStudy.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline text-sm"
                  >
                    View Project →
                  </a>
                )}
              </div>
            ))}
          </div>
        </div>
          </div>
        </main>
      </div>
    </div>
  )
}

