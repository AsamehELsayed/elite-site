"use client"

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Languages, LogOut } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { apiGet, apiPut } from '@/lib/api'
import { navigationItems } from '@/lib/navigation'

const LOCALES = ['en', 'ar']

export default function TranslationsPage() {
  const router = useRouter()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [selectedLocale, setSelectedLocale] = useState('en')
  const [jsonValue, setJsonValue] = useState('')
  const [status, setStatus] = useState('')
  const [error, setError] = useState('')

  const menuItems = navigationItems

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token')
      if (!token) {
        router.push('/dashboard/login')
        return
      }

      setIsAuthenticated(true)
      await fetchTranslations(selectedLocale)
    }
    
    checkAuth()
  }, [selectedLocale])

  const fetchTranslations = async (locale) => {
    setLoading(true)
    setError('')
    setStatus('')

    try {
      const response = await apiGet(`/api/translations?lang=${locale}`)
      const data = response?.data ?? response ?? {}
      setJsonValue(JSON.stringify(data, null, 2))
    } catch (err) {
      setError(err.message || 'Failed to load translations')
      setJsonValue('')
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    router.push('/dashboard/login')
  }

  const handleFormat = () => {
    try {
      const parsed = JSON.parse(jsonValue)
      setJsonValue(JSON.stringify(parsed, null, 2))
      setStatus('Formatted')
      setError('')
    } catch {
      setError('Please fix JSON before formatting.')
    }
  }

  const handleSave = async () => {
    setSaving(true)
    setError('')
    setStatus('')

    try {
      const parsed = JSON.parse(jsonValue)
      await apiPut(`/api/translations?lang=${selectedLocale}`, {
        translations: parsed,
      })
      setStatus('Translations saved successfully.')
    } catch (err) {
      const message =
        err instanceof SyntaxError
          ? 'Invalid JSON. Please fix formatting.'
          : err.message || 'Failed to save translations.'
      setError(message)
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
              const isActive = item.href === '/dashboard/translations'
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
          <div className="max-w-5xl mx-auto">
            <div className="flex items-center gap-3 mb-4">
              <Languages className="w-6 h-6 text-primary" />
              <div>
                <h1 className="text-3xl font-serif">Translations</h1>
                <p className="text-sm text-zinc-400">Edit en.json and ar.json safely from the dashboard.</p>
              </div>
            </div>

            <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6">
              <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                <div className="flex items-center gap-2">
                  {LOCALES.map((lng) => (
                    <Button
                      key={lng}
                      type="button"
                      variant={selectedLocale === lng ? 'default' : 'outline'}
                      className={selectedLocale === lng ? 'bg-primary text-black' : 'border-zinc-700 text-zinc-300'}
                      onClick={() => setSelectedLocale(lng)}
                    >
                      {lng.toUpperCase()}
                    </Button>
                  ))}
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    className="border-zinc-700 text-zinc-300"
                    onClick={handleFormat}
                    disabled={!jsonValue}
                  >
                    Format JSON
                  </Button>
                  <Button
                    type="button"
                    className="bg-primary text-black"
                    onClick={handleSave}
                    disabled={saving}
                  >
                    {saving ? 'Saving...' : 'Save'}
                  </Button>
                </div>
              </div>

              <p className="text-sm text-zinc-400 mb-3">
                Make sure the JSON structure stays valid. Save to update <code>{selectedLocale}.json</code>.
              </p>

              <Textarea
                value={jsonValue}
                onChange={(e) => setJsonValue(e.target.value)}
                className="bg-zinc-950 border-zinc-800 font-mono text-sm min-h-[520px] text-white"
                spellCheck={false}
              />

              {status && <p className="text-green-400 text-sm mt-3">{status}</p>}
              {error && <p className="text-red-400 text-sm mt-3">{error}</p>}
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

