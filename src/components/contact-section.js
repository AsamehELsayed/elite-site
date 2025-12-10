"use client"

import { useEffect, useMemo, useState } from "react"

import { Button } from "@/components/ui/button"
import { LaserFlow } from "@/components/leserflow"
import LiquidEther from "./LiquidEther"
import Galaxy from "./star"
import { useLocale } from "@/components/locale-provider"
import { safeJsonParse } from "@/lib/utils"

export function ContactSection() {
  const { locale, t } = useLocale()
  const [contactData, setContactData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [selectedDayIndex, setSelectedDayIndex] = useState(0)
  const [selectedSlot, setSelectedSlot] = useState("")

  useEffect(() => {
    fetchContactData()
  }, [locale])

  const fetchContactData = async () => {
    try {
      const response = await fetch(`/api/contact?lang=${locale}`)
      
      // Check if response is ok and content-type is JSON
      const contentType = response.headers.get('content-type')
      if (!contentType || !contentType.includes('application/json')) {
        throw new Error('Response is not JSON')
      }
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const data = await response.json()
      if (data && !data.error) {
        setContactData(data)
        // Set default selected slot from first available slot
        const bookingSlots = safeJsonParse(data.bookingSlots, { week: [] })
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

  // Default data in case API fails (localized)
  const defaultBookingWeek = useMemo(() => ([
    { day: t('contact.days.mon'), date: "May 05", slots: ["09:00", "11:30", "15:00"] },
    { day: t('contact.days.tue'), date: "May 06", slots: ["10:00", "13:30", "17:00"] },
    { day: t('contact.days.wed'), date: "May 07", slots: ["08:30", "12:00", "16:30"] },
    { day: t('contact.days.thu'), date: "May 08", slots: ["09:30", "14:00"] },
    { day: t('contact.days.fri'), date: "May 09", slots: ["10:30", "13:00", "18:00"] },
  ]), [locale, t])

  const bookingWeek = safeJsonParse(contactData?.bookingSlots, { week: defaultBookingWeek }).week || defaultBookingWeek

  const briefingSteps = safeJsonParse(contactData?.briefingSteps, [
    { title: "Discovery", detail: "Clarify goals, constraints & timing." },
    { title: "Strategy sprint", detail: "Design the activation blueprint." },
    { title: "Green light", detail: "Lock scope, squad, and success metrics." },
  ])

  const sectionTitle = contactData?.sectionTitle || 'Reserve a calendar slot with our leadership team'
  const sectionDescription = contactData?.sectionDescription || 'Choose a window that suits your cadence and we\'ll come ready with a tailored agenda. Expect a focused 45-minute working session—not a sales call.'
  const sessionFocus = safeJsonParse(contactData?.sessionFocus, [
    "Align on launch objectives, runways, and desired KPIs.",
    "Review available squads, budget bands, and timelines.",
    "Leave with a clear decision memo and next steps."
  ])
  const bookingEmail = contactData?.bookingEmail || 'studio@elite.com'

  const selectedDay = useMemo(() => bookingWeek[selectedDayIndex] || bookingWeek[0], [selectedDayIndex, bookingWeek])

  return (
    <section className="relative isolate min-h-screen overflow-hidden w-full bg-[oklch(0.12_0_0)] py-16 sm:py-20 md:py-24 text-white">
          <div className="absolute inset-0 z-0">
                <LiquidEther
                    colors={['#EDC9Af']}
                    mouseForce={10}
                    cursorSize={100}
                    isViscous={false}
                    viscous={30}
                    iterationsViscous={32}
                    iterationsPoisson={32}
                    resolution={0.5}
                    isBounce={false}
                    autoSpeed={0.5}
                    autoIntensity={2.2}
                    takeoverDuration={0.25}
                    autoResumeDelay={3000}
                    autoRampDuration={0.6}
                />
            </div>
      <div className="pointer-events-none absolute inset-0">
        <LaserFlow
          color="#D4AF37"
          horizontalBeamOffset={0.3}
          verticalBeamOffset={-0.3}
          verticalSizing={1.4}
          horizontalSizing={0.5}
          wispIntensity={4}
          fogIntensity={0.2}
          className="opacity-60 mix-blend-screen"
        />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(212,175,55,0.12),transparent_55%)]"></div>
        <div className="absolute inset-0 bg-linear-to-b from-[oklch(0.12_0_0)]/15 via-transparent to-[oklch(0.12_0_0)]/50"></div>
        {/* Galaxy component */}
 
      </div>
      <div className="container mx-auto relative z-10 grid gap-8 sm:gap-10 md:gap-12 px-4 sm:px-5 md:px-6 lg:grid-cols-2">
        <div className="space-y-6 sm:space-y-8 md:space-y-10">
          <div className="space-y-3 sm:space-y-4">
            <p className="text-[10px] sm:text-xs uppercase tracking-[0.35em] sm:tracking-[0.4em] text-white/60">{t('contact.studioSessions')}</p>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif leading-tight text-white">
              {sectionTitle}
            </h2>
            <div
              className="prose prose-invert max-w-xl text-sm sm:text-base text-white/70"
              dangerouslySetInnerHTML={{ __html: sectionDescription }}
            />
          </div>

          <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-3">
            {briefingSteps.map((step, index) => (
              <div key={step.title} className="rounded-xl sm:rounded-2xl border border-white/15 bg-white/8 backdrop-blur-sm p-4 sm:p-5 hover:bg-white/10 transition-all duration-300 hover:border-primary/30">
                <p className="text-[9px] sm:text-[10px] uppercase tracking-[0.4em] sm:tracking-[0.5em] text-primary/70">{`Step 0${index + 1}`}</p>
                <p className="mt-1.5 sm:mt-2 text-base sm:text-lg font-serif text-white">{step.title}</p>
                <p className="text-xs sm:text-sm text-white/70 mt-1">{step.detail}</p>
              </div>
            ))}
          </div>

          <div className="rounded-xl sm:rounded-2xl border border-white/15 bg-white/8 backdrop-blur-sm p-4 sm:p-5 hover:bg-white/10 transition-all duration-300">
            <p className="text-[10px] sm:text-xs uppercase tracking-[0.3em] sm:tracking-[0.35em] text-primary/70">{t('contact.sessionFocus')}</p>
            <ul className="mt-2 sm:mt-3 space-y-1.5 sm:space-y-2 text-xs sm:text-sm text-white/80">
              {sessionFocus.map((focus, index) => (
                <li key={index}>• {focus}</li>
              ))}
            </ul>
          </div>
        </div>

        <div className="space-y-4 sm:space-y-5 md:space-y-6 rounded-2xl sm:rounded-3xl border border-white/15 bg-white/8 p-4 sm:p-5 md:p-6 shadow-[0_20px_80px_rgba(0,0,0,0.3)] backdrop-blur-xl hover:bg-white/10 transition-all duration-300">
          <div className="flex flex-col gap-0.5 sm:gap-1">
            <p className="text-[10px] sm:text-xs uppercase tracking-[0.3em] sm:tracking-[0.35em] text-white/60">{t('contact.calendar')}</p>
            <p className="text-xs sm:text-sm text-white/70">{t('contact.timesNote')}</p>
          </div>

          <div className="grid grid-cols-2 gap-2 sm:gap-2.5 sm:grid-cols-3 md:grid-cols-5">
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
                  className={`rounded-xl sm:rounded-2xl border px-2.5 sm:px-3 py-2.5 sm:py-3 text-left transition-all duration-300 min-h-[64px] sm:min-h-auto ${
                    isActive
                      ? "border-primary bg-primary text-black shadow-lg shadow-primary/30"
                      : "border-white/20 bg-white/8 text-white hover:border-primary/50 hover:bg-white/12"
                  }`}
                >
                  <p className="text-[10px] sm:text-xs uppercase tracking-[0.35em] sm:tracking-[0.4em]">{day.day}</p>
                  <p className="text-base sm:text-lg font-serif mt-0.5 sm:mt-1">{day.date}</p>
                </button>
              )
            })}
          </div>

          <div>
            <p className="text-[10px] sm:text-xs uppercase tracking-[0.3em] sm:tracking-[0.35em] text-white/60">{t('contact.availableSlots')}</p>
            <div className="mt-2.5 sm:mt-3 grid grid-cols-2 gap-2 sm:gap-3">
              {selectedDay.slots.map((slot) => {
                const isSelected = slot === selectedSlot
                return (
                  <button
                    key={slot}
                    type="button"
                    onClick={() => setSelectedSlot(slot)}
                    className={`rounded-xl sm:rounded-2xl border px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base font-semibold transition-all duration-300 min-h-[48px] sm:min-h-auto ${
                      isSelected
                        ? "border-primary bg-primary text-black shadow-lg shadow-primary/30"
                        : "border-white/25 bg-white/8 text-white hover:border-primary/50 hover:bg-white/12"
                    }`}
                  >
                    {slot}
                  </button>
                )
              })}
            </div>
          </div>

          <div className="rounded-xl sm:rounded-2xl border border-primary/30 bg-primary/10 backdrop-blur-sm p-3.5 sm:p-4 text-xs sm:text-sm text-white/80">
            <p className="text-[10px] sm:text-xs uppercase tracking-[0.3em] sm:tracking-[0.35em] text-primary/80">{t('contact.selected')}</p>
            <p className="text-base sm:text-lg font-serif text-white mt-1">
              {selectedDay.day} · {selectedDay.date} · {selectedSlot} {t('contact.timezone')}
            </p>
            <p className="mt-1">{t('contact.calendarInvite')}</p>
          </div>

          <Button type="button" className="w-full rounded-xl sm:rounded-2xl bg-primary py-3.5 sm:py-4 text-base sm:text-lg font-semibold text-black hover:bg-primary/90 shadow-lg shadow-primary/30 hover:shadow-primary/50 transition-all duration-300 min-h-[52px] sm:min-h-[56px]">
            {t('contact.confirmAppointment')}
          </Button>

          <p className="text-[10px] sm:text-xs text-white/60 text-center">
            {t('contact.emailNote').replace('{email}', bookingEmail)}
          </p>
        </div>
      </div>
    </section>
  )
}
