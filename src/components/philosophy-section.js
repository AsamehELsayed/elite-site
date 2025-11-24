"use client"

import { motion, useScroll, useTransform } from "framer-motion"
import { useRef } from "react"
import ClickSpark from "./ClickSpark"

export function PhilosophySection() {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  })
  
  const rotateX = useTransform(scrollYProgress, [0, 1], [15, -15])
  const opacity = useTransform(scrollYProgress, [0, 0.5, 1], [0.5, 1, 0.5])
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.95, 1, 0.95])
  const y = useTransform(scrollYProgress, [0, 1], [0, -50])

  return (
    <section ref={ref} className="w-full h-screen flex items-center justify-center bg-zinc-950 relative overflow-hidden">
      {/* Enhanced background effects */}
      <ClickSpark
  sparkColor='#fff'
  sparkSize={10}
  sparkRadius={15}
  sparkCount={8}
  duration={400}
>
      <motion.div 
        className="absolute top-0 right-0 w-[60vw] h-[60vw] bg-gradient-to-br from-primary/10 via-primary/5 to-transparent blur-[120px] -translate-y-1/2 translate-x-1/2 pointer-events-none rounded-full"
        style={{ rotateX, scale }}
        animate={{
          scale: [1, 1.1, 1],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      <motion.div 
        className="absolute bottom-0 left-0 w-[40vw] h-[40vw] bg-gradient-to-tr from-primary/15 to-transparent rounded-full blur-[140px]"
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
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-zinc-950/50 to-zinc-950 pointer-events-none" />
      
      {/* Subtle grid pattern overlay */}
      <div className="absolute inset-0 opacity-[0.02] pointer-events-none" 
        style={{
          backgroundImage: `linear-gradient(rgba(212, 175, 55, 0.1) 1px, transparent 1px),
                            linear-gradient(90deg, rgba(212, 175, 55, 0.1) 1px, transparent 1px)`,
          backgroundSize: '50px 50px'
        }}
      />

      <div className="container mx-auto px-4 md:px-6 lg:px-8 relative z-10 py-20 md:py-32">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
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
              className="absolute -left-8 top-0 bottom-0 w-[2px] bg-gradient-to-b from-primary via-primary/50 to-transparent origin-top"
            />
            
            <h2 className="text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-serif font-bold text-white leading-[1.1] mb-6 md:mb-10">
              <motion.span
                initial={{ opacity: 0, y: 60, filter: "blur(20px)" }}
                whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
                viewport={{ once: false }}
                className="block relative"
              >
                <span className="relative z-10">Optimal</span>
                <motion.span
                  className="absolute inset-0 bg-gradient-to-r from-primary/20 via-primary/5 to-transparent blur-xl"
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
            </h2>
          </motion.div>

          {/* Right Column - Content */}
          <motion.div
            initial={{ opacity: 0, x: 100 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1], delay: 0.3 }}
            viewport={{ once: false, amount: 0.3 }}
            className="space-y-10 md:space-y-12"
          >
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
              viewport={{ once: false }}
              className="relative"
            >
              <motion.p 
                className="text-xl md:text-2xl lg:text-3xl text-zinc-200 font-light leading-relaxed md:leading-loose"
                initial={{ opacity: 0, filter: "blur(10px)", y: 30 }}
                whileInView={{ opacity: 1, filter: "blur(0px)", y: 0 }}
                transition={{ duration: 1, delay: 0.5 }}
                viewport={{ once: false }}
              >
                We believe that true luxury lies in the seamless integration of form and function. Our philosophy is rooted in the understanding that{" "}
                <span className="text-primary/80 font-normal">every pixel serves a purpose</span>.
              </motion.p>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.7, ease: [0.22, 1, 0.36, 1] }}
              viewport={{ once: false }}
            >
              <motion.p 
                className="text-lg md:text-xl text-zinc-400 leading-relaxed md:leading-loose"
                initial={{ opacity: 0, filter: "blur(10px)", y: 30 }}
                whileInView={{ opacity: 1, filter: "blur(0px)", y: 0 }}
                transition={{ duration: 1, delay: 0.8 }}
                viewport={{ once: false }}
              >
                In a world of noise, we create clarity. By stripping away the non-essential, we reveal the essence of your brand, allowing it to resonate with an authenticity that cannot be ignored.
              </motion.p>
            </motion.div>
            
            {/* Enhanced divider and labels */}
            <motion.div 
              className="pt-8 md:pt-12 relative"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 1, delay: 1 }}
              viewport={{ once: false }}
            >
              {/* Gradient divider */}
              <motion.div 
                className="h-[1px] w-full mb-10 md:mb-12 relative overflow-hidden"
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                transition={{ duration: 1.2, delay: 1, ease: "easeOut" }}
                viewport={{ once: false }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
                <div className="absolute inset-0 bg-zinc-800/50" />
              </motion.div>
              
              {/* Labels with enhanced styling */}
              <div className="flex flex-wrap justify-between gap-6 md:gap-8 text-sm md:text-base uppercase tracking-[0.2em]">
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
                        className="absolute -bottom-1 left-0 h-[1px] bg-gradient-to-r from-primary to-transparent"
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
