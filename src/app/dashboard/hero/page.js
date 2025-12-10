"use client"

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  Home,
  BookOpen,
  MessageSquare,
  Briefcase,
  BarChart3,
  Calendar,
  LogOut,
  Image as ImageIcon,
  FileText,
  AlertCircle
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { RichTextEditor } from '@/components/ui/rich-text-editor'
import { apiPut, authenticatedFetch } from '@/lib/api'
import { navigationItems } from '@/lib/navigation'
import { useLocale } from '@/components/locale-provider'

export default function HeroPage() {
  const router = useRouter()
  const { locale, setLocale } = useLocale()
  const [hero, setHero] = useState(null)
  const [loading, setLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [videoUploading, setVideoUploading] = useState(false)
  const [videoMessage, setVideoMessage] = useState('')
  const [selectedVideo, setSelectedVideo] = useState(null)
  const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
    description: '',
    ctaText: '',
    ctaLink: ''
  })
  const [saving, setSaving] = useState(false)

  const menuItems = navigationItems

  const handleLogout = () => {
    localStorage.removeItem('token')
    router.push('/dashboard/login')
  }

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) {
      router.push('/dashboard/login')
      return
    }
    setIsAuthenticated(true)
    fetchHero()
  }, [router, locale])

  const fetchHero = async () => {
    try {
      const response = await fetch(`/api/hero?lang=${locale}`)
      const data = await response.json()
      if (data && !data.error) {
        setHero(data)
        setFormData({
          title: data.title || '',
          subtitle: data.subtitle || '',
          description: data.description || '',
          ctaText: data.ctaText || '',
          ctaLink: data.ctaLink || ''
        })
      }
    } catch (error) {
      console.error('Failed to fetch hero:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      const data = await apiPut(`/api/hero?lang=${locale}`, formData)
      setHero(data)
      alert('Hero section updated successfully!')
    } catch (error) {
      console.error('Failed to save hero:', error)
      const errorMessage = error.message || 'Failed to save hero section'
      alert(errorMessage)
    } finally {
      setSaving(false)
    }
  }

  const handleVideoChange = (event) => {
    const file = event.target.files?.[0]
    setSelectedVideo(file || null)
    setVideoMessage('')
  }

  const handleVideoUpload = async () => {
    if (!selectedVideo) {
      alert('Please choose a video file first.')
      return
    }

    setVideoUploading(true)
    setVideoMessage('')

    try {
      const formData = new FormData()
      formData.append('file', selectedVideo)

      const response = await authenticatedFetch('/api/hero/video', {
        method: 'POST',
        body: formData
      })

      const result = await response.json()
      if (!response.ok) {
        throw new Error(result?.error || 'Failed to upload video')
      }

      setVideoMessage('Hero video updated and optimized successfully.')
      setSelectedVideo(null)
    } catch (error) {
      console.error('Video upload failed:', error)
      alert(error.message || 'Failed to upload video')
    } finally {
      setVideoUploading(false)
    }
  }

  if (loading || !isAuthenticated) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    )
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
              const isActive = item.href === '/dashboard/hero'
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
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl font-serif mb-8">Hero Section</h1>

            <div className="bg-zinc-900 rounded-lg p-6 border border-zinc-800">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Language</h2>
            <div className="flex gap-2">
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
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm mb-2">Title</label>
              <Input
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="bg-zinc-800 border-zinc-700"
                placeholder="Main headline"
              />
            </div>
            <div>
              <label className="block text-sm mb-2">Subtitle</label>
              <Input
                value={formData.subtitle}
                onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                className="bg-zinc-800 border-zinc-700"
                placeholder="Supporting headline"
              />
            </div>
            <div>
              <label className="block text-sm mb-2">Description</label>
              <RichTextEditor
                value={formData.description}
                onChange={(description) => setFormData({ ...formData, description })}
                placeholder="Hero section description (supports bold, lists, underline)"
                className="bg-zinc-900/60"
              />
            </div>
            <div>
              <label className="block text-sm mb-2">CTA Text</label>
              <Input
                value={formData.ctaText}
                onChange={(e) => setFormData({ ...formData, ctaText: e.target.value })}
                className="bg-zinc-800 border-zinc-700"
                placeholder="Button text"
              />
            </div>
            <div>
              <label className="block text-sm mb-2">CTA Link</label>
              <Input
                value={formData.ctaLink}
                onChange={(e) => setFormData({ ...formData, ctaLink: e.target.value })}
                className="bg-zinc-800 border-zinc-700"
                placeholder="/contact or https://..."
              />
            </div>
            <Button 
              type="submit" 
              className="w-full bg-primary text-black"
              disabled={saving}
            >
              {saving ? 'Saving...' : 'Save Hero Section'}
            </Button>
          </form>
            </div>

            <div className="bg-zinc-900 rounded-lg p-6 border border-zinc-800 mt-6">
              <div className="space-y-4">
                <div>
                  <h2 className="text-2xl font-serif mb-2">Hero Background Video</h2>
                  <p className="text-sm text-zinc-400">
                    Upload a new video to replace the site-wide hero background. The file will be compressed into MP4 and WEBM and served from /hero-video.mp4 and /hero-video.webm.
                  </p>
                </div>
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                  <Input
                    type="file"
                    accept="video/mp4,video/webm,video/quicktime,video/x-matroska"
                    onChange={handleVideoChange}
                    className="bg-zinc-800 border-zinc-700"
                  />
                  <Button
                    type="button"
                    onClick={handleVideoUpload}
                    disabled={videoUploading || !selectedVideo}
                    className="bg-white text-black hover:bg-primary hover:text-black"
                  >
                    {videoUploading ? 'Uploading...' : 'Upload & Optimize'}
                  </Button>
                </div>
                {videoMessage && (
                  <p className="text-green-400 text-sm">{videoMessage}</p>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

