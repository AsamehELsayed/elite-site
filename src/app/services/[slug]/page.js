"use client"

import { useState, useEffect, useMemo } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { motion, useScroll, useTransform } from 'framer-motion'
import { ArrowLeft, ArrowUpRight, Sparkles, Zap, Palette, Globe, FileText, TrendingUp } from 'lucide-react'
import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'
import Link from 'next/link'
import { useLocale } from '@/components/locale-provider'
import { SEOHead } from '@/components/SEOHead'
import { getPageSEO } from '@/lib/seo'

const FALLBACK_SERVICE_COPY = {
  fallbackExtendedDescription: 'Comprehensive digital solutions tailored to your business needs.',
  defaultServices: [
    {
      id: '01',
      title: 'Brand Identity',
      description: 'Crafting visual systems that speak without words.',
      icon: 'Palette',
    },
    {
      id: '02',
      title: 'Digital Experience',
      description: 'Immersive web and mobile solutions for the modern age.',
      icon: 'Globe',
    },
    {
      id: '03',
      title: 'Content Strategy',
      description: 'Narratives that engage, convert, and retain.',
      icon: 'FileText',
    },
    {
      id: '04',
      title: 'Growth Marketing',
      description: 'Data-driven campaigns for scalable success.',
      icon: 'TrendingUp',
    },
  ],
  extendedDescriptions: {
    '01':
      "We believe that great brand identity goes beyond just a logo. It's about creating a cohesive visual language that resonates with your audience and communicates your values instantly. Our comprehensive approach includes logo design, color palette development, typography systems, and brand guidelines that ensure consistency across all touchpoints.",
    '02':
      "In today's digital landscape, user experience is paramount. We craft immersive web and mobile experiences that not only look stunning but also drive conversions and user engagement. From responsive design to intuitive navigation, every pixel is thoughtfully considered to create seamless interactions.",
    '03':
      'Content is the bridge between your brand and your audience. We develop strategic content frameworks that tell your story authentically and compellingly. Our approach combines data-driven insights with creative storytelling to produce content that engages, converts, and builds lasting relationships.',
    '04':
      "Growth doesn't happen by accident. We combine data analytics, market research, and creative marketing strategies to drive measurable results. Our growth marketing services encompass everything from SEO and PPC campaigns to social media marketing and conversion rate optimization.",
  },
  features: {
    '01': [
      'Logo Design & Identity Systems',
      'Brand Strategy & Positioning',
      'Visual Identity Guidelines',
      'Marketing Collateral Design',
      'Brand Asset Development',
      'Typography & Color Systems',
    ],
    '02': [
      'Responsive Web Design',
      'Mobile App Development',
      'UI/UX Design & Research',
      'Interactive Prototyping',
      'Performance Optimization',
      'Cross-platform Compatibility',
    ],
    '03': [
      'Content Strategy Development',
      'Brand Storytelling',
      'Copywriting & Messaging',
      'Content Management Systems',
      'SEO-Optimized Content',
      'Multichannel Content Creation',
    ],
    '04': [
      'Digital Marketing Campaigns',
      'SEO & SEM Services',
      'Social Media Marketing',
      'Conversion Rate Optimization',
      'Analytics & Reporting',
      'Market Research & Insights',
    ],
  },
  process: {
    '01': [
      {
        step: '01',
        title: 'Discovery',
        description:
          'Understanding your brand vision, values, and target audience through in-depth research and strategy sessions.',
      },
      {
        step: '02',
        title: 'Concept Development',
        description:
          'Creating initial design concepts and exploring different visual directions for your brand identity.',
      },
      {
        step: '03',
        title: 'Refinement',
        description: 'Iterating on designs based on feedback and ensuring alignment with your brand objectives.',
      },
      {
        step: '04',
        title: 'Implementation',
        description: 'Developing comprehensive brand guidelines and preparing all necessary brand assets.',
      },
    ],
    '02': [
      {
        step: '01',
        title: 'Research & Planning',
        description: 'User research, competitive analysis, and technical requirements gathering.',
      },
      {
        step: '02',
        title: 'Design & Prototyping',
        description: 'Creating wireframes, mockups, and interactive prototypes for user validation.',
      },
      {
        step: '03',
        title: 'Development',
        description: 'Building responsive, performant digital experiences with modern technologies.',
      },
      {
        step: '04',
        title: 'Testing & Launch',
        description: 'Comprehensive testing, optimization, and smooth deployment of your digital product.',
      },
    ],
    '03': [
      {
        step: '01',
        title: 'Strategy Development',
        description: 'Defining content goals, target audience analysis, and content strategy planning.',
      },
      {
        step: '02',
        title: 'Content Creation',
        description: 'Developing compelling narratives and creating content across multiple channels.',
      },
      {
        step: '03',
        title: 'Optimization',
        description: 'SEO optimization, performance monitoring, and content refinement.',
      },
      {
        step: '04',
        title: 'Measurement',
        description: 'Tracking engagement metrics and refining strategy based on data insights.',
      },
    ],
    '04': [
      {
        step: '01',
        title: 'Analysis & Strategy',
        description: 'Market research, competitor analysis, and comprehensive growth strategy development.',
      },
      {
        step: '02',
        title: 'Campaign Creation',
        description: 'Designing and implementing multi-channel marketing campaigns.',
      },
      {
        step: '03',
        title: 'Optimization',
        description: 'Real-time campaign monitoring and performance optimization.',
      },
      {
        step: '04',
        title: 'Reporting & Scaling',
        description: 'Detailed analytics reporting and strategic scaling recommendations.',
      },
    ],
  },
  caseStudies: {
    '01': [
      { title: 'Tech Startup Rebrand', category: 'Brand Identity', image: '/uploads/placeholder.jpg' },
      { title: 'Luxury Fashion Brand', category: 'Visual Identity', image: '/uploads/placeholder.jpg' },
      { title: 'Healthcare Platform', category: 'Digital Brand', image: '/uploads/placeholder.jpg' },
    ],
    '02': [
      { title: 'E-commerce Platform', category: 'Web Development', image: '/uploads/placeholder.jpg' },
      { title: 'SaaS Dashboard', category: 'UX/UI Design', image: '/uploads/placeholder.jpg' },
      { title: 'Mobile Banking App', category: 'Mobile Development', image: '/uploads/placeholder.jpg' },
    ],
    '03': [
      { title: 'B2B Content Strategy', category: 'Content Marketing', image: '/uploads/placeholder.jpg' },
      { title: 'Brand Storytelling Campaign', category: 'Content Creation', image: '/uploads/placeholder.jpg' },
      { title: 'SEO Content Optimization', category: 'Digital Content', image: '/uploads/placeholder.jpg' },
    ],
    '04': [
      { title: 'Lead Generation Campaign', category: 'Digital Marketing', image: '/uploads/placeholder.jpg' },
      { title: 'E-commerce Growth', category: 'Performance Marketing', image: '/uploads/placeholder.jpg' },
      { title: 'Brand Awareness Campaign', category: 'Social Media', image: '/uploads/placeholder.jpg' },
    ],
  },
}

