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
  day: '',
  date: '',
  slots: '',
  order: 0
})

export default function ContactBookingsPage() {
  const router = useRouter()
  const { locale, setLocale } = useLocale()
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [editing, setEditing] = useState(null)
  const [formData, setFormData] = useState(getEmptyForm())

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
    fetchBookings()
  }, [router, locale])

  useEffect(() => {
    // Keep form values in sync with the selected locale so edits don't bleed across languages
    if (!editing) {
      setFormData(getEmptyForm())
      return
    }

    const current = bookings.find((item) => item.id === editing)
    if (!current) {
      setEditing(null)
      setFormData(getEmptyForm())
      return
    }

    setFormData({
      day: current.day || '',
      date: current.date || '',
      slots: Array.isArray(current.slots)
        ? current.slots.join(', ')
        : current.slots || '',
      order: current.order ?? 0
    })
  }, [locale, bookings, editing])

  const stripHtml = (value = '') =>
    value.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim()

  const fetchBookings = async () => {
    try {
      const data = await apiGet(`/api/contact-bookings?lang=${locale}`)
      setBookings(data)
    } catch (error) {
      console.error('Failed to fetch contact bookings:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const slotsPlain = stripHtml(formData.slots || '')
      const slotsArray = slotsPlain.split(',').map(s => s.trim()).filter(s => s)
      const payload = {
        ...formData,
        slots: slotsArray,
        order: parseInt(formData.order) || 0
      }

      if (editing) {
        await apiPut(`/api/contact-bookings/${editing}?lang=${locale}`, payload)
      } else {
        await apiPost(`/api/contact-bookings?lang=${locale}`, payload)
      }

      setFormData(getEmptyForm())
      setEditing(null)
      fetchBookings()
    } catch (error) {
      console.error('Failed to save contact booking:', error)
      alert('Failed to save contact booking')
    }
  }

  const handleEdit = (booking) => {
    setEditing(booking.id)
    setFormData({
      day: booking.day,
      date: booking.date,
      slots: Array.isArray(booking.slots) ? booking.slots.join(', ') : booking.slots || '',
      order: booking.order
    })
  }

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this contact booking?')) return
    try {
      await apiDelete(`/api/contact-bookings/${id}`)
      fetchBookings()
    } catch (error) {
      console.error('Failed to delete contact booking:', error)
      alert('Failed to delete contact booking')
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
              const isActive = item.href === '/dashboard/contact-bookings'
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
          <h1 className="text-4xl font-serif">Contact Bookings</h1>
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
              {editing ? 'Edit Contact Booking' : 'Add Contact Booking'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm mb-2">Day</label>
                <Input
                  value={formData.day}
                  onChange={(e) => setFormData({ ...formData, day: e.target.value })}
                  required
                  className="bg-zinc-800 border-zinc-700"
                  placeholder="e.g., Monday"
                />
              </div>
              <div>
                <label className="block text-sm mb-2">Date</label>
                <Input
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  required
                  className="bg-zinc-800 border-zinc-700"
                  placeholder="e.g., Jan 15"
                />
              </div>
              <div>
                <label className="block text-sm mb-2">Slots (comma-separated)</label>
                <RichTextEditor
                  value={formData.slots}
                  onChange={(slots) => setFormData({ ...formData, slots })}
                  className="bg-zinc-900/60"
                  placeholder="9:00 AM, 10:00 AM, 2:00 PM (rich text supported)"
                  minHeight={120}
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
                {editing ? 'Update' : 'Create'} Contact Booking
              </Button>
            </form>
          </div>

          {/* List */}
          <div className="space-y-4">
            {bookings.map((booking) => (
              <div
                key={booking.id}
                className="bg-zinc-900 rounded-lg p-6 border border-zinc-800"
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-serif">{booking.day}</h3>
                    <p className="text-sm text-zinc-400">{booking.date}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      onClick={() => handleEdit(booking)}
                      variant="outline"
                      size="sm"
                      className="border-zinc-700"
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      onClick={() => handleDelete(booking.id)}
                      variant="outline"
                      size="sm"
                      className="border-red-500 text-red-400 hover:bg-red-500/10"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                {Array.isArray(booking.slots) && booking.slots.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {booking.slots.map((slot, idx) => (
                      <span
                        key={idx}
                        className="text-xs px-2 py-1 rounded bg-primary/20 text-primary"
                      >
                        {slot}
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

