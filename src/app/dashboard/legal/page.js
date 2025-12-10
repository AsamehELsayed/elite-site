"use client"

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { LogOut, Save } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { RichTextEditor } from '@/components/ui/rich-text-editor'
import { apiPut } from '@/lib/api'
import { navigationItems } from '@/lib/navigation'
import { useLocale } from '@/components/locale-provider'

export default function LegalDashboardPage() {
  const router = useRouter()
  const { locale, setLocale } = useLocale()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [formData, setFormData] = useState({
    privacyTitle: 'Privacy Policy',
    privacyContent: '',
    termsTitle: 'Terms & Conditions',
    termsContent: '',
  })

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
    fetchLegal()
  }, [router, locale])

  const fetchLegal = async () => {
    try {
      const response = await fetch(`/api/legal?lang=${locale}`)
      const data = await response.json()
      if (data && !data.error) {
        setFormData({
          privacyTitle: data.privacyTitle || 'Privacy Policy',
          privacyContent: data.privacyContent || '',
          termsTitle: data.termsTitle || 'Terms & Conditions',
          termsContent: data.termsContent || '',
        })
      }
    } catch (error) {
      console.error('Failed to fetch legal content:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      const payload = {
        privacyTitle: formData.privacyTitle,
        privacyContent: formData.privacyContent,
        termsTitle: formData.termsTitle,
        termsContent: formData.termsContent,
      }
      const data = await apiPut(`/api/legal?lang=${locale}`, payload)
      setFormData({
        privacyTitle: data.privacyTitle || payload.privacyTitle,
        privacyContent: data.privacyContent || payload.privacyContent,
        termsTitle: data.termsTitle || payload.termsTitle,
        termsContent: data.termsContent || payload.termsContent,
      })
      alert('Legal content updated successfully!')
    } catch (error) {
      console.error('Failed to save legal content:', error)
      const message = error?.message || 'Failed to save legal content'
      alert(message)
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
              const isActive = item.href === '/dashboard/legal'
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
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="text-4xl font-serif">Legal</h1>
                <p className="text-zinc-400">Manage privacy policy and terms & conditions</p>
              </div>
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
              <form onSubmit={handleSubmit} className="space-y-10">
                {/* Privacy */}
                <section className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm uppercase tracking-[0.2em] text-primary">Privacy</p>
                      <h2 className="text-2xl font-semibold mt-1">Privacy Policy</h2>
                    </div>
                    <span className="rounded-full bg-white/5 px-3 py-1 text-xs text-zinc-300 border border-white/10">
                      Public page: /privacy
                    </span>
                  </div>
                  <div className="grid grid-cols-1 gap-4">
                    <div>
                      <label className="block text-sm mb-2 font-medium">Title</label>
                      <Input
                        value={formData.privacyTitle}
                        onChange={(e) => setFormData({ ...formData, privacyTitle: e.target.value })}
                        className="bg-zinc-800 border-zinc-700"
                        placeholder="Privacy Policy"
                      />
                    </div>
                    <div>
                      <label className="block text-sm mb-2 font-medium">Content</label>
                      <RichTextEditor
                        value={formData.privacyContent}
                        onChange={(value) => setFormData({ ...formData, privacyContent: value })}
                        className="bg-zinc-900/60"
                        placeholder="Privacy policy content... (rich text supported)"
                        minHeight={220}
                      />
                    </div>
                  </div>
                </section>

                {/* Terms */}
                <section className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm uppercase tracking-[0.2em] text-primary">Terms</p>
                      <h2 className="text-2xl font-semibold mt-1">Terms & Conditions</h2>
                    </div>
                    <span className="rounded-full bg-white/5 px-3 py-1 text-xs text-zinc-300 border border-white/10">
                      Public page: /terms
                    </span>
                  </div>
                  <div className="grid grid-cols-1 gap-4">
                    <div>
                      <label className="block text-sm mb-2 font-medium">Title</label>
                      <Input
                        value={formData.termsTitle}
                        onChange={(e) => setFormData({ ...formData, termsTitle: e.target.value })}
                        className="bg-zinc-800 border-zinc-700"
                        placeholder="Terms & Conditions"
                      />
                    </div>
                    <div>
                      <label className="block text-sm mb-2 font-medium">Content</label>
                      <RichTextEditor
                        value={formData.termsContent}
                        onChange={(value) => setFormData({ ...formData, termsContent: value })}
                        className="bg-zinc-900/60"
                        placeholder="Terms content... (rich text supported)"
                        minHeight={220}
                      />
                    </div>
                  </div>
                </section>

                <div className="pt-4 border-t border-zinc-800">
                  <Button
                    type="submit"
                    className="w-full bg-primary text-black hover:bg-primary/90"
                    disabled={saving}
                  >
                    <Save className="w-4 h-4 mr-2" />
                    {saving ? 'Saving...' : 'Save Legal Content'}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

