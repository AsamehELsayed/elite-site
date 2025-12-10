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
import { apiPut } from '@/lib/api'
import { navigationItems } from '@/lib/navigation'
import { useLocale } from '@/components/locale-provider'

export default function PhilosophyPage() {
  const router = useRouter()
  const { locale, setLocale } = useLocale()
  const [philosophy, setPhilosophy] = useState(null)
  const [loading, setLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    content: ''
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
    fetchPhilosophy()
  }, [router, locale])

  const fetchPhilosophy = async () => {
    try {
      const response = await fetch(`/api/philosophy?lang=${locale}`)
      const data = await response.json()
      if (data && !data.error) {
        setPhilosophy(data)
        setFormData({
          title: data.title || '',
          content: data.content || ''
        })
      }
    } catch (error) {
      console.error('Failed to fetch philosophy:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      const data = await apiPut(`/api/philosophy?lang=${locale}`, formData)
      setPhilosophy(data)
      alert('Philosophy updated successfully!')
    } catch (error) {
      console.error('Failed to save philosophy:', error)
      alert('Failed to save philosophy')
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
              const isActive = item.href === '/dashboard/philosophy'
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
            <div className="flex items-center justify-between mb-8">
              <h1 className="text-4xl font-serif">Philosophy</h1>
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

            <div className="bg-zinc-900 rounded-lg p-6 border border-zinc-800">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm mb-2">Title (optional)</label>
              <Input
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="bg-zinc-800 border-zinc-700"
                placeholder="Philosophy section title"
              />
            </div>
            <div>
              <label className="block text-sm mb-2">Content</label>
              <RichTextEditor
                value={formData.content}
                onChange={(content) => setFormData({ ...formData, content })}
                className="bg-zinc-900/60"
                placeholder="Philosophy content... (rich text supported)"
                minHeight={200}
              />
            </div>
            <Button 
              type="submit" 
              className="w-full bg-primary text-black"
              disabled={saving}
            >
              {saving ? 'Saving...' : 'Save Philosophy'}
            </Button>
          </form>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

