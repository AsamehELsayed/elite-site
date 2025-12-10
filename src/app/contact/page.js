"use client"

import { useEffect, useMemo, useState } from "react"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { Button } from "@/components/ui/button"
import { useLocale } from "@/components/locale-provider"
import { SEOHead } from '@/components/SEOHead'
import { getPageSEO } from '@/lib/seo'

export default function ContactPage() {
  const { locale, t } = useLocale()
  const [contactData, setContactData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [selectedDayIndex, setSelectedDayIndex] = useState(0)
  const [selectedSlot, setSelectedSlot] = useState("")

  useEffect(() => {
    fetchContactData()
    
    // Override body and main background to show video
    const body = document.body
    const main = document.querySelector('main')
    
    // Add class to override background
    body.classList.add('contact-page-body')
    if (main) {
      main.classList.add('contact-page-main')
    }
    
    // Also set inline style as backup
    body.style.backgroundColor = 'transparent'
    if (main) {
      main.style.backgroundColor = 'transparent'
    }
    
    return () => {
      // Restore on unmount
      body.classList.remove('contact-page-body')
      body.style.backgroundColor = ''
      if (main) {
        main.classList.remove('contact-page-main')
        main.style.backgroundColor = ''
      }
    }
  }, [locale])

  const fetchContactData = async () => {
    try {
      const response = await fetch(`/api/contact?lang=${locale}`)
      const data = await response.json()
      if (data && !data.error) {
        setContactData(data)
        // Set default selected slot from first available slot
        const bookingSlots = data.bookingSlots ? JSON.parse(data.bookingSlots) : { week: [] }
        if (bookingSlots.week && bookingSlots.week.length > 0) {
          setSelectedSlot(bookingSlots.week[0].slots[0])
        }
      }
    } catch (error) {
      console.error('Failed to fetch contact data:', error)
    } finally {
      setLoading(false)
    }
  }

  // Default data in case API fails
  const bookingWeek = contactData?.bookingSlots ? JSON.parse(contactData.bookingSlots).week : [
    { day: "Mon", date: "May 05", slots: ["09:00", "11:30", "15:00"] },
    { day: "Tue", date: "May 06", slots: ["10:00", "13:30", "17:00"] },
    { day: "Wed", date: "May 07", slots: ["08:30", "12:00", "16:30"] },
    { day: "Thu", date: "May 08", slots: ["09:30", "14:00"] },
    { day: "Fri", date: "May 09", slots: ["10:30", "13:00", "18:00"] },
  ]

  const briefingSteps = contactData?.briefingSteps ? JSON.parse(contactData.briefingSteps) : [
    { title: "Discovery", detail: "Clarify goals, constraints & timing." },
    { title: "Strategy sprint", detail: "Design the activation blueprint." },
    { title: "Green light", detail: "Lock scope, squad, and success metrics." },
  ]

  const sectionTitle = contactData?.sectionTitle || 'Reserve a calendar slot with our leadership team'
  const sectionDescription = contactData?.sectionDescription || 'Choose a window that suits your cadence and we\'ll come ready with a tailored agenda. Expect a focused 45-minute working session—not a sales call.'
  const sessionFocus = contactData?.sessionFocus ? JSON.parse(contactData.sessionFocus) : [
    "Align on launch objectives, runways, and desired KPIs.",
    "Review available squads, budget bands, and timelines.",
    "Leave with a clear decision memo and next steps."
  ]
  const bookingEmail = contactData?.bookingEmail || 'studio@elite.com'

  const selectedDay = useMemo(() => bookingWeek[selectedDayIndex] || bookingWeek[0], [selectedDayIndex, bookingWeek])
  const getDayLabel = (day) => t(`contact.days.${day?.toLowerCase?.()}`, day)

  const seoConfig = getPageSEO({
    title: locale === 'ar' ? 'اتصل بنا' : 'Contact Us',
    description: locale === 'ar'
      ? 'احجز موعدًا مع فريق القيادة لدينا. اختر نافذة مناسبة وسنأتي جاهزين بجدول أعمال مخصص.'
      : 'Reserve a calendar slot with our leadership team. Choose a window that suits your cadence and we\'ll come ready with a tailored agenda.',
    url: '/contact',
  }, locale)

  return (
    <>
      <SEOHead {...seoConfig} />
      <style dangerouslySetInnerHTML={{__html: `
        .contact-page-body {
          background-color: transparent !important;
        }
        .contact-page-main {
          background-color: transparent !important;
        }
         /* Remove default black section background just for this page */
        .contact-page-section {
          background-color: transparent !important;
        }
      `}} />
      
      {/* Video Background - fixed position, behind everything */}
      <div className="fixed inset-0" style={{ zIndex: 0, width: '100vw', height: '100vh' }}>
        <video
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover"
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        >
          <source src="/hero-video.mp4" type="video/mp4" />
          <source src="/hero-video.webm" type="video/webm" />
        </video>
        {/* Dark overlay for stronger readability on top of video */}
        <div className="absolute inset-0 bg-black/50"></div>
      </div>

      <main className="text-white relative" style={{ minHeight: '100vh', zIndex: 10 }}>

      <SiteHeader />
      
      {/* Content on top of video */}
      <section className="relative min-h-screen w-full py-24 text-white z-10 contact-page-section">
        <div className="container mx-auto relative grid gap-12 px-4 md:px-6 lg:grid-cols-2">
          <div className="space-y-10">
            <div className="space-y-4">
              <p className="text-xs uppercase tracking-[0.4em] text-white/60">
                {t('contact.studioSessions', 'Studio sessions')}
              </p>
              <h2 className="text-4xl font-serif leading-tight text-white sm:text-5xl">
                {sectionTitle}
              </h2>
              <p className="max-w-xl text-base text-white/70">
                {sectionDescription}
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              {briefingSteps.map((step, index) => (
                <div key={step.title} className="rounded-2xl border border-white/20 bg-white/5 backdrop-blur-sm p-5 hover:bg-white/10 transition-all duration-300 hover:border-primary/30">
                  <p className="text-[10px] uppercase tracking-[0.5em] text-primary/70">{`Step 0${index + 1}`}</p>
                  <p className="mt-2 text-lg font-serif text-white">{step.title}</p>
                  <p className="text-sm text-white/70">{step.detail}</p>
                </div>
              ))}
            </div>

            <div className="rounded-2xl border border-white/20 bg-white/5 backdrop-blur-sm p-5 hover:bg-white/10 transition-all duration-300">
              <p className="text-xs uppercase tracking-[0.35em] text-primary/70">
                {t('contact.sessionFocus', 'Session focus')}
              </p>
              <ul className="mt-3 space-y-2 text-sm text-white/80">
                {sessionFocus.map((focus, index) => (
                  <li key={index}>• {focus}</li>
                ))}
              </ul>
            </div>
          </div>

          <div className="space-y-6 rounded-3xl border border-white/20 bg-white/5 p-6 shadow-[0_20px_80px_rgba(0,0,0,0.3)] backdrop-blur-sm hover:bg-white/10 transition-all duration-300">
            <div className="flex flex-col gap-1">
              <p className="text-xs uppercase tracking-[0.35em] text-white/60">
                {t('contact.calendar', 'Calendar')}
              </p>
              <p className="text-sm text-white/70">
                {t('contact.timesNote', 'All times shown in EST · 45-minute sessions')}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-2 sm:grid-cols-5">
              {bookingWeek.map((day, index) => {
                const isActive = index === selectedDayIndex
                return (
                  <button
                    key={day.date}
                    type="button"
                    onClick={() => {
                      setSelectedDayIndex(index)
                      setSelectedSlot(day.slots[0])
                    }}
                    className={`rounded-2xl border px-3 py-3 text-left transition-all duration-300 ${
                      isActive
                        ? "border-primary bg-primary text-black shadow-lg shadow-primary/30"
                        : "border-white/20 bg-white/5 text-white hover:border-primary/50 hover:bg-white/10"
                    }`}
                  >
                    <p className="text-xs uppercase tracking-[0.4em]">{getDayLabel(day.day)}</p>
                    <p className="text-lg font-serif">{day.date}</p>
                  </button>
                )
              })}
            </div>

            <div>
              <p className="text-xs uppercase tracking-[0.35em] text-white/60">
                {t('contact.availableSlots', 'Available slots')}
              </p>
              <div className="mt-3 grid grid-cols-2 gap-3">
                {selectedDay.slots.map((slot) => {
                  const isSelected = slot === selectedSlot
                  return (
                    <button
                      key={slot}
                      type="button"
                      onClick={() => setSelectedSlot(slot)}
                      className={`rounded-2xl border px-4 py-3 text-base font-semibold transition-all duration-300 ${
                        isSelected
                          ? "border-primary bg-primary text-black shadow-lg shadow-primary/30"
                          : "border-white/25 bg-white/5 text-white hover:border-primary/50 hover:bg-white/10"
                      }`}
                    >
                      {slot}
                    </button>
                  )
                })}
              </div>
            </div>

            <div className="rounded-2xl border border-primary/30 bg-primary/10 backdrop-blur-sm p-4 text-sm text-white/80">
              <p className="text-xs uppercase tracking-[0.35em] text-primary/80">
                {t('contact.selected', 'Selected')}
              </p>
              <p className="text-lg font-serif text-white">
                {getDayLabel(selectedDay.day)} · {selectedDay.date} · {selectedSlot} {t('contact.timezone', 'EST')}
              </p>
              <p>{t('contact.calendarInvite', "We'll send a calendar invite with a secure video room.")}</p>
            </div>

            <Button type="button" className="w-full rounded-2xl bg-primary py-4 text-lg font-semibold text-black hover:bg-primary/90 shadow-lg shadow-primary/30 hover:shadow-primary/50 transition-all duration-300">
              {t('contact.confirmAppointment', 'Confirm appointment')}
            </Button>

            <p className="text-xs text-white/60">
              {t('contact.emailNote', 'If none of these windows work, email {email} and we will coordinate manually.').replace('{email}', bookingEmail)}
            </p>
          </div>
        </div>
      </section>
      <SiteFooter />
      </main>
    </>
  )
}
