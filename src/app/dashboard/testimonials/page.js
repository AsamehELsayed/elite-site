"use client"

import { useState, useEffect } from 'react'
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
  AlertCircle
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { RichTextEditor } from '@/components/ui/rich-text-editor'
import { apiGet, apiPost, apiPut, apiDelete } from '@/lib/api'
import { navigationItems } from '@/lib/navigation'
import { useLocale } from '@/components/locale-provider'

const getEmptyForm = () => ({
  quote: '',
  author: '',
  role: '',
  city: '',
  metrics: '',
  order: 0
})

export default function TestimonialsPage() {
  const router = useRouter()
  const { locale, setLocale } = useLocale()
  const [testimonials, setTestimonials] = useState([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(null)
  const [formData, setFormData] = useState(getEmptyForm())

  const menuItems = navigationItems

  const handleLogout = () => {
    localStorage.removeItem('token')
    router.push('/dashboard/login')
  }

  useEffect(() => {
    fetchTestimonials()
  }, [locale])

  useEffect(() => {
    // Keep the form aligned with the selected locale to avoid cross-locale overwrites
    if (!editing) {
      setFormData(getEmptyForm())
      return
    }

    const current = testimonials.find((item) => item.id === editing)
    if (!current) {
      setEditing(null)
      setFormData(getEmptyForm())
      return
    }

    setFormData({
      quote: current.quote || '',
      author: current.author || '',
      role: current.role || '',
      city: current.city || '',
      metrics: Array.isArray(current.metrics)
        ? current.metrics.join(', ')
        : current.metrics || '',
      order: current.order ?? 0
    })
  }, [locale, testimonials, editing])

  const fetchTestimonials = async () => {
    try {
      const data = await apiGet(`/api/testimonials?lang=${locale}`)
      setTestimonials(data)
    } catch (error) {
      console.error('Failed to fetch testimonials:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const metricsArray = formData.metrics.split(',').map(m => m.trim()).filter(m => m)
      const payload = {
        ...formData,
        metrics: metricsArray,
        order: parseInt(formData.order) || 0
      }

      if (editing) {
        await apiPut(`/api/testimonials/${editing}?lang=${locale}`, payload)
      } else {
        await apiPost(`/api/testimonials?lang=${locale}`, payload)
      }

      setFormData(getEmptyForm())
      setEditing(null)
      fetchTestimonials()
    } catch (error) {
      console.error('Failed to save testimonial:', error)
      alert('Failed to save testimonial')
    }
  }

  const handleEdit = (testimonial) => {
    setEditing(testimonial.id)
    setFormData({
      quote: testimonial.quote,
      author: testimonial.author,
      role: testimonial.role,
      city: testimonial.city,
      metrics: Array.isArray(testimonial.metrics) ? testimonial.metrics.join(', ') : testimonial.metrics || '',
      order: testimonial.order
    })
  }

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this testimonial?')) return
    try {
      await apiDelete(`/api/testimonials/${id}`)
      fetchTestimonials()
    } catch (error) {
      console.error('Failed to delete testimonial:', error)
      alert('Failed to delete testimonial')
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
              const isActive = item.href === '/dashboard/testimonials'
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
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-serif">Testimonials</h1>
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
              {editing ? 'Edit Testimonial' : 'Add Testimonial'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm mb-2">Quote</label>
                <RichTextEditor
                  value={formData.quote}
                  onChange={(quote) => setFormData({ ...formData, quote })}
                  placeholder="Enter the client's quote (rich text supported)"
                  className="bg-zinc-900/60"
                />
              </div>
              <div>
                <label className="block text-sm mb-2">Author</label>
                <Input
                  value={formData.author}
                  onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                  required
                  className="bg-zinc-800 border-zinc-700"
                />
              </div>
              <div>
                <label className="block text-sm mb-2">Role</label>
                <Input
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  required
                  className="bg-zinc-800 border-zinc-700"
                />
              </div>
              <div>
                <label className="block text-sm mb-2">City</label>
                <Input
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  required
                  className="bg-zinc-800 border-zinc-700"
                />
              </div>
              <div>
                <label className="block text-sm mb-2">Metrics (comma-separated)</label>
                <Input
                  value={formData.metrics}
                  onChange={(e) => setFormData({ ...formData, metrics: e.target.value })}
                  className="bg-zinc-800 border-zinc-700"
                  placeholder="+146% launch conv., 3 week rollout"
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
                {editing ? 'Update' : 'Create'} Testimonial
              </Button>
            </form>
          </div>

          {/* List */}
          <div className="space-y-4">
            {testimonials.map((testimonial) => (
              <div
                key={testimonial.id}
                className="bg-zinc-900 rounded-lg p-6 border border-zinc-800"
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-serif">{testimonial.author}</h3>
                    <p className="text-sm text-zinc-400">{testimonial.role} • {testimonial.city}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      onClick={() => handleEdit(testimonial)}
                      variant="outline"
                      size="sm"
                      className="border-zinc-700"
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      onClick={() => handleDelete(testimonial.id)}
                      variant="outline"
                      size="sm"
                      className="border-red-500 text-red-400 hover:bg-red-500/10"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                {testimonial.quote ? (
                  <div
                    className="text-zinc-300 mb-3 leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: testimonial.quote }}
                  />
                ) : null}
                {Array.isArray(testimonial.metrics) && testimonial.metrics.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {testimonial.metrics.map((metric, idx) => (
                      <span
                        key={idx}
                        className="text-xs px-2 py-1 rounded bg-primary/20 text-primary"
                      >
                        {metric}
                      </span>
                    ))}
                  </div>
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

