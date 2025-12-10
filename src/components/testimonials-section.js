"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import {
  AnimatePresence,
  motion,
  useMotionTemplate,
  useMotionValue,
  useSpring,
  useTransform,
} from "framer-motion"
import { Orbit, Quote } from "lucide-react"
import LiquidEther from "./LiquidEther"
import { LaserFlow } from "@/components/leserflow"
import Galaxy from "./star"
import { useLocale } from "@/components/locale-provider"
import { cn } from "@/lib/utils"

// Default fallback data
const defaultTestimonials = [
  {
    quote:
      "Elite made our private banking launch feel like a cinematic premiere. Conversion jumped 146% without any paid push.",
    author: "Nadia Farrow",
    role: "Global Brand VP — Orion Private",
    city: "Dubai",
    metrics: ["+146% launch conv.", "3 week rollout"],
  },
]

const defaultStats = [
  { label: "Ultra-luxury launches activated", value: "38" },
  { label: "Average uplift in premium conversions", value: "212%" },
  { label: "Markets scaling same-day experiences", value: "11" },
]

const badgePhrases = [
  "precision storytelling",
  "obsessive craft",
  "sensorial ux",
  "obsidian-grade QA",
]

const cardEntrance = {
  initial: { opacity: 0, y: 80, rotateX: -15, scale: 0.95 },
  animate: { opacity: 1, y: 0, rotateX: 0, scale: 1 },
  exit: { opacity: 0, y: -60, rotateX: -10, scale: 0.92 },
}

