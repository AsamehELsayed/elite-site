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
  AlertCircle,
  Menu,
  Wrench,
  Phone,
  Mail,
  File,
  Trash2,
  CheckCircle,
  XCircle,
  Search
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { apiGet, apiPut, apiDelete } from '@/lib/api'
import { navigationItems } from '@/lib/navigation'

export default function NewsletterPage() {
  const router = useRouter()
  const [subscriptions, setSubscriptions] = useState([])
  const [filteredSubscriptions, setFilteredSubscriptions] = useState([])
  const [loading, setLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all") // all, active, unsubscribed

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
    fetchSubscriptions()
  }, [router])

  useEffect(() => {
    // Filter subscriptions based on search term and status
    let filtered = subscriptions

    // Filter by status
    if (statusFilter !== 'all') {
      filtered = filtered.filter(sub => sub.status === statusFilter)
    }

    // Filter by search term
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase()
      filtered = filtered.filter(sub => 
        sub.email.toLowerCase().includes(term)
      )
    }

    setFilteredSubscriptions(filtered)
  }, [subscriptions, searchTerm, statusFilter])

  const fetchSubscriptions = async () => {
    try {
      const data = await apiGet('/api/newsletter')
      setSubscriptions(data)
    } catch (error) {
      console.error('Failed to fetch newsletter subscriptions:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleStatusChange = async (id, newStatus) => {
    try {
      await apiPut(`/api/newsletter/${id}`, { status: newStatus })
      fetchSubscriptions()
    } catch (error) {
      console.error('Failed to update subscription status:', error)
      alert('Failed to update subscription status')
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this newsletter subscription?')) return
    try {
      await apiDelete(`/api/newsletter/${id}`)
      fetchSubscriptions()
    } catch (error) {
      console.error('Failed to delete subscription:', error)
      alert('Failed to delete subscription')
    }
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const activeCount = subscriptions.filter(s => s.status === 'active').length
  const unsubscribedCount = subscriptions.filter(s => s.status === 'unsubscribed').length
  const totalCount = subscriptions.length

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
              const isActive = item.href === '/dashboard/newsletter'
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
          <div className="max-w-7xl mx-auto">
            <div className="mb-8">
              <h1 className="text-4xl font-serif mb-2">Newsletter Subscriptions</h1>
              <p className="text-zinc-400">Manage newsletter subscriber list</p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-zinc-900 rounded-lg p-6 border border-zinc-800">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-zinc-400 mb-1">Total Subscribers</p>
                    <p className="text-3xl font-bold">{totalCount}</p>
                  </div>
                  <Mail className="w-8 h-8 text-primary" />
                </div>
              </div>
              <div className="bg-zinc-900 rounded-lg p-6 border border-zinc-800">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-zinc-400 mb-1">Active</p>
                    <p className="text-3xl font-bold text-primary">{activeCount}</p>
                  </div>
                  <CheckCircle className="w-8 h-8 text-primary" />
                </div>
              </div>
              <div className="bg-zinc-900 rounded-lg p-6 border border-zinc-800">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-zinc-400 mb-1">Unsubscribed</p>
                    <p className="text-3xl font-bold text-red-400">{unsubscribedCount}</p>
                  </div>
                  <XCircle className="w-8 h-8 text-red-400" />
                </div>
              </div>
            </div>

            {/* Filters */}
            <div className="bg-zinc-900 rounded-lg p-6 border border-zinc-800 mb-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400" />
                  <Input
                    type="text"
                    placeholder="Search by email..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="bg-zinc-800 border-zinc-700 pl-10"
                  />
                </div>
                <div>
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-primary"
                  >
                    <option value="all">All Status</option>
                    <option value="active">Active</option>
                    <option value="unsubscribed">Unsubscribed</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Subscriptions List */}
            <div className="bg-zinc-900 rounded-lg border border-zinc-800 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-zinc-800 border-b border-zinc-700">
                    <tr>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-zinc-300">Email</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-zinc-300">Status</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-zinc-300">Subscribed</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-zinc-300">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-800">
                    {filteredSubscriptions.length === 0 ? (
                      <tr>
                        <td colSpan="4" className="px-6 py-12 text-center text-zinc-400">
                          {searchTerm || statusFilter !== 'all' 
                            ? 'No subscriptions found matching your filters'
                            : 'No newsletter subscriptions yet'}
                        </td>
                      </tr>
                    ) : (
                      filteredSubscriptions.map((subscription) => (
                        <tr key={subscription.id} className="hover:bg-zinc-800/50 transition-colors">
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                              <Mail className="w-4 h-4 text-zinc-400" />
                              <span className="text-sm">{subscription.email}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span
                              className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-medium ${
                                subscription.status === 'active'
                                  ? 'bg-primary/20 text-primary'
                                  : 'bg-red-500/20 text-red-400'
                              }`}
                            >
                              {subscription.status === 'active' ? (
                                <>
                                  <CheckCircle className="w-3 h-3" />
                                  Active
                                </>
                              ) : (
                                <>
                                  <XCircle className="w-3 h-3" />
                                  Unsubscribed
                                </>
                              )}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-sm text-zinc-400">
                            {formatDate(subscription.createdAt)}
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                              {subscription.status === 'active' ? (
                                <Button
                                  onClick={() => handleStatusChange(subscription.id, 'unsubscribed')}
                                  variant="outline"
                                  size="sm"
                                  className="border-yellow-500 text-yellow-400 hover:bg-yellow-500/10"
                                >
                                  Unsubscribe
                                </Button>
                              ) : (
                                <Button
                                  onClick={() => handleStatusChange(subscription.id, 'active')}
                                  variant="outline"
                                  size="sm"
                                  className="border-primary text-primary hover:bg-primary/10"
                                >
                                  Reactivate
                                </Button>
                              )}
                              <Button
                                onClick={() => handleDelete(subscription.id)}
                                variant="outline"
                                size="sm"
                                className="border-red-500 text-red-400 hover:bg-red-500/10"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

