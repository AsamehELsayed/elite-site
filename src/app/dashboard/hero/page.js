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
  LogOut
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'

export default function HeroPage() {
  const router = useRouter()
  const [hero, setHero] = useState(null)
  const [loading, setLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
    description: '',
    ctaText: '',
    ctaLink: ''
  })
  const [saving, setSaving] = useState(false)

  const menuItems = [
    { icon: Home, label: 'Hero Section', href: '/dashboard/hero' },
    { icon: BookOpen, label: 'Philosophy', href: '/dashboard/philosophy' },
    { icon: MessageSquare, label: 'Testimonials', href: '/dashboard/testimonials' },
    { icon: Briefcase, label: 'Case Studies', href: '/dashboard/case-studies' },
    { icon: BarChart3, label: 'Stats', href: '/dashboard/stats' },
    { icon: Calendar, label: 'Contact Bookings', href: '/dashboard/contact-bookings' },
  ]

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
  }, [router])

  const fetchHero = async () => {
    try {
      const response = await fetch('/api/hero')
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
      const response = await fetch('/api/hero', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      if (!response.ok) {
        throw new Error('Failed to save hero')
      }

      const data = await response.json()
      setHero(data)
      alert('Hero section updated successfully!')
    } catch (error) {
      console.error('Failed to save hero:', error)
      alert('Failed to save hero section')
    } finally {
      setSaving(false)
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
              <Textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="bg-zinc-800 border-zinc-700"
                rows={4}
                placeholder="Hero section description"
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
          </div>
        </main>
      </div>
    </div>
  )
}

