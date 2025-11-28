"use client"

import { useMemo, useState } from "react"

import { Button } from "@/components/ui/button"
import { LaserFlow } from "@/components/leserflow"
import LiquidEther from "./LiquidEther"

const bookingWeek = [
  { day: "Mon", date: "May 05", slots: ["09:00", "11:30", "15:00"] },
  { day: "Tue", date: "May 06", slots: ["10:00", "13:30", "17:00"] },
  { day: "Wed", date: "May 07", slots: ["08:30", "12:00", "16:30"] },
  { day: "Thu", date: "May 08", slots: ["09:30", "14:00"] },
  { day: "Fri", date: "May 09", slots: ["10:30", "13:00", "18:00"] },
]

const briefingSteps = [
  { title: "Discovery", detail: "Clarify goals, constraints & timing." },
  { title: "Strategy sprint", detail: "Design the activation blueprint." },
  { title: "Green light", detail: "Lock scope, squad, and success metrics." },
]

export function ContactSection() {
  const [selectedDayIndex, setSelectedDayIndex] = useState(0)
  const [selectedSlot, setSelectedSlot] = useState(bookingWeek[0].slots[0])

  const selectedDay = useMemo(() => bookingWeek[selectedDayIndex], [selectedDayIndex])

  return (
    <section className="relative isolate min-h-screen overflow-hidden w-full bg-[oklch(0.12_0_0)] py-24 text-white">
          <div className="absolute inset-0 z-0">
                <LiquidEther
                    colors={['#FFD700']}
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
      </div>
      <div className="container mx-auto relative z-10 grid gap-12 px-4 md:px-6 lg:grid-cols-2">
        <div className="space-y-10">
          <div className="space-y-4">
            <p className="text-xs uppercase tracking-[0.4em] text-white/60">Studio sessions</p>
            <h2 className="text-4xl font-serif leading-tight text-white sm:text-5xl">
              Reserve a calendar slot with our leadership team
            </h2>
            <p className="max-w-xl text-base text-white/70">
              Choose a window that suits your cadence and we&apos;ll come ready with a tailored agenda. Expect a focused
              45-minute working session—not a sales call.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            {briefingSteps.map((step, index) => (
              <div key={step.title} className="rounded-2xl border border-white/15 bg-white/8 backdrop-blur-sm p-5 hover:bg-white/10 transition-all duration-300 hover:border-primary/30">
                <p className="text-[10px] uppercase tracking-[0.5em] text-primary/70">{`Step 0${index + 1}`}</p>
                <p className="mt-2 text-lg font-serif text-white">{step.title}</p>
                <p className="text-sm text-white/70">{step.detail}</p>
              </div>
            ))}
          </div>

          <div className="rounded-2xl border border-white/15 bg-white/8 backdrop-blur-sm p-5 hover:bg-white/10 transition-all duration-300">
            <p className="text-xs uppercase tracking-[0.35em] text-primary/70">Session focus</p>
            <ul className="mt-3 space-y-2 text-sm text-white/80">
              <li>• Align on launch objectives, runways, and desired KPIs.</li>
              <li>• Review available squads, budget bands, and timelines.</li>
              <li>• Leave with a clear decision memo and next steps.</li>
            </ul>
          </div>
        </div>

        <div className="space-y-6 rounded-3xl border border-white/15 bg-white/8 p-6 shadow-[0_20px_80px_rgba(0,0,0,0.3)] backdrop-blur-xl hover:bg-white/10 transition-all duration-300">
          <div className="flex flex-col gap-1">
            <p className="text-xs uppercase tracking-[0.35em] text-white/60">Calendar</p>
            <p className="text-sm text-white/70">All times shown in EST · 45-minute sessions</p>
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
                      : "border-white/20 bg-white/8 text-white hover:border-primary/50 hover:bg-white/12"
                  }`}
                >
                  <p className="text-xs uppercase tracking-[0.4em]">{day.day}</p>
                  <p className="text-lg font-serif">{day.date}</p>
                </button>
              )
            })}
          </div>

          <div>
            <p className="text-xs uppercase tracking-[0.35em] text-white/60">Available slots</p>
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
                        : "border-white/25 bg-white/8 text-white hover:border-primary/50 hover:bg-white/12"
                    }`}
                  >
                    {slot}
                  </button>
                )
              })}
            </div>
          </div>

          <div className="rounded-2xl border border-primary/30 bg-primary/10 backdrop-blur-sm p-4 text-sm text-white/80">
            <p className="text-xs uppercase tracking-[0.35em] text-primary/80">Selected</p>
            <p className="text-lg font-serif text-white">
              {selectedDay.day} · {selectedDay.date} · {selectedSlot} EST
            </p>
            <p>We&apos;ll send a calendar invite with a secure video room.</p>
          </div>

          <Button type="button" className="w-full rounded-2xl bg-primary py-4 text-lg font-semibold text-black hover:bg-primary/90 shadow-lg shadow-primary/30 hover:shadow-primary/50 transition-all duration-300">
            Confirm appointment
          </Button>

          <p className="text-xs text-white/60">
            If none of these windows work, email studio@elite.com and we&apos;ll coordinate manually.
          </p>
        </div>
      </div>
    </section>
  )
}
