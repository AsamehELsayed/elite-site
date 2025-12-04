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
  Image as ImageIcon
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { apiGet, apiPost, apiPut, apiDelete } from '@/lib/api'

export default function StatsPage() {
  const router = useRouter()
  const [stats, setStats] = useState([])
  const [loading, setLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [editing, setEditing] = useState(null)
  const [formData, setFormData] = useState({
    label: '',
    value: '',
    order: 0
  })

  const menuItems = [
    { icon: Home, label: 'Hero Section', href: '/dashboard/hero' },
    { icon: BookOpen, label: 'Philosophy', href: '/dashboard/philosophy' },
    { icon: ImageIcon, label: 'Visuals', href: '/dashboard/visuals' },
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
    fetchStats()
  }, [router])

  const fetchStats = async () => {
    try {
      const data = await apiGet('/api/stats')
      setStats(data)
    } catch (error) {
      console.error('Failed to fetch stats:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const payload = {
        ...formData,
        order: parseInt(formData.order) || 0
      }

      if (editing) {
        await apiPut(`/api/stats/${editing}`, payload)
      } else {
        await apiPost('/api/stats', payload)
      }

      setFormData({ label: '', value: '', order: 0 })
      setEditing(null)
      fetchStats()
    } catch (error) {
      console.error('Failed to save stat:', error)
      alert('Failed to save stat')
    }
  }

  const handleEdit = (stat) => {
    setEditing(stat.id)
    setFormData({
      label: stat.label,
      value: stat.value,
      order: stat.order
    })
  }

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this stat?')) return
    try {
      await apiDelete(`/api/stats/${id}`)
      fetchStats()
    } catch (error) {
      console.error('Failed to delete stat:', error)
      alert('Failed to delete stat')
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
              const isActive = item.href === '/dashboard/stats'
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
          <h1 className="text-4xl font-serif">Stats</h1>
          <Button
            onClick={() => {
              setEditing(null)
              setFormData({ label: '', value: '', order: 0 })
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
              {editing ? 'Edit Stat' : 'Add Stat'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm mb-2">Label</label>
                <Input
                  value={formData.label}
                  onChange={(e) => setFormData({ ...formData, label: e.target.value })}
                  required
                  className="bg-zinc-800 border-zinc-700"
                  placeholder="e.g., Projects Completed"
                />
              </div>
              <div>
                <label className="block text-sm mb-2">Value</label>
                <Input
                  value={formData.value}
                  onChange={(e) => setFormData({ ...formData, value: e.target.value })}
                  required
                  className="bg-zinc-800 border-zinc-700"
                  placeholder="e.g., 150+"
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
                {editing ? 'Update' : 'Create'} Stat
              </Button>
            </form>
          </div>

          {/* List */}
          <div className="space-y-4">
            {stats.map((stat) => (
              <div
                key={stat.id}
                className="bg-zinc-900 rounded-lg p-6 border border-zinc-800"
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-serif">{stat.value}</h3>
                    <p className="text-sm text-zinc-400">{stat.label}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      onClick={() => handleEdit(stat)}
                      variant="outline"
                      size="sm"
                      className="border-zinc-700"
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      onClick={() => handleDelete(stat.id)}
                      variant="outline"
                      size="sm"
                      className="border-red-500 text-red-400 hover:bg-red-500/10"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
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

