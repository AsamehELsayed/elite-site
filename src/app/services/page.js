"use client"

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { ArrowUpRight, Sparkles, Zap, Palette, Globe, FileText, TrendingUp } from 'lucide-react'
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import LiquidEther from "@/components/LiquidEther"
import Link from 'next/link'
import { useLocale } from '@/components/locale-provider'
import { SEOHead } from '@/components/SEOHead'
import { getPageSEO } from '@/lib/seo'

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

export default function ServicesPage() {
  const { locale } = useLocale()
  const [servicesData, setServicesData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [hoveredIndex, setHoveredIndex] = useState(null)

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

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    )
  }

  const seoConfig = getPageSEO({
    title: locale === 'ar' ? 'الخدمات' : 'Services',
    description: locale === 'ar' 
      ? 'اكتشف مجموعة شاملة من الحلول الرقمية المصممة لرفع علامتك التجارية وتحقيق نتائج استثنائية.'
      : 'Discover our comprehensive range of digital solutions, crafted to elevate your brand and drive exceptional results.',
    url: '/services',
  }, locale)

  return (
    <>
      <SEOHead {...seoConfig} />
      <main className="bg-black text-white min-h-screen">
        <SiteHeader />

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center bg-black overflow-hidden py-16 sm:py-20">
        {/* Background Effects */}
        <motion.div
          className="absolute top-0 left-0 w-48 h-48 sm:w-64 sm:h-64 bg-primary/10 rounded-full blur-[100px]"
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
          className="absolute bottom-0 right-0 w-56 h-56 sm:w-80 sm:h-80 bg-primary/5 rounded-full blur-[120px]"
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
        <div className="absolute inset-0 opacity-[0.02] pointer-events-none"
          style={{
            backgroundImage: `linear-gradient(rgba(212, 175, 55, 0.1) 1px, transparent 1px),
                              linear-gradient(90deg, rgba(212, 175, 55, 0.1) 1px, transparent 1px)`,
            backgroundSize: '50px 50px'
          }}
        />

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/50 to-black pointer-events-none" />

        <div className="container mx-auto px-4 md:px-6 relative z-10">
          {/* Header Section */}
          <motion.div
            initial={{ opacity: 0, y: 50, filter: "blur(10px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
            className="text-center mb-12 sm:mb-20"
          >
            <motion.div
              className="flex items-center justify-center gap-3 sm:gap-4 mb-4 sm:mb-6"
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 100, opacity: 1 }}
              transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
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
                <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
              </motion.div>
              <motion.div
                className="h-[2px] bg-gradient-to-l from-primary via-primary/50 to-transparent"
                animate={{ scaleX: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            </motion.div>

            <motion.span
              className="text-primary text-sm uppercase tracking-[0.3em] block mb-3 sm:mb-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              {sectionSubtitle}
            </motion.span>

            <motion.h1
              className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-serif text-white mb-4 sm:mb-6 leading-[0.9]"
              initial={{ opacity: 0, y: 30, filter: "blur(10px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              transition={{ duration: 1, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
            >
              <motion.span
                className="block"
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.5 }}
              >
                {sectionTitle.split(' ')[0]}
              </motion.span>
              <motion.span
                className="block gold-gradient-text"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
              >
                {sectionTitle.split(' ').slice(1).join(' ')}
              </motion.span>
            </motion.h1>

            <motion.p
              className="text-zinc-400 text-base sm:text-lg md:text-xl max-w-2xl mx-auto leading-relaxed px-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.7 }}
            >
              Discover our comprehensive range of digital solutions, crafted to elevate your brand and drive exceptional results.
            </motion.p>
          </motion.div>

          {/* Services Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 md:gap-8 lg:gap-12 mb-12 sm:mb-20">
            {services.map((service, index) => {
              const IconComponent = service.icon
              const isEven = index % 2 === 0

              return (
                <Link key={service.id} href={`/services/${service.slug || toSlug(service.title) || service.id}`}>
                  <motion.div
                    initial={{ opacity: 0, y: 100, filter: "blur(10px)" }}
                    animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                    transition={{
                      duration: 0.8,
                      delay: index * 0.1,
                      ease: [0.22, 1, 0.36, 1]
                    }}
                    onHoverStart={() => setHoveredIndex(index)}
                    onHoverEnd={() => setHoveredIndex(null)}
                    className={`group relative overflow-hidden rounded-2xl border border-zinc-800/50 bg-zinc-900/20 backdrop-blur-sm hover:bg-zinc-800/30 transition-all duration-700 cursor-pointer h-72 sm:h-80 md:h-96 ${isEven ? 'lg:mt-12' : 'lg:mb-12'}`}
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
                    <div className="relative z-10 p-6 sm:p-8 md:p-10 h-full flex flex-col justify-between">
                      {/* Top section with icon and number */}
                      <div className="flex items-center justify-between mb-4 sm:mb-6">
                        <motion.div
                          className="relative"
                          animate={{
                            scale: hoveredIndex === index ? [1, 1.2, 1] : 1,
                            rotate: hoveredIndex === index ? [0, 10, -10, 0] : 0,
                          }}
                          transition={{ duration: 0.6 }}
                        >
                          <div className="w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 rounded-full border border-zinc-700 flex items-center justify-center group-hover:border-primary/50 transition-all duration-500 bg-zinc-900/50 group-hover:bg-zinc-800/50 backdrop-blur-sm">
                            <IconComponent className="w-5 h-5 sm:w-7 sm:h-7 md:w-8 md:h-8 text-zinc-500 group-hover:text-primary transition-colors duration-500" />
                          </div>
                          {/* Icon glow */}
                          <motion.div
                            className="absolute inset-0 bg-primary/20 blur-xl rounded-full opacity-0 group-hover:opacity-100"
                            transition={{ duration: 0.5 }}
                          />
                        </motion.div>

                        <motion.span
                          className="text-primary font-mono text-lg md:text-xl font-bold"
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
                          className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-serif text-zinc-400 group-hover:text-white transition-colors duration-500 mb-3 sm:mb-4 leading-tight"
                          animate={{
                            y: hoveredIndex === index ? -10 : 0,
                            scale: hoveredIndex === index ? 1.02 : 1
                          }}
                          transition={{ duration: 0.4, ease: "easeOut" }}
                        >
                          {service.title}
                        </motion.h3>

                        <motion.div
                          className="text-zinc-500 group-hover:text-zinc-300 text-sm sm:text-base md:text-lg leading-relaxed max-w-md prose prose-invert"
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
                      <div className="flex justify-end">
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
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.5 }}
            className="text-center"
          >
            <motion.p
              className="text-zinc-400 text-lg mb-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.7 }}
            >
              Ready to transform your digital presence?
            </motion.p>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.9 }}
            >
              <Link href="/contact">
                <motion.button
                  className="bg-primary text-black px-8 py-4 rounded-full font-medium text-lg hover:bg-primary/90 transition-all duration-300 shadow-lg shadow-primary/25"
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

      <SiteFooter />
      </main>
    </>
  )
}
