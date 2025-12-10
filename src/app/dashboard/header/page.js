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
  Phone,
  Mail,
  Globe,
  Camera,
  Hash,
  Plus,
  Trash2,
  Save,
  Edit3
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ImageUpload } from '@/components/ui/image-upload'
import { apiPut } from '@/lib/api'
import { navigationItems } from '@/lib/navigation'
import { useLocale } from '@/components/locale-provider'

export default function HeaderPage() {
  const router = useRouter()
  const { locale, setLocale } = useLocale()
  const [header, setHeader] = useState(null)
  const [loading, setLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [saving, setSaving] = useState(false)

  const [companyName, setCompanyName] = useState('ELITE.')
  const [phone, setPhone] = useState('+201009957000')
  const [email, setEmail] = useState('info@be-group.com')
  const [sinceYear, setSinceYear] = useState('20')
  const [footerText, setFooterText] = useState('Market Reference')

  const [navLinks, setNavLinks] = useState([
    { name: "Home", href: "#home" },
    { name: "Services", href: "#services" },
    { name: "Portfolio", href: "#work" },
    { name: "Contact Us", href: "#contact" }
  ])

  const [serviceLinks, setServiceLinks] = useState([
    "Web Development",
    "Mobile App",
    "Branding",
    "Social Media Management",
    "Google Adword",
    "Media Production"
  ])

  const [socialLinks, setSocialLinks] = useState([
    { platform: "Facebook", url: "#" },
    { platform: "Instagram", url: "#" },
    { platform: "Twitter", url: "#" }
  ])

  const [galleryImages, setGalleryImages] = useState([
    { src: "https://images.unsplash.com/photo-1529333166437-7750a6dd5a70?auto=format&fit=crop&w=800&q=80", caption: "Creative Studio" },
    { src: "https://images.unsplash.com/photo-1489515217757-5fd1be406fef?auto=format&fit=crop&w=800&q=80", caption: "Digital Lab" },
    { src: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=800&q=80", caption: "Brand Session" },
    { src: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80", caption: "Campaign Hub" }
  ])

  const menuItems = navigationItems

  const tabs = [
    { id: 'branding', label: 'Branding', icon: Hash },
    { id: 'navigation', label: 'Navigation', icon: Navigation },
    { id: 'contact', label: 'Contact Info', icon: Phone },
    { id: 'social', label: 'Social Links', icon: Globe },
    { id: 'gallery', label: 'Gallery', icon: Camera }
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
    fetchHeader()
  }, [router, locale])

  const fetchHeader = async () => {
    try {
      const response = await fetch(`/api/header?lang=${locale}`)
      const data = await response.json()
      if (data && !data.error) {
        setHeader(data)
        setCompanyName(data.companyName || 'ELITE.')
        setNavLinks(data.navLinks ? JSON.parse(data.navLinks) : navLinks)
        setServiceLinks(data.serviceLinks ? JSON.parse(data.serviceLinks) : serviceLinks)
        setPhone(data.phone || '+201009957000')
        setEmail(data.email || 'info@be-group.com')
        setSocialLinks(data.socialLinks ? JSON.parse(data.socialLinks) : socialLinks)
        setGalleryImages(data.galleryImages ? JSON.parse(data.galleryImages) : galleryImages)
        setSinceYear(data.sinceYear || '20')
        setFooterText(data.footerText || 'Market Reference')
      }
    } catch (error) {
      console.error('Failed to fetch header:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      const formData = {
        companyName,
        navLinks: JSON.stringify(navLinks),
        serviceLinks: JSON.stringify(serviceLinks),
        phone,
        email,
        socialLinks: JSON.stringify(socialLinks),
        galleryImages: JSON.stringify(galleryImages),
        sinceYear,
        footerText
      }
      const data = await apiPut(`/api/header?lang=${locale}`, formData)
      setHeader(data)
      alert('Header section updated successfully!')
    } catch (error) {
      console.error('Failed to save header:', error)
      const errorMessage = error.message || 'Failed to save header section'
      alert(errorMessage)
    } finally {
      setSaving(false)
    }
  }

  const addNavLink = () => {
    setNavLinks([...navLinks, { name: '', href: '#' }])
  }

  const updateNavLink = (index, field, value) => {
    const updated = [...navLinks]
    updated[index][field] = value
    setNavLinks(updated)
  }

  const removeNavLink = (index) => {
    if (navLinks.length > 1) {
      setNavLinks(navLinks.filter((_, i) => i !== index))
    }
  }

  const addServiceLink = () => {
    setServiceLinks([...serviceLinks, ''])
  }

  const updateServiceLink = (index, value) => {
    const updated = [...serviceLinks]
    updated[index] = value
    setServiceLinks(updated)
  }

  const removeServiceLink = (index) => {
    if (serviceLinks.length > 1) {
      setServiceLinks(serviceLinks.filter((_, i) => i !== index))
    }
  }

  const addSocialLink = () => {
    setSocialLinks([...socialLinks, { platform: '', url: '#' }])
  }

  const updateSocialLink = (index, field, value) => {
    const updated = [...socialLinks]
    updated[index][field] = value
    setSocialLinks(updated)
  }

  const removeSocialLink = (index) => {
    if (socialLinks.length > 1) {
      setSocialLinks(socialLinks.filter((_, i) => i !== index))
    }
  }

  const addGalleryImage = () => {
    setGalleryImages([...galleryImages, { src: '', caption: '' }])
  }

  const updateGalleryImage = (index, field, value) => {
    const updated = [...galleryImages]
    updated[index][field] = value
    setGalleryImages(updated)
  }

  const removeGalleryImage = (index) => {
    if (galleryImages.length > 1) {
      setGalleryImages(galleryImages.filter((_, i) => i !== index))
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
              const isActive = item.href === '/dashboard/header'
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
            <div className="flex items-center justify-between mb-8">
              <h1 className="text-4xl font-serif">Header & Navigation</h1>
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
                {/* Branding Section */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm mb-2 font-medium">Company Name</label>
                    <Input
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      className="bg-zinc-800 border-zinc-700"
                      placeholder="ELITE."
                    />
                  </div>
                  <div>
                    <label className="block text-sm mb-2 font-medium">Since Year</label>
                    <Input
                      value={sinceYear}
                      onChange={(e) => setSinceYear(e.target.value)}
                      className="bg-zinc-800 border-zinc-700"
                      placeholder="20"
                    />
                  </div>
                  <div>
                    <label className="block text-sm mb-2 font-medium">Footer Text</label>
                    <Input
                      value={footerText}
                      onChange={(e) => setFooterText(e.target.value)}
                      className="bg-zinc-800 border-zinc-700"
                      placeholder="Market Reference"
                    />
                  </div>
                </div>

                {/* Contact Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm mb-2 font-medium">Phone Number</label>
                    <Input
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="bg-zinc-800 border-zinc-700"
                      placeholder="+201009957000"
                    />
                  </div>
                  <div>
                    <label className="block text-sm mb-2 font-medium">Email Address</label>
                    <Input
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="bg-zinc-800 border-zinc-700"
                      placeholder="info@be-group.com"
                    />
                  </div>
                </div>

                {/* Navigation Links */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold">Navigation Menu</h3>
                    <Button
                      type="button"
                      onClick={addNavLink}
                      className="bg-green-600 hover:bg-green-700 text-white"
                      size="sm"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add Link
                    </Button>
                  </div>

                  <div className="space-y-3">
                    {navLinks.map((link, index) => (
                      <div key={index} className="flex items-center gap-3">
                        <Input
                          value={link.name}
                          onChange={(e) => updateNavLink(index, 'name', e.target.value)}
                          className="bg-zinc-800 border-zinc-700"
                          placeholder="Menu name"
                        />
                        <Input
                          value={link.href}
                          onChange={(e) => updateNavLink(index, 'href', e.target.value)}
                          className="bg-zinc-800 border-zinc-700"
                          placeholder="#section"
                        />
                        <Button
                          type="button"
                          onClick={() => removeNavLink(index)}
                          className="bg-red-600 hover:bg-red-700 text-white"
                          size="sm"
                          disabled={navLinks.length <= 1}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Service Links */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold">Mobile Services Menu</h3>
                    <Button
                      type="button"
                      onClick={addServiceLink}
                      className="bg-green-600 hover:bg-green-700 text-white"
                      size="sm"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add Service
                    </Button>
                  </div>

                  <div className="space-y-3">
                    {serviceLinks.map((service, index) => (
                      <div key={index} className="flex items-center gap-3">
                        <span className="text-primary font-mono text-sm min-w-8">•</span>
                        <Input
                          value={service}
                          onChange={(e) => updateServiceLink(index, e.target.value)}
                          className="bg-zinc-800 border-zinc-700 flex-1"
                          placeholder="e.g., Web Development"
                        />
                        <Button
                          type="button"
                          onClick={() => removeServiceLink(index)}
                          className="bg-red-600 hover:bg-red-700 text-white"
                          size="sm"
                          disabled={serviceLinks.length <= 1}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Social Links */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold">Social Media Links</h3>
                    <Button
                      type="button"
                      onClick={addSocialLink}
                      className="bg-green-600 hover:bg-green-700 text-white"
                      size="sm"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add Social
                    </Button>
                  </div>

                  <div className="space-y-3">
                    {socialLinks.map((social, index) => (
                      <div key={index} className="flex items-center gap-3">
                        <Input
                          value={social.platform}
                          onChange={(e) => updateSocialLink(index, 'platform', e.target.value)}
                          className="bg-zinc-800 border-zinc-700"
                          placeholder="Facebook"
                        />
                        <Input
                          value={social.url}
                          onChange={(e) => updateSocialLink(index, 'url', e.target.value)}
                          className="bg-zinc-800 border-zinc-700 flex-1"
                          placeholder="https://..."
                        />
                        <Button
                          type="button"
                          onClick={() => removeSocialLink(index)}
                          className="bg-red-600 hover:bg-red-700 text-white"
                          size="sm"
                          disabled={socialLinks.length <= 1}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Gallery Images */}
                <div>
                  <div className="mb-4">
                    <h3 className="text-lg font-semibold mb-2">Mobile Gallery Images</h3>
                    <p className="text-sm text-zinc-400">Upload images for the mobile menu gallery</p>
                  </div>

                  <ImageUpload
                    value={galleryImages.map(img => ({ src: img.src }))}
                    onChange={(uploadedImages) => {
                      setGalleryImages(uploadedImages.map((img, index) => ({
                        src: img.src,
                        caption: galleryImages[index]?.caption || `Image ${index + 1}`
                      })))
                    }}
                    multiple={true}
                    maxImages={10}
                    className="mb-4"
                  />

                  {/* Caption inputs for uploaded images */}
                  {galleryImages.length > 0 && (
                    <div className="space-y-3">
                      <h4 className="text-sm font-medium text-zinc-300">Image Captions:</h4>
                      {galleryImages.map((image, index) => (
                        <div key={index} className="flex items-center gap-3">
                          <img
                            src={image.src}
                            alt={`Gallery ${index + 1}`}
                            className="w-12 h-12 object-cover rounded border border-zinc-700"
                          />
                          <Input
                            value={image.caption}
                            onChange={(e) => updateGalleryImage(index, 'caption', e.target.value)}
                            className="bg-zinc-800 border-zinc-700 flex-1"
                            placeholder={`Caption for image ${index + 1}`}
                          />
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Save Button */}
                <div className="pt-6 border-t border-zinc-700">
                  <Button
                    type="submit"
                    className="w-full bg-primary text-black hover:bg-primary/90"
                    disabled={saving}
                  >
                    <Save className="w-4 h-4 mr-2" />
                    {saving ? 'Saving...' : 'Save All Header Settings'}
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
