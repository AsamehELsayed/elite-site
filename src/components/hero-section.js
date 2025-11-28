"use client"

import { motion, useScroll, useTransform } from "framer-motion"
import { Button } from "@/components/ui/button"
import { ArrowRight, Sparkles } from 'lucide-react'
import { useRef } from "react"
import TextPressure from "./TextPressure"
import ScrollStack, { ScrollStackItem } from "./ScrollStack"
import LiquidEther from "./LiquidEther"
import { LaserFlow } from "@/components/leserflow"

export function HeroSection() {
    const ref = useRef(null)
    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ["start start", "end start"]
    })

    const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"])
    const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0])
    const scale = useTransform(scrollYProgress, [0, 1], [1, 1.2])

    return (
        <section ref={ref} id="home" className="relative w-full h-screen flex items-center justify-center overflow-hidden bg-black">
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
                    {/* Fallback if video doesn't load */}
                </video>
                {/* Dark overlay for better text readability */}
                <div className="absolute inset-0 bg-black/40"></div>
            </div>

            {/* Background LiquidEther Effect */}
            <div className="absolute inset-0 z-[1]">
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
        
            {/* Content */}
            <div className="container mx-auto px-4 md:px-6 relative z-[3] text-center">
                <motion.div
                    initial={{ opacity: 0, y: 100 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                    viewport={{ once: true }}
                    className="flex flex-col items-center"
                >

                    <motion.h1
                        className="text-4xl md:text-6xl lg:text-7xl font-serif font-bold text-white mb-6 leading-[1.1] tracking-tight"
                        initial="hidden"
                        animate="visible"
                    >
                        <div className="flex flex-col items-center gap-2 md:gap-3">
                            <TextPressure
                                className="text-5xl md:text-7xl lg:text-8xl"
                                text="ELITE!"
                                flex={true}
                                alpha={false}
                                stroke={false}
                                width={true}
                                weight={true}
                                italic={true}
                                textColor="#ffffff"
                                strokeColor="#ff0000"
                                minFontSize={32}
                            />
                            <motion.span
                                className="block italic font-light text-primary gold-gradient-text text-3xl md:text-5xl lg:text-6xl tracking-wider"
                                variants={{
                                    hidden: { opacity: 0, scale: 0.5, rotate: -10 },
                                    visible: { opacity: 1, scale: 1, rotate: 0 }
                                }}
                                transition={{ duration: 1, delay: 0.5, type: "spring", bounce: 0.4 }}
                            >
                                DIGITAL AGENCY
                            </motion.span>
                        </div>
                    </motion.h1>

                    <motion.p
                        className="text-zinc-300 text-lg md:text-xl max-w-xl mx-auto mb-12 leading-relaxed font-light"
                        initial={{ opacity: 0, filter: "blur(10px)" }}
                        animate={{ opacity: 1, filter: "blur(0px)" }}
                        transition={{ duration: 1, delay: 1 }}
                    >
                        Where data meets desire. We build digital experiences that breathe life into brands and captivate audiences.
                    </motion.p>

                    <motion.div
                        className="flex flex-col md:flex-row items-center gap-6"
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 1.2 }}
                    >
                        <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
                            <Button className="bg-white text-black hover:bg-primary hover:text-black rounded-full px-10 py-7 text-lg font-medium transition-all duration-300 shadow-lg shadow-white/20">
                                Start Project
                            </Button>
                        </motion.div>
                        <motion.div whileHover={{ x: 10 }}>
                            <Button variant="link" className="text-white hover:text-primary text-lg font-medium group">
                                View Showreel <ArrowRight className="ml-2 w-5 h-5 transition-transform group-hover:translate-x-2" />
                            </Button>
                        </motion.div>
                    </motion.div>
                </motion.div>


            </div>

        </section>
    )
}