const MISSING_TOKEN = '__MISSING_TRANSLATION__'
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
const getPreferredSlug = (service) =>
  toSlug(service?.slug) ||
  toSlug(service?.title) ||
  service?.id ||
  'service'
const matchesSlug = (service, slugParam) =>
  !!slugParam && getPreferredSlug(service) === toSlug(slugParam)

export default function ServiceDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { locale, t } = useLocale()
  const [service, setService] = useState(null)
  const [servicesData, setServicesData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [hoveredCard, setHoveredCard] = useState(null)

  const { scrollY } = useScroll()

  // Calculate progress based on global scroll for the hero section
  const scrollYProgress = useTransform(scrollY, [0, 1000], [0, 1])

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"])
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0])

  const safeT = (key) => {
    const value = t(key, MISSING_TOKEN)
    return value === MISSING_TOKEN ? undefined : value
  }

  const defaultServices = useMemo(() => {
    const localized = safeT('serviceDetail.defaultServices')
    if (localized && typeof localized === 'object') {
      return Object.entries(localized).map(([id, value]) => ({
        id,
        ...value,
      }))
    }
    return FALLBACK_SERVICE_COPY.defaultServices
  }, [locale, t])

  const fallbackExtendedDescription = useMemo(
    () =>
      safeT('serviceDetail.fallbackExtendedDescription') ??
      FALLBACK_SERVICE_COPY.fallbackExtendedDescription,
    [locale, t]
  )

  const loadingText = safeT('common.loading') ?? 'Loading...'
  const notFoundTitle = safeT('serviceDetail.notFoundTitle') ?? 'Service Not Found'
  const backToServicesText = safeT('serviceDetail.backToServices') ?? 'Back to Services'
  const backText = safeT('serviceDetail.back') ?? 'Back'
  const startProjectText = safeT('serviceDetail.startProject') ?? 'Start Your Project'
  const viewCaseStudiesText = safeT('serviceDetail.viewCaseStudies') ?? 'View Case Studies'

  useEffect(() => {
    fetchServicesData()
  }, [params?.slug, locale])

  const fetchServicesData = async () => {
    try {
      const response = await fetch(`/api/services/${params?.slug}?lang=${locale}`)
      const data = await response.json()

      if (response.ok && data?.services) {
        applyServiceData(data.services, data.service)
      } else {
        applyServiceData(defaultServices)
      }
    } catch (error) {
      console.error('Failed to fetch services:', error)
      applyServiceData(defaultServices)
    } finally {
      setLoading(false)
    }
  }

  const applyServiceData = (services, serviceFromApi) => {
    const servicesArray = Array.isArray(services) ? services : []
    setServicesData({ services: JSON.stringify(servicesArray) })

    const foundService =
      serviceFromApi ||
      servicesArray.find((s) => matchesSlug(s, params?.slug))

    if (foundService) {
      const slug = getPreferredSlug(foundService)
      const mappedIcon =
        foundService.icon === 'Palette'
          ? Palette
          : foundService.icon === 'Globe'
          ? Globe
          : foundService.icon === 'FileText'
          ? FileText
          : foundService.icon === 'TrendingUp'
          ? TrendingUp
          : Palette

      setService({
        ...foundService,
        slug,
        icon: mappedIcon,
        color: foundService.id === "01" ? "from-amber-500/20 to-yellow-500/10" :
               foundService.id === "02" ? "from-blue-500/20 to-cyan-500/10" :
               foundService.id === "03" ? "from-purple-500/20 to-pink-500/10" :
               "from-green-500/20 to-emerald-500/10",
        extendedDescription:
          foundService.extendedDescription ||
          foundService.description ||
          getExtendedDescription(foundService.id),
        features: foundService.features || getServiceFeatures(foundService.id),
        process: foundService.process || getServiceProcess(foundService.id),
        caseStudies: foundService.caseStudies || getServiceCaseStudies(foundService.id)
      })
    } else {
      setService(null)
    }
  }

  const getExtendedDescription = (id) => {
    const description = safeT(`serviceDetail.extendedDescriptions.${id}`)
    if (typeof description === 'string') {
      return description
    }
    return fallbackExtendedDescription
  }

  const getServiceFeatures = (id) => {
    const featureList = safeT(`serviceDetail.features.${id}`)
    if (Array.isArray(featureList)) {
      return featureList
    }
    return FALLBACK_SERVICE_COPY.features[id] || []
  }

  const getServiceProcess = (id) => {
    const process = safeT(`serviceDetail.process.${id}`)
    if (Array.isArray(process)) {
      return process
    }
    return FALLBACK_SERVICE_COPY.process[id] || []
  }

  const getServiceCaseStudies = (id) => {
    const cases = safeT(`serviceDetail.caseStudies.${id}`)
    if (Array.isArray(cases)) {
      return cases
    }
    return FALLBACK_SERVICE_COPY.caseStudies[id] || []
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-xl">{loadingText}</div>
      </div>
    )
  }

  if (!service) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-serif mb-4">{notFoundTitle}</h1>
          <Link href="/services">
            <button className="bg-primary text-black px-6 py-3 rounded-full font-medium hover:bg-primary/90 transition-colors">
              {backToServicesText}
            </button>
          </Link>
        </div>
      </div>
    )
  }

  const IconComponent = service.icon
  const relatedServices = servicesData
    ? JSON.parse(servicesData.services).filter((s) => getPreferredSlug(s) !== service.slug)
    : []

  const seoConfig = getPageSEO({
    title: service.title,
    description: typeof service.extendedDescription === 'string' 
      ? service.extendedDescription.replace(/<[^>]*>/g, '').substring(0, 160)
      : service.description || (locale === 'ar' ? 'خدمة احترافية من إيليت' : 'Professional service from Elite'),
    url: `/services/${service.slug}`,
  }, locale)

  return (
    <>
      <SEOHead {...seoConfig} />
      <main className="bg-black text-white min-h-screen">
        <SiteHeader />

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center overflow-hidden py-20">
        {/* Video Background */}
        <div className="absolute inset-0 z-0">
          <video
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover"
          >
            <source src="/hero-video.mp4" type="video/mp4" />
            <source src="/hero-video.webm" type="video/webm" />
          </video>
          <div className="absolute inset-0 bg-black/60"></div>
        </div>

        

        {/* Background Elements */}
        <motion.div
          className={`absolute top-20 left-4 sm:left-20 w-48 h-48 sm:w-64 sm:h-64 bg-linear-to-r ${service.color} rounded-full blur-[100px]`}
          style={{ y, opacity }}
          animate={{
            scale: [1, 1.3, 1],
            x: [0, 50, 0],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />

        {/* Back Button */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="absolute top-4 left-4 sm:top-8 sm:left-8 z-50"
        >
          <Link href="/services">
            <motion.button
              className="flex items-center gap-2 sm:gap-3 bg-zinc-900/80 backdrop-blur-sm border border-zinc-700 px-4 py-2 sm:px-6 sm:py-3 rounded-full text-zinc-300 hover:text-white hover:border-primary/50 transition-all duration-300 text-sm sm:text-base"
              whileHover={{ scale: 1.05, x: -5 }}
              whileTap={{ scale: 0.95 }}
            >
              <ArrowLeft className="w-3 h-3 sm:w-4 sm:h-4" />
              <span className="hidden xs:inline">{backToServicesText}</span>
              <span className="xs:hidden">{backText}</span>
            </motion.button>
          </Link>
        </motion.div>

        {/* Hero Content */}
        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <div className="max-w-4xl">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.3 }}
              className="flex items-center gap-3 sm:gap-4 mb-4 sm:mb-6"
            >
              <motion.div
                className="h-[2px] bg-linear-to-r from-primary via-primary/50 to-transparent"
                animate={{ scaleX: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                initial={{ width: 0 }}
              />
              <motion.div
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              >
                <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
              </motion.div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 mb-6 sm:mb-8"
            >
              <motion.div
                animate={{
                  scale: [1, 1.1, 1],
                  rotate: [0, 5, -5, 0],
                }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-full border border-primary/50 flex items-center justify-center bg-zinc-900/50 backdrop-blur-sm">
                  <IconComponent className="w-7 h-7 sm:w-10 sm:h-10 md:w-12 md:h-12 text-primary" />
                </div>
              </motion.div>

              <div>
                <motion.span
                  className="text-primary font-mono text-lg sm:text-xl md:text-2xl font-bold block mb-2"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6, delay: 0.6 }}
                >
                  {service.id}
                </motion.span>
                <motion.h1
                  className="text-3xl sm:text-5xl md:text-7xl lg:text-8xl font-serif text-white leading-[0.9]"
                  initial={{ opacity: 0, y: 30, filter: "blur(10px)" }}
                  animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  transition={{ duration: 1, delay: 0.7, ease: [0.22, 1, 0.36, 1] }}
                >
                  {service.title}
                </motion.h1>
              </div>
            </motion.div>

            <motion.div
              className="text-zinc-300 text-base sm:text-lg md:text-xl max-w-2xl leading-relaxed mb-8 sm:mb-12 prose prose-invert"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.9 }}
              dangerouslySetInnerHTML={{ __html: service.extendedDescription }}
            />

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1.1 }}
              className="flex flex-col sm:flex-row gap-3 sm:gap-4"
            >
              <motion.button
                className="bg-primary text-black px-6 sm:px-8 py-3 sm:py-4 rounded-full font-medium text-base sm:text-lg hover:bg-primary/90 transition-all duration-300 shadow-lg shadow-primary/25"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => router.push('/contact')}
              >
              {startProjectText}
              </motion.button>
              <motion.button
                className="border border-zinc-700 text-zinc-300 px-6 sm:px-8 py-3 sm:py-4 rounded-full font-medium text-base sm:text-lg hover:border-primary hover:text-primary transition-all duration-300"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              onClick={() => router.push('/#work')}
              >
              {viewCaseStudiesText}
              </motion.button>
            </motion.div>
          </div>
        </div>
      </section>

      

      <SiteFooter />
      </main>
    </>
  )
}
