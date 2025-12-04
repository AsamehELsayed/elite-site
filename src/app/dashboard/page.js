"use client"

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { 
  LayoutDashboard, 
  MessageSquare, 
  Briefcase, 
  BookOpen, 
  Home, 
  BarChart3,
  Calendar,
  LogOut,
  Image as ImageIcon
} from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function DashboardPage() {
  const router = useRouter()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) {
      router.push('/dashboard/login')
      return
    }
    setIsAuthenticated(true)
    setLoading(false)
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem('token')
    router.push('/dashboard/login')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return null
  }

  const menuItems = [
    { icon: Home, label: 'Hero Section', href: '/dashboard/hero' },
    { icon: BookOpen, label: 'Philosophy', href: '/dashboard/philosophy' },
    { icon: ImageIcon, label: 'Visuals', href: '/dashboard/visuals' },
    { icon: MessageSquare, label: 'Testimonials', href: '/dashboard/testimonials' },
    { icon: Briefcase, label: 'Case Studies', href: '/dashboard/case-studies' },
    { icon: BarChart3, label: 'Stats', href: '/dashboard/stats' },
    { icon: Calendar, label: 'Contact Bookings', href: '/dashboard/contact-bookings' },
  ]

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-zinc-900 border-r border-zinc-800 min-h-screen p-6">
          <div className="mb-8">
            <h1 className="text-2xl font-serif text-primary">Elite Dashboard</h1>
            <p className="text-sm text-zinc-400 mt-1">Content Management</p>
          </div>
          
          <nav className="space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center gap-3 px-4 py-3 rounded-lg text-zinc-300 hover:bg-zinc-800 hover:text-white transition-colors"
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
            <h2 className="text-4xl font-serif mb-2">Dashboard</h2>
            <p className="text-zinc-400 mb-8">Manage your website content</p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {menuItems.map((item) => {
                const Icon = item.icon
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="block p-6 rounded-lg border border-zinc-800 bg-zinc-900 hover:border-primary hover:bg-zinc-800 transition-all"
                  >
                    <Icon className="w-8 h-8 text-primary mb-4" />
                    <h3 className="text-xl font-serif mb-2">{item.label}</h3>
                    <p className="text-sm text-zinc-400">Manage {item.label.toLowerCase()}</p>
                  </Link>
                )
              })}
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}


