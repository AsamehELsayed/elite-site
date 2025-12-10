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
  Palette,
  Globe,
  TrendingUp,
  Plus,
  Trash2,
  Save,
  Edit3
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { RichTextEditor } from '@/components/ui/rich-text-editor'
import { ImageUpload } from '@/components/ui/image-upload'
import { apiPut } from '@/lib/api'
import { navigationItems } from '@/lib/navigation'
import { useLocale } from '@/components/locale-provider'

export default function ServicesPage() {
  const router = useRouter()
  const { locale, setLocale } = useLocale()
  const [services, setServices] = useState(null)
  const [loading, setLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [saving, setSaving] = useState(false)

  const [sectionTitle, setSectionTitle] = useState('Comprehensive Solutions')
  const [sectionSubtitle, setSectionSubtitle] = useState('Our Expertise')
  const [servicesList, setServicesList] = useState([
    {
      id: "01",
      title: "Brand Identity",
      description: "Crafting visual systems that speak without words.",
      icon: "Palette",
      iconType: "preset"
    },
    {
      id: "02",
      title: "Digital Experience",
      description: "Immersive web and mobile solutions for the modern age.",
      icon: "Globe",
      iconType: "preset"
    },
    {
      id: "03",
      title: "Content Strategy",
      description: "Narratives that engage, convert, and retain.",
      icon: "FileText",
      iconType: "preset"
    },
    {
      id: "04",
      title: "Growth Marketing",
      description: "Data-driven campaigns for scalable success.",
      icon: "TrendingUp",
      iconType: "preset"
    }
  ])

  const menuItems = navigationItems

  const iconOptions = [
    { value: "Palette", label: "Palette", icon: Palette },
    { value: "Globe", label: "Globe", icon: Globe },
    { value: "FileText", label: "FileText", icon: FileText },
    { value: "TrendingUp", label: "TrendingUp", icon: TrendingUp }
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
    fetchServices()
  }, [router, locale])

  const fetchServices = async () => {
    try {
      const response = await fetch(`/api/services?lang=${locale}`)
      const data = await response.json()
      if (data && !data.error) {
        setServices(data)
        setSectionTitle(data.sectionTitle || 'Comprehensive Solutions')
        setSectionSubtitle(data.sectionSubtitle || 'Our Expertise')
        setServicesList(data.services ? JSON.parse(data.services) : servicesList)
      }
    } catch (error) {
      console.error('Failed to fetch services:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      const formData = {
        sectionTitle,
        sectionSubtitle,
        services: JSON.stringify(servicesList)
      }
      const data = await apiPut(`/api/services?lang=${locale}`, formData)
      setServices(data)
      alert('Services section updated successfully!')
    } catch (error) {
      console.error('Failed to save services:', error)
      const errorMessage = error.message || 'Failed to save services section'
      alert(errorMessage)
    } finally {
      setSaving(false)
    }
  }

  const addService = () => {
    const newId = (servicesList.length + 1).toString().padStart(2, '0')
    setServicesList([...servicesList, {
      id: newId,
      title: '',
      description: '',
      icon: 'Palette',
      iconType: 'preset'
    }])
  }

  const updateService = (index, field, value) => {
    const updated = [...servicesList]
    updated[index][field] = value
    setServicesList(updated)
  }

  const removeService = (index) => {
    if (servicesList.length > 1) {
      setServicesList(servicesList.filter((_, i) => i !== index))
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
              const isActive = item.href === '/dashboard/services'
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
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center justify-between mb-8">
              <h1 className="text-4xl font-serif">Services Section</h1>
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
              <form onSubmit={handleSubmit} className="space-y-8">
                {/* Section Headers */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm mb-2 font-medium">Section Title</label>
                    <Input
                      value={sectionTitle}
                      onChange={(e) => setSectionTitle(e.target.value)}
                      className="bg-zinc-800 border-zinc-700"
                      placeholder="Comprehensive Solutions"
                    />
                  </div>

                  <div>
                    <label className="block text-sm mb-2 font-medium">Section Subtitle</label>
                    <Input
                      value={sectionSubtitle}
                      onChange={(e) => setSectionSubtitle(e.target.value)}
                      className="bg-zinc-800 border-zinc-700"
                      placeholder="Our Expertise"
                    />
                  </div>
                </div>

                {/* Services Management */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold">Services</h3>
                    <Button
                      type="button"
                      onClick={addService}
                      className="bg-green-600 hover:bg-green-700 text-white"
                      size="sm"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add Service
                    </Button>
                  </div>

                  <div className="space-y-4">
                    {servicesList.map((service, index) => (
                      <div key={index} className="border border-zinc-700 rounded-lg p-4 bg-zinc-800/50">
                        <div className="flex items-center justify-between mb-4">
                          <h4 className="font-medium text-primary">Service #{service.id}</h4>
                          <Button
                            type="button"
                            onClick={() => removeService(index)}
                            className="bg-red-600 hover:bg-red-700 text-white"
                            size="sm"
                            disabled={servicesList.length <= 1}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm mb-2">Service Title</label>
                            <Input
                              value={service.title}
                              onChange={(e) => updateService(index, 'title', e.target.value)}
                              className="bg-zinc-700 border-zinc-600"
                              placeholder="e.g., Brand Identity"
                            />
                          </div>

                          <div>
                            <label className="block text-sm mb-2">Icon Type</label>
                            <select
                              value={service.icon.startsWith('http') ? 'custom' : 'preset'}
                              onChange={(e) => updateService(index, 'iconType', e.target.value)}
                              className="w-full bg-zinc-700 border border-zinc-600 rounded px-3 py-2 text-white mb-2"
                            >
                              <option value="preset">Use Preset Icon</option>
                              <option value="custom">Upload Custom Icon</option>
                            </select>

                            {service.iconType === 'custom' || service.icon.startsWith('http') ? (
                              <div>
                                <ImageUpload
                                  value={service.icon.startsWith('http') ? [{ src: service.icon }] : []}
                                  onChange={(images) => {
                                    const imageUrl = images.length > 0 ? images[0].src : ''
                                    updateService(index, 'icon', imageUrl)
                                  }}
                                  multiple={false}
                                  maxImages={1}
                                  className="mb-2"
                                />
                                {service.icon.startsWith('http') && (
                                  <img
                                    src={service.icon}
                                    alt="Custom icon"
                                    className="w-8 h-8 object-cover rounded border border-zinc-600"
                                  />
                                )}
                              </div>
                            ) : (
                              <select
                                value={service.icon}
                                onChange={(e) => updateService(index, 'icon', e.target.value)}
                                className="w-full bg-zinc-700 border border-zinc-600 rounded px-3 py-2 text-white"
                              >
                                <option value="Palette">🎨 Palette (Brand Identity)</option>
                                <option value="Globe">🌐 Globe (Digital Experience)</option>
                                <option value="FileText">📄 FileText (Content Strategy)</option>
                                <option value="TrendingUp">📈 TrendingUp (Growth Marketing)</option>
                              </select>
                            )}
                          </div>
                        </div>

                        <div className="mt-4">
                          <label className="block text-sm mb-2">Description</label>
                          <RichTextEditor
                            value={service.description}
                            onChange={(description) => updateService(index, 'description', description)}
                            className="bg-zinc-800/60"
                            placeholder="Describe what this service offers... (rich text supported)"
                            minHeight={120}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Save Button */}
                <div className="pt-6 border-t border-zinc-700">
                  <Button
                    type="submit"
                    className="w-full bg-primary text-black hover:bg-primary/90"
                    disabled={saving}
                  >
                    <Save className="w-4 h-4 mr-2" />
                    {saving ? 'Saving...' : 'Save All Changes'}
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
