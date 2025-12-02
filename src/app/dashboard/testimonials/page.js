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
  LogOut
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'

export default function TestimonialsPage() {
  const router = useRouter()
  const [testimonials, setTestimonials] = useState([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(null)
  const [formData, setFormData] = useState({
    quote: '',
    author: '',
    role: '',
    city: '',
    metrics: '',
    order: 0
  })

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
    fetchTestimonials()
  }, [])

  const fetchTestimonials = async () => {
    try {
      const response = await fetch('/api/testimonials')
      const data = await response.json()
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
        await fetch(`/api/testimonials/${editing}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        })
      } else {
        await fetch('/api/testimonials', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        })
      }

      setFormData({ quote: '', author: '', role: '', city: '', metrics: '', order: 0 })
      setEditing(null)
      fetchTestimonials()
    } catch (error) {
      console.error('Failed to save testimonial:', error)
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
      await fetch(`/api/testimonials/${id}`, { method: 'DELETE' })
      fetchTestimonials()
    } catch (error) {
      console.error('Failed to delete testimonial:', error)
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
          <Button
            onClick={() => {
              setEditing(null)
              setFormData({ quote: '', author: '', role: '', city: '', metrics: '', order: 0 })
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
                <Textarea
                  value={formData.quote}
                  onChange={(e) => setFormData({ ...formData, quote: e.target.value })}
                  required
                  className="bg-zinc-800 border-zinc-700"
                  rows={4}
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
                <p className="text-zinc-300 mb-3">"{testimonial.quote}"</p>
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

