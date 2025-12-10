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

export default function FooterPage() {
  const router = useRouter()
  const { locale, setLocale } = useLocale()
  const [footer, setFooter] = useState(null)
  const [loading, setLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [saving, setSaving] = useState(false)

  const [companyName, setCompanyName] = useState('ELITE.')
  const [companyLogo, setCompanyLogo] = useState('')
  const [companyDescription, setCompanyDescription] = useState('A premium digital marketing agency dedicated to elevating brands through strategy, creativity, and innovation.')
  const [newsletterTitle, setNewsletterTitle] = useState('Newsletter')
  const [newsletterDescription, setNewsletterDescription] = useState('Subscribe to our newsletter for the latest insights and trends.')
  const [copyrightText, setCopyrightText] = useState('© 2025 Elite Agency. All rights reserved.')
  const [privacyPolicyLink, setPrivacyPolicyLink] = useState('/privacy')
  const [termsOfServiceLink, setTermsOfServiceLink] = useState('/terms')

  const [socialLinks, setSocialLinks] = useState([
    { icon: "Instagram", href: "#", label: "Instagram" },
    { icon: "Linkedin", href: "#", label: "LinkedIn" },
    { icon: "Twitter", href: "#", label: "Twitter" },
    { icon: "Facebook", href: "#", label: "Facebook" }
  ])

  const [servicesLinks, setServicesLinks] = useState([
    "Strategic Consulting",
    "Social Media Management",
    "Paid Advertising",
    "Public Relations",
    "Content Creation"
  ])

  const [companyLinks, setCompanyLinks] = useState([
    "About Us",
    "Our Team",
    "Careers",
    "Case Studies",
    "Contact"
  ])

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
    fetchFooter()
  }, [router, locale])

  const fetchFooter = async () => {
    try {
      const response = await fetch(`/api/footer?lang=${locale}`)
      const data = await response.json()
      if (data && !data.error) {
        setFooter(data)
        setCompanyName(data.companyName || 'ELITE.')
        setCompanyLogo(data.companyLogo || '')
        setCompanyDescription(data.companyDescription || 'A premium digital marketing agency dedicated to elevating brands through strategy, creativity, and innovation.')
        setSocialLinks(data.socialLinks ? JSON.parse(data.socialLinks) : socialLinks)
        setServicesLinks(data.servicesLinks ? JSON.parse(data.servicesLinks) : servicesLinks)
        setCompanyLinks(data.companyLinks ? JSON.parse(data.companyLinks) : companyLinks)
        setNewsletterTitle(data.newsletterTitle || 'Newsletter')
        setNewsletterDescription(data.newsletterDescription || 'Subscribe to our newsletter for the latest insights and trends.')
        setCopyrightText(data.copyrightText || '© 2025 Elite Agency. All rights reserved.')
        setPrivacyPolicyLink(data.privacyPolicyLink || '/privacy')
        setTermsOfServiceLink(data.termsOfServiceLink || '/terms')
      }
    } catch (error) {
      console.error('Failed to fetch footer:', error)
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
        companyLogo,
        companyDescription,
        socialLinks: JSON.stringify(socialLinks),
        servicesLinks: JSON.stringify(servicesLinks),
        companyLinks: JSON.stringify(companyLinks),
        newsletterTitle,
        newsletterDescription,
        copyrightText,
        privacyPolicyLink,
        termsOfServiceLink
      }
      const data = await apiPut(`/api/footer?lang=${locale}`, formData)
      setFooter(data)
      alert('Footer section updated successfully!')
    } catch (error) {
      console.error('Failed to save footer:', error)
      const errorMessage = error.message || 'Failed to save footer section'
      alert(errorMessage)
    } finally {
      setSaving(false)
    }
  }

  const addSocialLink = () => {
    setSocialLinks([...socialLinks, { icon: '', href: '#', label: '' }])
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

  const addServiceLink = () => {
    setServicesLinks([...servicesLinks, ''])
  }

  const updateServiceLink = (index, value) => {
    const updated = [...servicesLinks]
    updated[index] = value
    setServicesLinks(updated)
  }

  const removeServiceLink = (index) => {
    if (servicesLinks.length > 1) {
      setServicesLinks(serviceLinks.filter((_, i) => i !== index))
    }
  }

  const addCompanyLink = () => {
    setCompanyLinks([...companyLinks, ''])
  }

  const updateCompanyLink = (index, value) => {
    const updated = [...companyLinks]
    updated[index] = value
    setCompanyLinks(updated)
  }

  const removeCompanyLink = (index) => {
    if (companyLinks.length > 1) {
      setCompanyLinks(companyLinks.filter((_, i) => i !== index))
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
              const isActive = item.href === '/dashboard/footer'
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
              <h1 className="text-4xl font-serif">Footer Section</h1>
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
                {/* Company Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                    <label className="block text-sm mb-2 font-medium">Newsletter Title</label>
                    <Input
                      value={newsletterTitle}
                      onChange={(e) => setNewsletterTitle(e.target.value)}
                      className="bg-zinc-800 border-zinc-700"
                      placeholder="Newsletter"
                    />
                  </div>
                </div>

                {/* Company Logo Upload */}
                <div>
                  <label className="block text-sm mb-2 font-medium">Company Logo (Optional)</label>
                  <p className="text-xs text-zinc-400 mb-2">Upload a logo image for your footer</p>
                  <ImageUpload
                    value={companyLogo ? [{ src: companyLogo }] : []}
                    onChange={(images) => {
                      setCompanyLogo(images.length > 0 ? images[0].src : '')
                    }}
                    multiple={false}
                    maxImages={1}
                  />
                </div>

                <div>
                  <label className="block text-sm mb-2 font-medium">Company Description</label>
                  <RichTextEditor
                    value={companyDescription}
                    onChange={setCompanyDescription}
                    className="bg-zinc-900/60"
                    placeholder="Company description... (rich text supported)"
                    minHeight={120}
                  />
                </div>

                <div>
                  <label className="block text-sm mb-2 font-medium">Newsletter Description</label>
                  <RichTextEditor
                    value={newsletterDescription}
                    onChange={setNewsletterDescription}
                    className="bg-zinc-900/60"
                    placeholder="Newsletter subscription description... (rich text supported)"
                    minHeight={100}
                  />
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
                      Add Social Link
                    </Button>
                  </div>

                  <div className="space-y-3">
                    {socialLinks.map((social, index) => (
                      <div key={index} className="flex items-center gap-3">
                        <Input
                          value={social.icon}
                          onChange={(e) => updateSocialLink(index, 'icon', e.target.value)}
                          className="bg-zinc-800 border-zinc-700"
                          placeholder="Instagram"
                        />
                        <Input
                          value={social.href}
                          onChange={(e) => updateSocialLink(index, 'href', e.target.value)}
                          className="bg-zinc-800 border-zinc-700 flex-1"
                          placeholder="https://instagram.com/..."
                        />
                        <Input
                          value={social.label}
                          onChange={(e) => updateSocialLink(index, 'label', e.target.value)}
                          className="bg-zinc-800 border-zinc-700"
                          placeholder="Instagram"
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

                {/* Services Links */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold">Services Links</h3>
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
                    {servicesLinks.map((service, index) => (
                      <div key={index} className="flex items-center gap-3">
                        <span className="text-primary font-mono text-sm min-w-8">•</span>
                        <Input
                          value={service}
                          onChange={(e) => updateServiceLink(index, e.target.value)}
                          className="bg-zinc-800 border-zinc-700 flex-1"
                          placeholder="e.g., Strategic Consulting"
                        />
                        <Button
                          type="button"
                          onClick={() => removeServiceLink(index)}
                          className="bg-red-600 hover:bg-red-700 text-white"
                          size="sm"
                          disabled={servicesLinks.length <= 1}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Company Links */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold">Company Links</h3>
                    <Button
                      type="button"
                      onClick={addCompanyLink}
                      className="bg-green-600 hover:bg-green-700 text-white"
                      size="sm"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add Company Link
                    </Button>
                  </div>

                  <div className="space-y-3">
                    {companyLinks.map((link, index) => (
                      <div key={index} className="flex items-center gap-3">
                        <span className="text-primary font-mono text-sm min-w-8">•</span>
                        <Input
                          value={link}
                          onChange={(e) => updateCompanyLink(index, e.target.value)}
                          className="bg-zinc-800 border-zinc-700 flex-1"
                          placeholder="e.g., About Us"
                        />
                        <Button
                          type="button"
                          onClick={() => removeCompanyLink(index)}
                          className="bg-red-600 hover:bg-red-700 text-white"
                          size="sm"
                          disabled={companyLinks.length <= 1}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Legal Info */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm mb-2 font-medium">Copyright Text</label>
                    <Input
                      value={copyrightText}
                      onChange={(e) => setCopyrightText(e.target.value)}
                      className="bg-zinc-800 border-zinc-700"
                      placeholder="© 2025 Elite Agency. All rights reserved."
                    />
                  </div>

                  <div>
                    <label className="block text-sm mb-2 font-medium">Privacy Policy Link</label>
                    <Input
                      value={privacyPolicyLink}
                      onChange={(e) => setPrivacyPolicyLink(e.target.value)}
                      className="bg-zinc-800 border-zinc-700"
                      placeholder="/privacy or https://..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm mb-2 font-medium">Terms of Service Link</label>
                    <Input
                      value={termsOfServiceLink}
                      onChange={(e) => setTermsOfServiceLink(e.target.value)}
                      className="bg-zinc-800 border-zinc-700"
                      placeholder="/terms or https://..."
                    />
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
                    {saving ? 'Saving...' : 'Save All Footer Settings'}
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
