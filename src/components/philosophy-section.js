"use client"

import { motion, useScroll, useTransform } from "framer-motion"
import { useRef, useState, useEffect } from "react"
import ClickSpark from "./ClickSpark"
import LiquidEther from "./LiquidEther"
import { LaserFlow } from "@/components/leserflow"
import Galaxy from "./star"
import { useLocale } from "@/components/locale-provider"

export function PhilosophySection() {
  const { locale } = useLocale()
  const ref = useRef(null)
  const [philosophy, setPhilosophy] = useState(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  })
  
  const rotateX = useTransform(scrollYProgress, [0, 1], [15, -15])
  const opacity = useTransform(scrollYProgress, [0, 0.5, 1], [0.5, 1, 0.5])
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.95, 1, 0.95])
  const y = useTransform(scrollYProgress, [0, 1], [0, -50])

  // Fetch philosophy data from API
  useEffect(() => {
    const fetchPhilosophy = async () => {
      try {
        const response = await fetch(`/api/philosophy?lang=${locale}`)
        if (response.ok) {
          const data = await response.json()
          if (data && !data.error) {
            setPhilosophy(data)
          }
        }
      } catch (error) {
        console.error('Failed to fetch philosophy:', error)
      }
    }
    
    fetchPhilosophy()
  }, [locale])

  return (
    <section ref={ref} id="philosophy" className="w-full min-h-screen md:h-screen flex items-center justify-center bg-black relative overflow-hidden">
      {/* Enhanced gradient overlay */}
      <div className="absolute inset-0 gradient-mesh opacity-50 z-0 pointer-events-none"></div>
      {/* Enhanced background effects */}
      <div className="absolute inset-0 z-0">
        <div className="absolute bottom-0 left-0 right-0 h-1/2 z-0 ">
          <Galaxy
            mouseRepulsion={false}
            mouseInteraction={false}
            density={3}
            glowIntensity={0.5}
            saturation={0.1}
            hueShift={1}
          />
          {/* Gradient fade from opaque at top (hiding) to transparent at bottom (showing) */}
          <div className="absolute inset-0 bg-gradient-to-b from-black via-black/50 to-transparent pointer-events-none z-10 opacity-50" />
        </div>
      </div>
      <ClickSpark
  sparkColor='#fff'
  sparkSize={10}
  sparkRadius={15}
  sparkCount={8}
  duration={400}
>
      <motion.div 
        className="absolute top-0 right-0 w-[60vw] h-[60vw] bg-linear-to-br from-primary/8 via-primary/4 to-transparent blur-[100px] -translate-y-1/2 translate-x-1/2 pointer-events-none rounded-full"
        style={{ rotateX, scale }}
        animate={{
          scale: [1, 1.1, 1],
          opacity: [0.25, 0.4, 0.25],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      <motion.div 
        className="absolute bottom-0 left-0 w-[40vw] h-[40vw] bg-linear-to-tr from-primary/12 to-transparent rounded-full blur-[120px]"
        style={{ y }}
        animate={{
          x: [0, 20, 0],
          y: [0, -30, 0],
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      <div className="absolute inset-0 bg-linear-to-b from-transparent via-black/40 to-black pointer-events-none z-0" />
      
      {/* Subtle grid pattern overlay */}
      <div className="absolute inset-0 opacity-[0.02] pointer-events-none" 
        style={{
          backgroundImage: `linear-gradient(rgba(212, 175, 55, 0.1) 1px, transparent 1px),
                            linear-gradient(90deg, rgba(212, 175, 55, 0.1) 1px, transparent 1px)`,
          backgroundSize: '50px 50px'
        }}
      />

      {/* Mirrored hero video panel */}
      <div className="absolute inset-0 w-full left-0 right-0 top-0 flex items-start justify-center pointer-events-none z-2" suppressHydrationWarning>
        <div className="relative w-full">
          <div className="relative h-64 md:h-80 lg:h-[26rem] w-full">
            <div className="absolute inset-0 overflow-hidden opacity-80 w-full">
              <video
                autoPlay
                loop
                muted
                playsInline
                aria-hidden="true"
                className="w-full h-full object-cover scale-y-[-1] blur-sm"
                suppressHydrationWarning
              >
                <source src="/hero-video.mp4" type="video/mp4" />
                <source src="/hero-video.webm" type="video/webm" />
              </video>
              <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-black/70 to-black" />
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-5 md:px-6 lg:px-8 relative z-10 py-16 sm:py-20 md:py-24 lg:py-32">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-10 md:gap-12 lg:gap-20 items-center">
          {/* Left Column - Title */}
          <motion.div
            initial={{ opacity: 0, x: -100, rotateY: -20 }}
            whileInView={{ opacity: 1, x: 0, rotateY: 0 }}
            transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
            viewport={{ once: false, amount: 0.3 }}
            style={{ opacity }}
            className="relative"
          >
            {/* Decorative accent line */}
            <motion.div
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              transition={{ duration: 1, delay: 0.5, ease: "easeOut" }}
              viewport={{ once: false }}
              className="absolute -left-8 top-0 bottom-0 w-[2px] bg-linear-to-b from-primary via-primary/50 to-transparent origin-top"
            />
            
            <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-serif font-bold text-white leading-[1.1] mb-4 sm:mb-6 md:mb-8 lg:mb-10">
              {philosophy?.title ? (
                <motion.span
                  initial={{ opacity: 0, y: 60, filter: "blur(20px)" }}
                  whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
                  viewport={{ once: false }}
                  className="block relative"
                >
                  <span className="relative z-10">{philosophy.title}</span>
                </motion.span>
              ) : (
                <>
                  <motion.span
                    initial={{ opacity: 0, y: 60, filter: "blur(20px)" }}
                    whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                    transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
                    viewport={{ once: false }}
                    className="block relative"
                  >
                    <span className="relative z-10">Optimal</span>
                    <motion.span
                      className="absolute inset-0 bg-linear-to-r from-primary/20 via-primary/5 to-transparent blur-xl"
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      transition={{ duration: 1, delay: 0.5 }}
                      viewport={{ once: false }}
                    />
                  </motion.span>
                  <motion.span
                    initial={{ opacity: 0, y: 60, filter: "blur(20px)" }}
                    whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                    transition={{ duration: 0.8, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
                    viewport={{ once: false }}
                    className="block text-zinc-500 italic font-light"
                  >
                    Organization
                  </motion.span>
                  <motion.span
                    initial={{ opacity: 0, y: 60, filter: "blur(20px)" }}
                    whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                    transition={{ duration: 0.8, delay: 0.6, ease: [0.22, 1, 0.36, 1] }}
                    viewport={{ once: false }}
                    className="block relative"
                  >
                    <span className="relative z-10">Meets</span>
                    <motion.span
                      className="inline-block ml-3 gold-gradient-text"
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      transition={{ duration: 0.8, delay: 0.8 }}
                      viewport={{ once: false }}
                    >
                      Design.
                    </motion.span>
                  </motion.span>
                </>
              )}
            </h2>
          </motion.div>

          {/* Right Column - Content */}
          <motion.div
            initial={{ opacity: 0, x: 100 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1], delay: 0.3 }}
            viewport={{ once: false, amount: 0.3 }}
            className="space-y-6 sm:space-y-8 md:space-y-10 lg:space-y-12"
          >
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
              viewport={{ once: false }}
              className="relative"
            >
              {philosophy?.content ? (
                <motion.div
                  initial={{ opacity: 0, filter: "blur(10px)", y: 30 }}
                  whileInView={{ opacity: 1, filter: "blur(0px)", y: 0 }}
                  transition={{ duration: 1, delay: 0.5 }}
                  viewport={{ once: false }}
                  className="prose prose-invert max-w-none text-base sm:text-lg md:text-xl"
                  dangerouslySetInnerHTML={{ __html: philosophy.content }}
                />
              ) : (
                <>
                  <motion.p 
                    className="text-lg sm:text-xl md:text-2xl lg:text-3xl text-zinc-100 font-light leading-relaxed sm:leading-relaxed md:leading-loose"
                    initial={{ opacity: 0, filter: "blur(10px)", y: 30 }}
                    whileInView={{ opacity: 1, filter: "blur(0px)", y: 0 }}
                    transition={{ duration: 1, delay: 0.5 }}
                    viewport={{ once: false }}
                  >
                    We believe that true luxury lies in the seamless integration of form and function. Our philosophy is rooted in the understanding that{" "}
                    <span className="text-primary font-medium relative inline-block group">
                      <span className="relative z-10">every pixel serves a purpose</span>
                      <span className="absolute inset-0 bg-primary/10 blur-xl z-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                    </span>.
                  </motion.p>
                </>
              )}
            </motion.div>
            
            {!philosophy?.content && (
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.7, ease: [0.22, 1, 0.36, 1] }}
                viewport={{ once: false }}
              >
                <motion.p 
                  className="text-base sm:text-lg md:text-xl text-zinc-300 leading-relaxed sm:leading-relaxed md:leading-loose"
                  initial={{ opacity: 0, filter: "blur(10px)", y: 30 }}
                  whileInView={{ opacity: 1, filter: "blur(0px)", y: 0 }}
                  transition={{ duration: 1, delay: 0.8 }}
                  viewport={{ once: false }}
                >
                  In a world of noise, we create clarity. By stripping away the non-essential, we reveal the essence of your brand, allowing it to resonate with an authenticity that cannot be ignored.
                </motion.p>
              </motion.div>
            )}
            
            {/* Enhanced divider and labels */}
            <motion.div 
              className="pt-6 sm:pt-8 md:pt-10 lg:pt-12 relative"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 1, delay: 1 }}
              viewport={{ once: false }}
            >
              {/* Gradient divider */}
              <motion.div 
                className="h-px w-full mb-6 sm:mb-8 md:mb-10 lg:mb-12 relative overflow-hidden"
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                transition={{ duration: 1.2, delay: 1, ease: "easeOut" }}
                viewport={{ once: false }}
              >
                <div className="absolute inset-0 bg-linear-to-r from-transparent via-primary/60 to-transparent" />
                <div className="absolute inset-0 bg-zinc-700/30" />
              </motion.div>
              
              {/* Labels with enhanced styling */}
              <div className="flex flex-wrap justify-between gap-4 sm:gap-6 md:gap-8 text-xs sm:text-sm md:text-base uppercase tracking-[0.15em] sm:tracking-[0.2em]">
                {[
                  { label: "Strategy", delay: 1.2 },
                  { label: "Design", delay: 1.3 },
                  { label: "Technology", delay: 1.4 }
                ].map((item, index) => (
                  <motion.div
                    key={item.label}
                    initial={{ opacity: 0, y: 30, filter: "blur(10px)" }}
                    whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                    transition={{ duration: 0.6, delay: item.delay, ease: [0.22, 1, 0.36, 1] }}
                    viewport={{ once: false }}
                    className="relative group cursor-pointer"
                  >
                    <motion.span
                      className="relative text-primary/70 group-hover:text-primary transition-colors duration-300"
                      whileHover={{ 
                        scale: 1.05,
                        x: 5
                      }}
                      transition={{ type: "spring", stiffness: 400, damping: 17 }}
                    >
                      {item.label}
                      <motion.span
                        className="absolute -bottom-1 left-0 h-px bg-linear-to-r from-primary to-transparent"
                        initial={{ width: 0 }}
                        whileHover={{ width: "100%" }}
                        transition={{ duration: 0.3 }}
                      />
                    </motion.span>
                    {/* Glow effect on hover */}
                    <motion.div
                      className="absolute inset-0 bg-primary/10 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                      style={{ transform: "scale(1.5)" }}
                    />
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div></ClickSpark>
    </section>
  )
}
