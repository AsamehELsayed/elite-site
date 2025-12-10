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
  Clock,
  Plus,
  Trash2,
  Save,
  Edit3
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { RichTextEditor } from '@/components/ui/rich-text-editor'
import { apiPut } from '@/lib/api'
import { navigationItems } from '@/lib/navigation'
import { useLocale } from '@/components/locale-provider'

export default function ContactPage() {
  const router = useRouter()
  const { locale, setLocale } = useLocale()
  const [contact, setContact] = useState(null)
  const [loading, setLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [saving, setSaving] = useState(false)

  const [sectionTitle, setSectionTitle] = useState('Reserve a calendar slot with our leadership team')
  const [sectionDescription, setSectionDescription] = useState('Choose a window that suits your cadence and we\'ll come ready with a tailored agenda. Expect a focused 45-minute working session—not a sales call.')
  const [bookingEmail, setBookingEmail] = useState('studio@elite.com')

  const [briefingSteps, setBriefingSteps] = useState([
    { title: "Discovery", detail: "Clarify goals, constraints & timing." },
    { title: "Strategy sprint", detail: "Design the activation blueprint." },
    { title: "Green light", detail: "Lock scope, squad, and success metrics." }
  ])

  const [sessionFocus, setSessionFocus] = useState([
    "Align on launch objectives, runways, and desired KPIs.",
    "Review available squads, budget bands, and timelines.",
    "Leave with a clear decision memo and next steps."
  ])

  const [bookingSlots, setBookingSlots] = useState({
    week: [
      { day: "Mon", date: "May 05", slots: ["09:00", "11:30", "15:00"] },
      { day: "Tue", date: "May 06", slots: ["10:00", "13:30", "17:00"] },
      { day: "Wed", date: "May 07", slots: ["08:30", "12:00", "16:30"] },
      { day: "Thu", date: "May 08", slots: ["09:30", "14:00"] },
      { day: "Fri", date: "May 09", slots: ["10:30", "13:00", "18:00"] }
    ]
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
    fetchContact()
  }, [router, locale])

  const fetchContact = async () => {
    try {
      const response = await fetch(`/api/contact?lang=${locale}`)
      const data = await response.json()
      if (data && !data.error) {
        setContact(data)
        setSectionTitle(data.sectionTitle || sectionTitle)
        setSectionDescription(data.sectionDescription || sectionDescription)
        setBriefingSteps(data.briefingSteps ? JSON.parse(data.briefingSteps) : briefingSteps)
        setSessionFocus(data.sessionFocus ? JSON.parse(data.sessionFocus) : sessionFocus)
        setBookingEmail(data.bookingEmail || bookingEmail)
        setBookingSlots(data.bookingSlots ? JSON.parse(data.bookingSlots) : bookingSlots)
      }
    } catch (error) {
      console.error('Failed to fetch contact:', error)
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
        sectionDescription,
        briefingSteps: JSON.stringify(briefingSteps),
        sessionFocus: JSON.stringify(sessionFocus),
        bookingEmail,
        bookingSlots: JSON.stringify(bookingSlots)
      }
      const data = await apiPut(`/api/contact?lang=${locale}`, formData)
      setContact(data)
      alert('Contact section updated successfully!')
    } catch (error) {
      console.error('Failed to save contact:', error)
      const errorMessage = error.message || 'Failed to save contact section'
      alert(errorMessage)
    } finally {
      setSaving(false)
    }
  }

  const addBriefingStep = () => {
    setBriefingSteps([...briefingSteps, { title: '', detail: '' }])
  }

  const updateBriefingStep = (index, field, value) => {
    const updated = [...briefingSteps]
    updated[index][field] = value
    setBriefingSteps(updated)
  }

  const removeBriefingStep = (index) => {
    if (briefingSteps.length > 1) {
      setBriefingSteps(briefingSteps.filter((_, i) => i !== index))
    }
  }

  const addSessionFocus = () => {
    setSessionFocus([...sessionFocus, ''])
  }

  const updateSessionFocus = (index, value) => {
    const updated = [...sessionFocus]
    updated[index] = value
    setSessionFocus(updated)
  }

  const removeSessionFocus = (index) => {
    if (sessionFocus.length > 1) {
      setSessionFocus(sessionFocus.filter((_, i) => i !== index))
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
              const isActive = item.href === '/dashboard/contact'
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
              <h1 className="text-4xl font-serif">Contact Section</h1>
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
                {/* Section Content */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm mb-2 font-medium">Section Title</label>
                    <Input
                      value={sectionTitle}
                      onChange={(e) => setSectionTitle(e.target.value)}
                      className="bg-zinc-800 border-zinc-700"
                      placeholder="Reserve a calendar slot with our leadership team"
                    />
                  </div>

                  <div>
                    <label className="block text-sm mb-2 font-medium">Booking Email</label>
                    <Input
                      value={bookingEmail}
                      onChange={(e) => setBookingEmail(e.target.value)}
                      className="bg-zinc-800 border-zinc-700"
                      placeholder="studio@elite.com"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm mb-2 font-medium">Section Description</label>
                  <RichTextEditor
                    value={sectionDescription}
                    onChange={setSectionDescription}
                    className="bg-zinc-900/60"
                    placeholder="Description text... (rich text supported)"
                    minHeight={120}
                  />
                </div>

                {/* Briefing Steps */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold">Briefing Steps</h3>
                    <Button
                      type="button"
                      onClick={addBriefingStep}
                      className="bg-green-600 hover:bg-green-700 text-white"
                      size="sm"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add Step
                    </Button>
                  </div>

                  <div className="space-y-4">
                    {briefingSteps.map((step, index) => (
                      <div key={index} className="border border-zinc-700 rounded-lg p-4 bg-zinc-800/50">
                        <div className="flex items-center justify-between mb-4">
                          <h4 className="font-medium text-primary">Step #{index + 1}</h4>
                          <Button
                            type="button"
                            onClick={() => removeBriefingStep(index)}
                            className="bg-red-600 hover:bg-red-700 text-white"
                            size="sm"
                            disabled={briefingSteps.length <= 1}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm mb-2">Step Title</label>
                            <Input
                              value={step.title}
                              onChange={(e) => updateBriefingStep(index, 'title', e.target.value)}
                              className="bg-zinc-700 border-zinc-600"
                              placeholder="e.g., Discovery"
                            />
                          </div>

                          <div>
                            <label className="block text-sm mb-2">Step Detail</label>
                            <Input
                              value={step.detail}
                              onChange={(e) => updateBriefingStep(index, 'detail', e.target.value)}
                              className="bg-zinc-700 border-zinc-600"
                              placeholder="e.g., Clarify goals and constraints"
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Session Focus Points */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold">Session Focus Points</h3>
                    <Button
                      type="button"
                      onClick={addSessionFocus}
                      className="bg-green-600 hover:bg-green-700 text-white"
                      size="sm"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add Point
                    </Button>
                  </div>

                  <div className="space-y-3">
                    {sessionFocus.map((focus, index) => (
                      <div key={index} className="flex items-center gap-3">
                        <span className="text-primary font-mono text-sm min-w-8">•</span>
                        <Input
                          value={focus}
                          onChange={(e) => updateSessionFocus(index, e.target.value)}
                          className="bg-zinc-800 border-zinc-700 flex-1"
                          placeholder="e.g., Align on launch objectives and KPIs"
                        />
                        <Button
                          type="button"
                          onClick={() => removeSessionFocus(index)}
                          className="bg-red-600 hover:bg-red-700 text-white"
                          size="sm"
                          disabled={sessionFocus.length <= 1}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
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
