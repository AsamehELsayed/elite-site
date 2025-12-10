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
  Trash2,
  RefreshCw
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { apiGet, apiDelete } from '@/lib/api'
import { navigationItems } from '@/lib/navigation'

export default function ErrorLogsPage() {
  const router = useRouter()
  const [logs, setLogs] = useState([])
  const [loading, setLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

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
    fetchErrorLogs()
  }, [router])

  const fetchErrorLogs = async () => {
    try {
      setLoading(true)
      const data = await apiGet('/api/logs/errors')
      setLogs(data || [])
    } catch (error) {
      console.error('Failed to fetch error logs:', error)
      alert('Failed to fetch error logs')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this error log?')) {
      return
    }

    try {
      await apiDelete(`/api/logs/${id}`)
      setLogs(logs.filter(log => log.id !== id))
      alert('Error log deleted successfully')
    } catch (error) {
      console.error('Failed to delete error log:', error)
      alert('Failed to delete error log')
    }
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString()
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
              const isActive = item.href === '/dashboard/error-logs'
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
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="text-4xl font-serif mb-2">Error Logs</h1>
                <p className="text-zinc-400">View and manage application error logs</p>
              </div>
              <Button
                onClick={fetchErrorLogs}
                variant="outline"
                className="border-zinc-700 text-zinc-300 hover:bg-zinc-800"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Refresh
              </Button>
            </div>

            {/* Error Count */}
            <div className="mb-6 p-4 bg-red-950/20 border border-red-400/20 rounded-lg">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-red-400" />
                <span className="text-red-400 font-medium">
                  {logs.length} error{logs.length !== 1 ? 's' : ''} found
                </span>
              </div>
            </div>

            {/* Error Logs List */}
            <div className="bg-zinc-900 rounded-lg border border-zinc-800">
              {logs.length === 0 ? (
                <div className="p-8 text-center text-zinc-400">
                  <AlertCircle className="w-12 h-12 mx-auto mb-4 text-zinc-600" />
                  <p>No error logs found. Great job!</p>
                </div>
              ) : (
                <div className="divide-y divide-zinc-800">
                  {logs.map((log) => (
                    <div key={log.id} className="p-4 hover:bg-zinc-800/50 transition-colors">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <span className="px-2 py-1 rounded text-xs font-medium border text-red-400 bg-red-400/10 border-red-400/20">
                              ERROR
                            </span>
                            <span className="text-sm text-zinc-400">
                              {formatDate(log.createdAt)}
                            </span>
                            {log.userId && (
                              <span className="text-sm text-zinc-500">
                                User: {log.userId}
                              </span>
                            )}
                          </div>
                          <p className="text-white mb-2 font-medium">{log.message}</p>
                          {log.context && (
                            <pre className="text-xs text-zinc-400 bg-zinc-950 p-2 rounded mt-2 overflow-x-auto">
                              {JSON.stringify(log.context, null, 2)}
                            </pre>
                          )}
                          {log.stack && (
                            <details className="mt-2">
                              <summary className="text-xs text-red-400 cursor-pointer hover:text-red-300">
                                Show Stack Trace
                              </summary>
                              <pre className="text-xs text-red-400 bg-red-950/20 p-2 rounded mt-2 overflow-x-auto">
                                {log.stack}
                              </pre>
                            </details>
                          )}
                          {log.ipAddress && (
                            <p className="text-xs text-zinc-500 mt-1">
                              IP: {log.ipAddress}
                            </p>
                          )}
                        </div>
                        <Button
                          onClick={() => handleDelete(log.id)}
                          variant="ghost"
                          size="sm"
                          className="text-red-400 hover:text-red-300 hover:bg-red-950/20"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

