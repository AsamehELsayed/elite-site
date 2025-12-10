"use client"

import { motion, useScroll, useTransform, useMotionValue, useSpring } from "framer-motion"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, Sparkles } from 'lucide-react'
import { useRef, useState, useEffect } from "react"
import TextPressure from "./TextPressure"
import ScrollStack, { ScrollStackItem } from "./ScrollStack"
import LiquidEther from "./LiquidEther"
import { LaserFlow } from "@/components/leserflow"
import { useLocale } from "@/components/locale-provider"
import { useLoading } from "@/contexts/LoadingContext"

export function HeroSection() {
    const { locale, t } = useLocale()
    const { setIsLoading } = useLoading()
    const ref = useRef(null)
    const magnetRef = useRef(null)
    const [hero, setHero] = useState(null)
    const [videoLoaded, setVideoLoaded] = useState(false)
    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ["start start", "end start"]
    })

    const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"])
    const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0])
    const scale = useTransform(scrollYProgress, [0, 1], [1, 1.2])
    const magnetX = useMotionValue(0)
    const magnetY = useMotionValue(0)
    const springX = useSpring(magnetX, { stiffness: 250, damping: 20, mass: 0.8 })
    const springY = useSpring(magnetY, { stiffness: 250, damping: 20, mass: 0.8 })

    // Fetch hero data from API
    useEffect(() => {
        const fetchHero = async () => {
            try {
                const response = await fetch(`/api/hero?lang=${locale}`)
                if (response.ok) {
                    const data = await response.json()
                    if (data && !data.error) {
                        setHero(data)
                    }
                }
            } catch (error) {
                console.error('Failed to fetch hero:', error)
            }
        }
        
        fetchHero()
    }, [locale])

    // Check if everything is loaded
    useEffect(() => {
        if (videoLoaded && hero !== null) {
            // Add a small delay to ensure smooth transition
            setTimeout(() => {
                setIsLoading(false)
            }, 500)
        }
    }, [videoLoaded, hero, setIsLoading])

    // Fallback: if video fails to load or takes too long, hide loader after 8 seconds
    useEffect(() => {
        const fallbackTimeout = setTimeout(() => {
            setIsLoading(false)
        }, 8000)

        return () => clearTimeout(fallbackTimeout)
    }, [setIsLoading])

    const ctaHref = hero?.ctaLink?.trim() || "/contact"
    const showreelHref = hero?.showreelLink?.trim() || "/showreel"
    const isExternalLink = (href) => /^https?:\/\//i.test(href)
    const handleMagnetMove = (event) => {
        const node = magnetRef.current
        if (!node) return
        const rect = node.getBoundingClientRect()
        const deltaX = event.clientX - (rect.left + rect.width / 2)
        const deltaY = event.clientY - (rect.top + rect.height / 2)
        const magnetStrength = 0.25 // smaller = tighter effect
        magnetX.set(deltaX * magnetStrength)
        magnetY.set(deltaY * magnetStrength)
    }

    const handleMagnetLeave = () => {
        magnetX.set(0)
        magnetY.set(0)
    }

    const descriptionHtml = hero?.description || t('hero.description')

    return (
        <section ref={ref} id="home" className="relative w-full h-screen flex items-center justify-center overflow-hidden bg-black">
            {/* Video Background */}
            <div className="absolute inset-0 z-0" suppressHydrationWarning>
                <video
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="w-full h-full object-cover"
                    onLoadedData={() => setVideoLoaded(true)}
                    onCanPlayThrough={() => setVideoLoaded(true)}
                    suppressHydrationWarning
                >
                    <source src="/hero-video.mp4" type="video/mp4" />
                    <source src="/hero-video.webm" type="video/webm" />
                    {/* Fallback if video doesn't load */}
                </video>
                {/* Dark overlay for better text readability */}
                <div className="absolute inset-0 bg-black/40"></div>
            </div>

        
        
            {/* Content */}
            <div className="container mx-auto px-4 sm:px-5 md:px-6 relative z-3 text-center">
                <div className="flex flex-col items-center">
                    <h1 className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-serif font-bold text-white mb-4 sm:mb-6 leading-[1.1] tracking-tight">
                        <div className="flex flex-col items-center gap-1.5 sm:gap-2 md:gap-3">
                            <TextPressure
                                className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl"
                                text={hero?.title || t('hero.title')}
                                flex={true}
                                alpha={false}
                                stroke={false}
                                width={true}
                                weight={true}
                                italic={true}
                                textColor="#ffffff"
                                strokeColor="#ff0000"
                                minFontSize={28}
                            />
                            <span className="block italic font-light text-primary gold-gradient-text text-2xl sm:text-3xl md:text-5xl lg:text-6xl tracking-wider">
                                {hero?.subtitle || t('hero.subtitle')}
                            </span>
                        </div>
                    </h1>

                    <div
                        className="text-zinc-300 text-base sm:text-lg md:text-xl max-w-xl mx-auto mb-8 sm:mb-10 md:mb-12 leading-relaxed font-light px-2 sm:px-0"
                        dangerouslySetInnerHTML={{ __html: descriptionHtml }}
                    />

                    <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 w-full sm:w-auto px-4 sm:px-0">
                        <motion.div
                            ref={magnetRef}
                            style={{ x: springX, y: springY }}
                            onMouseMove={handleMagnetMove}
                            onMouseLeave={handleMagnetLeave}
                            whileHover={{ scale: 1.03 }}
                            transition={{ type: "spring", stiffness: 260, damping: 18 }}
                            className="w-full sm:w-auto"
                        >
                            <Button
                                asChild
                                className="bg-white text-black hover:bg-primary hover:text-black rounded-full px-8 sm:px-10 py-5 sm:py-6 md:py-7 text-base sm:text-lg font-medium transition-all duration-300 shadow-lg shadow-white/20 w-full sm:w-auto min-h-[52px] sm:min-h-[60px]"
                            >
                                {isExternalLink(ctaHref) ? (
                                    <a href={ctaHref} target="_blank" rel="noreferrer" className="w-full sm:w-auto flex items-center justify-center">
                                        {hero?.ctaText || t('hero.cta')}
                                    </a>
                                ) : (
                                    <Link href={ctaHref} className="w-full sm:w-auto flex items-center justify-center">
                                        {hero?.ctaText || t('hero.cta')}
                                    </Link>
                                )}
                            </Button>
                        </motion.div>
                    
                    </div>
                </div>
            </div>

        </section>
    )
}