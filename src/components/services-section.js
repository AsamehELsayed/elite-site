"use client"

import { motion, useScroll, useTransform } from "framer-motion"
import { ArrowUpRight, Zap, Palette, Globe, FileText, TrendingUp, Sparkles } from 'lucide-react'
import { useState, useRef, useEffect } from "react"
import LiquidEther from "./LiquidEther"
import { LaserFlow } from "@/components/leserflow"
import Galaxy from "./star"
import Link from "next/link"
import { useLocale } from "@/components/locale-provider"
import { cn } from "@/lib/utils"

const toSlug = (value) => {
  if (!value) return ''
  const slug = value
    .toString()
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^\p{L}\p{N}-]/gu, '') // Keep Unicode letters, numbers, and hyphens
    .replace(/^-+|-+$/g, '') // Remove leading/trailing hyphens
  return slug || null // Return null if slug is empty
}

export function ServicesSection() {
  const { locale } = useLocale()
  const [hoveredIndex, setHoveredIndex] = useState(null)
  const [servicesData, setServicesData] = useState(null)
  const [loading, setLoading] = useState(true)
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  })

  const opacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0.3, 1, 1, 0.3])
  const y = useTransform(scrollYProgress, [0, 1], [50, -50])
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.95, 1, 0.95])

  useEffect(() => {
    fetchServicesData()
  }, [locale])

  const fetchServicesData = async () => {
    try {
      const response = await fetch(`/api/services?lang=${locale}`)
      const data = await response.json()
      if (data && !data.error) {
        setServicesData(data)
      }
    } catch (error) {
      console.error('Failed to fetch services data:', error)
    } finally {
      setLoading(false)
    }
  }

  // Default services in case API fails
  const services = servicesData?.services ? JSON.parse(servicesData.services).map(service => ({
    ...service,
    slug: service.slug || toSlug(service.title) || service.id || 'service',
    icon: service.icon === 'Palette' ? Palette :
          service.icon === 'Globe' ? Globe :
          service.icon === 'FileText' ? FileText :
          service.icon === 'TrendingUp' ? TrendingUp : Palette,
    color: service.id === "01" ? "from-amber-500/20 to-yellow-500/10" :
           service.id === "02" ? "from-blue-500/20 to-cyan-500/10" :
           service.id === "03" ? "from-purple-500/20 to-pink-500/10" :
           "from-green-500/20 to-emerald-500/10"
  })) : [
    {
      id: "01",
      slug: "brand-identity",
      title: "Brand Identity",
      description: "Crafting visual systems that speak without words.",
      icon: Palette,
      color: "from-amber-500/20 to-yellow-500/10",
    },
    {
      id: "02",
      slug: "digital-experience",
      title: "Digital Experience",
      description: "Immersive web and mobile solutions for the modern age.",
      icon: Globe,
      color: "from-blue-500/20 to-cyan-500/10",
    },
    {
      id: "03",
      slug: "content-strategy",
      title: "Content Strategy",
      description: "Narratives that engage, convert, and retain.",
      icon: FileText,
      color: "from-purple-500/20 to-pink-500/10",
    },
    {
      id: "04",
      slug: "growth-marketing",
      title: "Growth Marketing",
      description: "Data-driven campaigns for scalable success.",
      icon: TrendingUp,
      color: "from-green-500/20 to-emerald-500/10",
    },
  ]

  const sectionTitle = servicesData?.sectionTitle || 'Comprehensive Solutions'
  const sectionSubtitle = servicesData?.sectionSubtitle || 'Our Expertise'

  return (
    <section ref={ref} className="w-full h-full bg-black relative overflow-y-auto overflow-x-hidden scroll-smooth">
      {/* Background wrapper - fixed to prevent scrolling with content */}
      <div className="fixed inset-0 pointer-events-none">
        {/* Enhanced background effects */}
        <motion.div
          className="absolute top-0 left-0 w-64 h-64 bg-primary/10 rounded-full blur-[100px]"
          style={{ y, opacity }}
          animate={{
            scale: [1, 1.2, 1],
            x: [0, 30, 0],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute bottom-0 right-0 w-80 h-80 bg-primary/5 rounded-full blur-[120px]"
          style={{ scale, opacity }}
          animate={{
            scale: [1, 1.1, 1],
            x: [0, -20, 0],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />

        {/* LiquidEther background effect */}
        <div className="absolute inset-0 opacity-30">
          <LiquidEther
            colors={['#EDC9AF']}
            mouseForce={5}
            cursorSize={80}
            isViscous={true}
            viscous={20}
            iterationsViscous={16}
            iterationsPoisson={16}
            resolution={0.3}
            isBounce={true}
            autoSpeed={0.3}
            autoIntensity={1.5}
            takeoverDuration={0.5}
            autoResumeDelay={5000}
            autoRampDuration={1.0}
          />
        </div>

        {/* Subtle grid pattern overlay */}
        <div className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: `linear-gradient(rgba(212, 175, 55, 0.1) 1px, transparent 1px),
                              linear-gradient(90deg, rgba(212, 175, 55, 0.1) 1px, transparent 1px)`,
            backgroundSize: '50px 50px'
          }}
        />

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/50 to-black" />
      </div>

      <div className="container mx-auto px-4 sm:px-5 md:px-6 py-10 sm:py-12 md:py-16 lg:py-20 relative z-10 min-h-full">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 50, filter: "blur(10px)" }}
          whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
          viewport={{ once: false, amount: 0.3 }}
          className="text-center mb-6 sm:mb-8 md:mb-12 lg:mb-16"
        >
          <motion.div
            className="flex items-center justify-center gap-4 mb-6"
            initial={{ width: 0, opacity: 0 }}
            whileInView={{ width: 100, opacity: 1 }}
            transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
            viewport={{ once: false }}
          >
            <motion.div
              className="h-[2px] bg-gradient-to-r from-primary via-primary/50 to-transparent"
              animate={{ scaleX: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            <motion.div
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            >
              <Sparkles className="w-5 h-5 text-primary" />
            </motion.div>
            <motion.div
              className="h-[2px] bg-gradient-to-l from-primary via-primary/50 to-transparent"
              animate={{ scaleX: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </motion.div>

          <motion.span
            className="text-primary text-xs uppercase tracking-[0.3em] block mb-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            viewport={{ once: false }}
          >
            {sectionSubtitle}
          </motion.span>

          <motion.h2
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-serif text-white mb-4 sm:mb-6 leading-[0.9]"
            initial={{ opacity: 0, y: 30, filter: "blur(10px)" }}
            whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 1, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
            viewport={{ once: false }}
          >
            <motion.span
              className="block"
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              viewport={{ once: false }}
            >
              {sectionTitle.split(' ')[0]}
            </motion.span>
            <motion.span
              className="block gold-gradient-text"
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              viewport={{ once: false }}
            >
              {sectionTitle.split(' ').slice(1).join(' ')}
            </motion.span>
          </motion.h2>

          <motion.p
            className="text-zinc-400 text-sm sm:text-base md:text-lg max-w-2xl mx-auto leading-relaxed px-2 sm:px-0"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.7 }}
            viewport={{ once: false }}
          >
            Discover our comprehensive range of digital solutions, crafted to elevate your brand and drive exceptional results.
          </motion.p>
        </motion.div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4 md:gap-6 lg:gap-10 xl:gap-12">
          {services.map((service, index) => {
            const IconComponent = service.icon
            const isEven = index % 2 === 0

            return (
            <Link
              key={service.id}
              href={`/services/${service.slug || toSlug(service.title) || service.id}`}
              className="block"
            >
                <motion.div
                  initial={{ opacity: 0, y: 100, filter: "blur(10px)" }}
                  whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  transition={{
                    duration: 0.8,
                    delay: index * 0.1,
                    ease: [0.22, 1, 0.36, 1]
                  }}
                  viewport={{ once: false, margin: "-50px" }}
                  onHoverStart={() => setHoveredIndex(index)}
                  onHoverEnd={() => setHoveredIndex(null)}
                  className={cn(
                    'group relative overflow-hidden rounded-2xl border border-zinc-800/50 bg-zinc-900/20 backdrop-blur-sm hover:bg-zinc-800/30 transition-all duration-700 cursor-pointer',
                    isEven ? 'lg:mt-6' : 'lg:mb-6'
                  )}
                >
                  {/* Animated gradient background */}
                  <motion.div
                    className={`absolute inset-0 bg-gradient-to-br ${service.color} opacity-0 group-hover:opacity-100`}
                    initial={{ scale: 0.8, rotate: -5 }}
                    animate={{
                      scale: hoveredIndex === index ? 1.1 : 0.8,
                      rotate: hoveredIndex === index ? 0 : -5
                    }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                  />

                  {/* Shimmer effect */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent"
                    initial={{ x: "-200%" }}
                    animate={{
                      x: hoveredIndex === index ? "200%" : "-200%"
                    }}
                    transition={{
                      duration: 1.5,
                      ease: "easeInOut",
                      repeat: hoveredIndex === index ? Infinity : 0,
                      repeatDelay: 0.5
                    }}
                  />

                  {/* Glow effect on hover */}
                  <motion.div
                    className="absolute inset-0 bg-primary/5 blur-3xl opacity-0 group-hover:opacity-100"
                    animate={{
                      scale: hoveredIndex === index ? [1, 1.2, 1] : 1,
                    }}
                    transition={{ duration: 2, repeat: hoveredIndex === index ? Infinity : 0 }}
                  />

                  {/* Content */}
                  <div className="relative z-10 p-5 sm:p-6 md:p-8 lg:p-10 h-full flex flex-col justify-between">
                    {/* Top section with icon and number */}
                    <div className="flex items-center justify-between mb-3 sm:mb-4">
                      <motion.div
                        className="relative"
                        animate={{
                          scale: hoveredIndex === index ? [1, 1.2, 1] : 1,
                          rotate: hoveredIndex === index ? [0, 10, -10, 0] : 0,
                        }}
                        transition={{ duration: 0.6 }}
                      >
                        <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-full border border-zinc-700 flex items-center justify-center group-hover:border-primary/50 transition-all duration-500 bg-zinc-900/50 group-hover:bg-zinc-800/50 backdrop-blur-sm">
                          <IconComponent className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-zinc-500 group-hover:text-primary transition-colors duration-500" />
                        </div>
                        {/* Icon glow */}
                        <motion.div
                          className="absolute inset-0 bg-primary/20 blur-xl rounded-full opacity-0 group-hover:opacity-100"
                          transition={{ duration: 0.5 }}
                        />
                      </motion.div>

                      <motion.span
                        className="text-primary font-mono text-base sm:text-lg md:text-xl font-bold"
                        animate={{
                          scale: hoveredIndex === index ? 1.2 : 1,
                          rotate: hoveredIndex === index ? [0, 5, -5, 0] : 0
                        }}
                        transition={{ duration: 0.4 }}
                      >
                        {service.id}
                      </motion.span>
                    </div>

                    {/* Title and description */}
                    <div className="flex-1 flex flex-col justify-center">
                      <motion.h3
                        className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-serif text-zinc-400 group-hover:text-white transition-colors duration-500 mb-3 sm:mb-4 leading-tight"
                        animate={{
                          y: hoveredIndex === index ? -10 : 0,
                          scale: hoveredIndex === index ? 1.02 : 1
                        }}
                        transition={{ duration: 0.4, ease: "easeOut" }}
                      >
                        {service.title}
                      </motion.h3>

                      <motion.div
                        className="text-zinc-500 group-hover:text-zinc-300 text-sm md:text-base leading-relaxed max-w-md prose prose-invert"
                        initial={{ opacity: 0.7 }}
                        animate={{
                          opacity: hoveredIndex === index ? 1 : 0.7,
                          y: hoveredIndex === index ? -5 : 0
                        }}
                        transition={{ duration: 0.4, ease: "easeOut" }}
                        dangerouslySetInnerHTML={{ __html: service.description }}
                      />
                    </div>

                    {/* Bottom section with arrow */}
                    <div className="flex justify-end mt-2 sm:mt-0">
                      <motion.div
                        className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-full border border-zinc-700 flex items-center justify-center group-hover:bg-primary group-hover:border-primary transition-all duration-500 relative overflow-hidden"
                        animate={{
                          rotate: hoveredIndex === index ? 45 : 0,
                          scale: hoveredIndex === index ? 1.1 : 1
                        }}
                        transition={{ duration: 0.4, ease: "easeOut" }}
                      >
                        {/* Button glow */}
                        <motion.div
                          className="absolute inset-0 bg-primary/30 blur-md opacity-0 group-hover:opacity-100"
                          animate={{
                            scale: hoveredIndex === index ? [1, 1.5, 1] : 1,
                          }}
                          transition={{ duration: 1.5, repeat: hoveredIndex === index ? Infinity : 0 }}
                        />
                        <ArrowUpRight className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 text-zinc-400 group-hover:text-black transition-colors duration-500 relative z-10" />
                      </motion.div>
                    </div>
                  </div>

                  {/* Decorative elements */}
                  <motion.div
                    className="absolute top-4 right-4 w-2 h-2 bg-primary rounded-full opacity-0 group-hover:opacity-100"
                    animate={{
                      scale: hoveredIndex === index ? [1, 1.5, 1] : 1,
                    }}
                    transition={{ duration: 0.8, repeat: hoveredIndex === index ? Infinity : 0 }}
                  />
                  <motion.div
                    className="absolute bottom-4 left-4 w-1 h-1 bg-primary rounded-full opacity-0 group-hover:opacity-100"
                    animate={{
                      scale: hoveredIndex === index ? [1, 1.3, 1] : 1,
                    }}
                    transition={{ duration: 0.6, repeat: hoveredIndex === index ? Infinity : 0 }}
                  />
                </motion.div>
              </Link>
            )
          })}
        </div>

        {/* Call to action */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.5 }}
          viewport={{ once: false }}
          className="text-center mt-6 sm:mt-8 md:mt-12 lg:mt-16 px-4"
        >
          <motion.p
            className="text-zinc-400 text-sm sm:text-base mb-6 sm:mb-8"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.7 }}
            viewport={{ once: false }}
          >
            Ready to transform your digital presence?
          </motion.p>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.9 }}
            viewport={{ once: false }}
            className="w-full sm:w-auto inline-block"
          >
            <Link href="/contact" className="block">
              <motion.button
                className="bg-primary text-black px-6 sm:px-8 py-3 sm:py-4 rounded-full font-medium text-sm sm:text-base hover:bg-primary/90 transition-all duration-300 shadow-lg shadow-primary/25 w-full sm:w-auto min-h-[48px]"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Start Your Project
              </motion.button>
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