export function TestimonialsSection() {
  const { locale, t } = useLocale()
  const [index, setIndex] = useState(0)
  const [testimonials, setTestimonials] = useState(defaultTestimonials)
  const [stats, setStats] = useState(defaultStats)
  const [loading, setLoading] = useState(true)
  const showcaseRef = useRef(null)
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)

  // Fetch testimonials and stats from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [testimonialsRes, statsRes] = await Promise.all([
          fetch(`/api/testimonials?lang=${locale}`),
          fetch(`/api/stats?lang=${locale}`)
        ])
        
        if (testimonialsRes.ok) {
          const testimonialsData = await testimonialsRes.json()
          if (Array.isArray(testimonialsData) && testimonialsData.length > 0) {
            setTestimonials(testimonialsData.map(t => ({
              ...t,
              metrics: Array.isArray(t.metrics) ? t.metrics : (t.metrics ? JSON.parse(t.metrics) : [])
            })))
          }
        }
        
        if (statsRes.ok) {
          const statsData = await statsRes.json()
          if (Array.isArray(statsData) && statsData.length > 0) {
            setStats(statsData.map(s => ({
              label: s.label,
              value: s.value
            })))
          }
        }
      } catch (error) {
        console.error('Failed to fetch testimonials/stats:', error)
      } finally {
        setLoading(false)
      }
    }
    
    fetchData()
  }, [locale])

  const activeTestimonial = useMemo(() => testimonials[index] || testimonials[0], [index, testimonials])
  const activeQuoteHtml = activeTestimonial?.quote || ""

  useEffect(() => {
    const timer = setInterval(
      () => setIndex((prev) => (prev + 1) % testimonials.length),
      6400
    )
    return () => clearInterval(timer)
  }, [])

  const springX = useSpring(mouseX, { stiffness: 120, damping: 12 })
  const springY = useSpring(mouseY, { stiffness: 120, damping: 12 })
  const parallaxX = useTransform(springX, [-0.5, 0.5], [-18, 18])
  const parallaxY = useTransform(springY, [-0.5, 0.5], [-12, 12])
  const glossX = useTransform(springX, [-0.5, 0.5], [20, 80])
  const glossY = useTransform(springY, [-0.5, 0.5], [25, 75])
  const gloss = useMotionTemplate`radial-gradient(circle at ${glossX}% ${glossY}%, rgba(255,215,0,0.28), transparent 65%)`

  const glowShift = useSpring(index, { stiffness: 60, damping: 14 })
  const glowGradient = useMotionTemplate`radial-gradient(circle at ${useTransform(
    glowShift,
    [0, testimonials.length - 1],
    [20, 80]
  )}% 42%, rgba(255,215,0,0.22), transparent 58%)`

  const handleMouseMove = (event) => {
    const rect = showcaseRef.current?.getBoundingClientRect()
    if (!rect) return
    const x = (event.clientX - rect.left) / rect.width - 0.5
    const y = (event.clientY - rect.top) / rect.height - 0.5
    mouseX.set(x)
    mouseY.set(y)
  }

  const resetMouse = () => {
    mouseX.set(0)
    mouseY.set(0)
  }

  const goTo = (direction) => {
    setIndex((prev) => {
      const next = prev + direction
      if (next < 0) return testimonials.length - 1
      if (next >= testimonials.length) return 0
      return next
    })
  }

  return (
    <section
      id="testimonials"
      className="relative flex min-h-screen w-full items-center bg-black py-12 md:py-20 lg:py-24 text-white"
    >
      <div className="pointer-events-none absolute inset-0">
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
        <div className="absolute inset-0 bg-linear-to-b from-black/15 via-transparent to-black/50"></div>
        <motion.div
          className="absolute inset-0 opacity-30 blur-3xl"
          style={{ backgroundImage: glowGradient }}
        />
        <motion.div
          className="absolute top-10 left-16 h-72 w-72 rounded-full bg-primary/25 blur-[120px]"
          animate={{ scale: [1, 1.15, 0.95, 1], opacity: [0.4, 0.8, 0.3, 0.4] }}
          transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-16 right-10 h-80 w-80 rounded-full bg-white/10 blur-[110px]"
          animate={{ y: [0, -30, 20, 0], rotate: [0, 12, -8, 0] }}
          transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
        />
        <div className="absolute inset-0 bg-[linear-gradient(120deg,rgba(255,255,255,0.04)_1px,transparent_1px)] bg-size-[160px_160px] opacity-15" />
        {/* Subtle noise texture using CSS - removed external image dependency */}
        <div 
          className="absolute inset-0 opacity-[0.05]"
          style={{
            backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.15) 1px, transparent 0)',
            backgroundSize: '20px 20px'
          }}
        />
        {/* Galaxy component */}
    
      </div>

      <div className="relative z-10 w-full">
        <div className="container mx-auto grid gap-8 sm:gap-12 md:gap-16 px-4 sm:px-6 md:px-8 lg:grid-cols-[0.85fr_1.15fr] xl:px-12 py-4 sm:py-6 md:py-8">
        <div className="space-y-8 sm:space-y-10 md:space-y-12">
          <div className="space-y-4 sm:space-y-6">
            <motion.div
              className="inline-flex items-center gap-3 rounded-full border border-white/10 px-5 py-2 text-xs uppercase tracking-[0.4em] text-zinc-400"
              initial={{ opacity: 0, y: -10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <span className="h-1 w-8 rounded-full bg-primary" />
              {t('testimonials.badge')}
            </motion.div>

            <motion.h2
              className="max-w-xl text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-serif font-semibold leading-tight"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            >
              {t('testimonials.title')}
            </motion.h2>

            <p className="max-w-lg text-sm sm:text-base md:text-lg text-zinc-300">
              {t('testimonials.description')}
            </p>
          </div>

          <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-3">
            {stats.map((stat) => (
              <motion.div
                key={stat.label}
                className="card-enhanced rounded-2xl sm:rounded-3xl border border-white/15 bg-white/8 p-4 sm:p-5 backdrop-blur-sm hover:bg-white/10 hover:border-primary/30 transition-all duration-300"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <p className="text-xl sm:text-2xl font-serif text-white mb-1 sm:mb-2">{stat.value}</p>
                <p className="text-[10px] sm:text-xs uppercase tracking-[0.25em] sm:tracking-[0.3em] text-zinc-400 leading-relaxed">
                  {stat.label}
                </p>
              </motion.div>
            ))}
          </div>
        </div>

        <div
          ref={showcaseRef}
          className="relative"
          onMouseMove={handleMouseMove}
          onMouseLeave={resetMouse}
        >
          <motion.div
            className={cn("absolute inset-0 rounded-[40px]")}
            style={{ translateX: parallaxX, translateY: parallaxY }}
          />

          <motion.div
            className="card-enhanced relative overflow-hidden rounded-[24px] sm:rounded-[32px] md:rounded-[40px] border border-white/15 bg-white/8 p-6 sm:p-8 md:p-10 backdrop-blur-2xl shadow-[0_50px_120px_rgba(0,0,0,0.4)] hover:bg-white/10 transition-all duration-300"
            style={{
              translateX: parallaxX,
              translateY: parallaxY,
            }}
            variants={cardEntrance}
            initial="initial"
            animate="animate"
          >
            <motion.div
              className="absolute inset-0 opacity-60"
              style={{ backgroundImage: gloss }}
            />

            <div className="relative flex items-start sm:items-center justify-between gap-3 sm:gap-4">
              <div className="flex-1 min-w-0">
                <p className="text-[10px] sm:text-xs uppercase tracking-[0.4em] sm:tracking-[0.5em] text-zinc-500">
                  {t('testimonials.featuredClient')}
                </p>
                <h3 className="text-2xl sm:text-3xl font-serif text-white truncate">
                  {activeTestimonial.author}
                </h3>
                <p className="text-xs sm:text-sm uppercase tracking-[0.3em] sm:tracking-[0.4em] text-primary">
                  {activeTestimonial.city}
                </p>
              </div>
              <div className="flex h-12 w-12 sm:h-14 sm:w-14 md:h-16 md:w-16 items-center justify-center rounded-xl sm:rounded-2xl border border-primary/30 bg-primary/10 text-primary backdrop-blur-sm flex-shrink-0">
                <Orbit className="h-5 w-5 sm:h-6 sm:w-6 md:h-7 md:w-7" />
              </div>
            </div>

            <div className="relative mt-6 sm:mt-8 md:mt-10">
              <Quote className="mb-3 sm:mb-4 h-8 w-8 sm:h-10 sm:w-10 text-primary opacity-80" />
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeQuoteHtml}
                  className="prose prose-invert max-w-none text-base sm:text-lg md:text-xl lg:text-2xl leading-relaxed text-white font-light"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                  dangerouslySetInnerHTML={{ __html: activeQuoteHtml }}
                />
              </AnimatePresence>
            </div>

            <div className="relative mt-6 sm:mt-8 md:mt-10 flex flex-col sm:flex-row sm:flex-wrap sm:items-center gap-4 sm:gap-6">
              <div>
                <p className="text-base sm:text-lg font-serif text-white">
                  {activeTestimonial.role}
                </p>
                <p className="text-[10px] sm:text-xs uppercase tracking-[0.3em] sm:tracking-[0.4em] text-zinc-500">
                  {t('testimonials.speakingOn')}
                </p>
              </div>
              <div className="flex flex-1 flex-wrap gap-2 sm:gap-3">
                {activeTestimonial.metrics.map((metric) => (
                  <span
                    key={metric}
                    className="rounded-full border border-primary/50 bg-primary/10 px-3 sm:px-4 py-1.5 sm:py-2 text-[10px] sm:text-xs uppercase tracking-[0.25em] sm:tracking-[0.3em] text-white backdrop-blur-sm hover:bg-primary/15 hover:border-primary/70 transition-all duration-300"
                  >
                    {metric}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>

          <div className="mt-4 sm:mt-6 flex flex-col sm:flex-row sm:flex-wrap gap-3 sm:gap-4">
            {testimonials.map((item, itemIndex) => (
              <button
                key={item.id || `${item.author}-${item.city}-${itemIndex}`}
                onClick={() => setIndex(itemIndex)}
                className={`flex-1 rounded-xl sm:rounded-2xl border px-3 sm:px-4 py-3 sm:py-4 text-left transition-all duration-300 min-h-[64px] sm:min-h-auto ${
                  itemIndex === index
                    ? "border-primary bg-primary/15 text-white shadow-lg shadow-primary/20"
                    : "border-white/20 bg-white/8 text-zinc-300 hover:border-primary/50 hover:bg-white/10"
                }`}
              >
                <p className="text-[10px] sm:text-xs uppercase tracking-[0.3em] sm:tracking-[0.4em]">{item.city}</p>
                <p className="mt-0.5 sm:mt-1 font-serif text-base sm:text-lg truncate">{item.author}</p>
              </button>
            ))}
          </div>
        </div>
        </div>
      </div>
    </section>
  )
}

