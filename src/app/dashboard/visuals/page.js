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
import { ImageUpload } from '@/components/ui/image-upload'
import { apiGet, apiPut } from '@/lib/api'
import { navigationItems } from '@/lib/navigation'
import { useLocale } from '@/components/locale-provider'

export default function VisualsPage() {
  const router = useRouter()
  const { locale, setLocale } = useLocale()
  const [visual, setVisual] = useState(null)
  const [loading, setLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [saving, setSaving] = useState(false)
  const [formData, setFormData] = useState({
    section1Title: '',
    section1Highlight: '',
    section2Title: '',
    section2Highlight: '',
    section3Title: '',
    section3Highlight: '',
    section4Title: '',
    section4Highlight: '',
    section5Title: '',
    section5Highlight: '',
    gallery1Images: [],
    gallery2Images: []
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
    fetchVisual()
  }, [router, locale])

  const fetchVisual = async () => {
    try {
      const data = await apiGet(`/api/visuals?lang=${locale}`)
      if (data && !data.error) {
        setVisual(data)
        setFormData({
          section1Title: data.section1Title || '',
          section1Highlight: data.section1Highlight || '',
          section2Title: data.section2Title || '',
          section2Highlight: data.section2Highlight || '',
          section3Title: data.section3Title || '',
          section3Highlight: data.section3Highlight || '',
          section4Title: data.section4Title || '',
          section4Highlight: data.section4Highlight || '',
          section5Title: data.section5Title || '',
          section5Highlight: data.section5Highlight || '',
          gallery1Images: data.gallery1Images && Array.isArray(data.gallery1Images) ? data.gallery1Images : [],
          gallery2Images: data.gallery2Images && Array.isArray(data.gallery2Images) ? data.gallery2Images : []
        })
      } else if (data && data.error) {
        // Show error message if Prisma Client needs regeneration
        if (data.error.includes('not found') || data.error.includes('undefined')) {
          alert('Visual model not found. Please stop the dev server and run: npm run db:generate')
        }
      }
    } catch (error) {
      console.error('Failed to fetch visual:', error)
      // Don't show alert for normal "no data" case
      if (error.message && !error.message.includes('null')) {
        alert('Failed to fetch visual section. Make sure Prisma Client is regenerated.')
      }
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      const payload = {
        section1Title: formData.section1Title || null,
        section1Highlight: formData.section1Highlight || null,
        section2Title: formData.section2Title || null,
        section2Highlight: formData.section2Highlight || null,
        section3Title: formData.section3Title || null,
        section3Highlight: formData.section3Highlight || null,
        section4Title: formData.section4Title || null,
        section4Highlight: formData.section4Highlight || null,
        section5Title: formData.section5Title || null,
        section5Highlight: formData.section5Highlight || null,
        gallery1Images: Array.isArray(formData.gallery1Images) ? formData.gallery1Images : [],
        gallery2Images: Array.isArray(formData.gallery2Images) ? formData.gallery2Images : []
      }
      
      const data = await apiPut(`/api/visuals?lang=${locale}`, payload)
      setVisual(data)
      alert('Visual section updated successfully!')
    } catch (error) {
      console.error('Failed to save visual:', error)
      const errorMessage = error.message || 'Failed to save visual section.'
      alert(`Failed to save visual section: ${errorMessage}`)
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
              const isActive = item.href === '/dashboard/visuals'
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
        <main className="flex-1 p-8 overflow-y-auto">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center justify-between mb-8 gap-4">
              <h1 className="text-4xl font-serif">Visual Section</h1>
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
            </div>

            <div className="bg-zinc-900 rounded-lg p-6 border border-zinc-800">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Section 1 */}
                <div className="border-b border-zinc-800 pb-6">
                  <h2 className="text-xl font-serif mb-4 text-primary">Section 1 - "Discover What Makes Us"</h2>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm mb-2">Title</label>
                      <Input
                        value={formData.section1Title}
                        onChange={(e) => setFormData({ ...formData, section1Title: e.target.value })}
                        className="bg-zinc-800 border-zinc-700"
                        placeholder="Discover What Makes Us"
                      />
                    </div>
                    <div>
                      <label className="block text-sm mb-2">Highlight Text</label>
                      <Input
                        value={formData.section1Highlight}
                        onChange={(e) => setFormData({ ...formData, section1Highlight: e.target.value })}
                        className="bg-zinc-800 border-zinc-700"
                        placeholder="Truly Elite 👇"
                      />
                    </div>
                  </div>
                </div>

                {/* Section 2 */}
                <div className="border-b border-zinc-800 pb-6">
                  <h2 className="text-xl font-serif mb-4 text-primary">Section 2 - "We craft Digital Experiences"</h2>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm mb-2">Title</label>
                      <Input
                        value={formData.section2Title}
                        onChange={(e) => setFormData({ ...formData, section2Title: e.target.value })}
                        className="bg-zinc-800 border-zinc-700"
                        placeholder="We don't just create designs, We craft"
                      />
                    </div>
                    <div>
                      <label className="block text-sm mb-2">Highlight Text</label>
                      <Input
                        value={formData.section2Highlight}
                        onChange={(e) => setFormData({ ...formData, section2Highlight: e.target.value })}
                        className="bg-zinc-800 border-zinc-700"
                        placeholder="Digital Experiences 💼"
                      />
                    </div>
                  </div>
                </div>

                {/* Section 3 */}
                <div className="border-b border-zinc-800 pb-6">
                  <h2 className="text-xl font-serif mb-4 text-primary">Section 3 - "Success Story"</h2>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm mb-2">Title</label>
                      <Input
                        value={formData.section3Title}
                        onChange={(e) => setFormData({ ...formData, section3Title: e.target.value })}
                        className="bg-zinc-800 border-zinc-700"
                        placeholder="Every Project Tells A"
                      />
                    </div>
                    <div>
                      <label className="block text-sm mb-2">Highlight Text</label>
                      <Input
                        value={formData.section3Highlight}
                        onChange={(e) => setFormData({ ...formData, section3Highlight: e.target.value })}
                        className="bg-zinc-800 border-zinc-700"
                        placeholder="Success Story 😎"
                      />
                    </div>
                  </div>
                </div>

                {/* Section 4 */}
                <div className="border-b border-zinc-800 pb-6">
                  <h2 className="text-xl font-serif mb-4 text-primary">Section 4 - "Elite Design"</h2>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm mb-2">Title</label>
                      <Input
                        value={formData.section4Title}
                        onChange={(e) => setFormData({ ...formData, section4Title: e.target.value })}
                        className="bg-zinc-800 border-zinc-700"
                        placeholder="Witness The Power Of"
                      />
                    </div>
                    <div>
                      <label className="block text-sm mb-2">Highlight Text</label>
                      <Input
                        value={formData.section4Highlight}
                        onChange={(e) => setFormData({ ...formData, section4Highlight: e.target.value })}
                        className="bg-zinc-800 border-zinc-700"
                        placeholder="Elite Design ☝️"
                      />
                    </div>
                  </div>
                </div>

                {/* Section 5 */}
                <div className="border-b border-zinc-800 pb-6">
                  <h2 className="text-xl font-serif mb-4 text-primary">Section 5 - "Stunning Reality"</h2>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm mb-2">Title</label>
                      <Input
                        value={formData.section5Title}
                        onChange={(e) => setFormData({ ...formData, section5Title: e.target.value })}
                        className="bg-zinc-800 border-zinc-700"
                        placeholder="We Turn Your Vision Into"
                      />
                    </div>
                    <div>
                      <label className="block text-sm mb-2">Highlight Text</label>
                      <Input
                        value={formData.section5Highlight}
                        onChange={(e) => setFormData({ ...formData, section5Highlight: e.target.value })}
                        className="bg-zinc-800 border-zinc-700"
                        placeholder="Stunning Reality 😎"
                      />
                    </div>
                  </div>
                </div>

                {/* Gallery 1 */}
                <div className="border-b border-zinc-800 pb-6">
                  <h2 className="text-xl font-serif mb-4 text-primary">Gallery 1 Images</h2>
                  <div>
                    <label className="block text-sm mb-2">Upload Images (with skew options)</label>
                    <ImageUpload
                      value={formData.gallery1Images}
                      onChange={(images) => setFormData({ ...formData, gallery1Images: images })}
                      multiple={true}
                      maxImages={50}
                      showSkewOptions={true}
                    />
                    <p className="text-xs text-zinc-400 mt-2">Drag and drop images or click to browse. You can set skew options for each image.</p>
                  </div>
                </div>

                {/* Gallery 2 */}
                <div className="pb-6">
                  <h2 className="text-xl font-serif mb-4 text-primary">Gallery 2 Images</h2>
                  <div>
                    <label className="block text-sm mb-2">Upload Images</label>
                    <ImageUpload
                      value={formData.gallery2Images}
                      onChange={(images) => setFormData({ ...formData, gallery2Images: images })}
                      multiple={true}
                      maxImages={50}
                    />
                    <p className="text-xs text-zinc-400 mt-2">Drag and drop images or click to browse.</p>
                  </div>
                </div>

                <Button 
                  type="submit" 
                  className="w-full bg-primary text-black"
                  disabled={saving}
                >
                  {saving ? 'Saving...' : 'Save Visual Section'}
                </Button>
              </form>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

