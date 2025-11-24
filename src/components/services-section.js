"use client"

import { motion, useScroll, useTransform } from "framer-motion"
import { ArrowUpRight, Zap, Palette, Globe, FileText, TrendingUp } from 'lucide-react'
import { useState, useRef } from "react"

const services = [
  {
    id: "01",
    title: "Brand Identity",
    description: "Crafting visual systems that speak without words.",
    icon: Palette,
    color: "from-amber-500/20 to-yellow-500/10",
  },
  {
    id: "02",
    title: "Digital Experience",
    description: "Immersive web and mobile solutions for the modern age.",
    icon: Globe,
    color: "from-blue-500/20 to-cyan-500/10",
  },
  {
    id: "03",
    title: "Content Strategy",
    description: "Narratives that engage, convert, and retain.",
    icon: FileText,
    color: "from-purple-500/20 to-pink-500/10",
  },
  {
    id: "04",
    title: "Growth Marketing",
    description: "Data-driven campaigns for scalable success.",
    icon: TrendingUp,
    color: "from-green-500/20 to-emerald-500/10",
  },
]

export function ServicesSection() {
  const [hoveredIndex, setHoveredIndex] = useState(null)
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  })

  const opacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0.3, 1, 1, 0.3])
  const y = useTransform(scrollYProgress, [0, 1], [50, -50])
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.95, 1, 0.95])

  return (
    <section ref={ref} className="w-full h-screen flex items-center bg-black relative overflow-hidden">
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
        <motion.div
          initial={{ opacity: 0, y: 50, filter: "blur(10px)" }}
          whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
          viewport={{ once: false, amount: 0.3 }}
          className="mb-16 md:mb-20"
        >
          <motion.div 
            className="flex items-center gap-4 mb-4"
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
              <Zap className="w-4 h-4 text-primary" />
            </motion.div>
          </motion.div>
          <motion.span 
            className="text-primary text-sm uppercase tracking-[0.3em] block mb-2"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            viewport={{ once: false }}
          >
            Our Expertise
          </motion.span>
          <motion.h2 
            className="text-4xl md:text-6xl lg:text-7xl font-serif text-white"
            initial={{ opacity: 0, y: 30, filter: "blur(10px)" }}
            whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 1, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
            viewport={{ once: false }}
          >
            Comprehensive
            <motion.span 
              className="block gold-gradient-text"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 1, delay: 0.6 }}
              viewport={{ once: false }}
            >
              Solutions
            </motion.span>
          </motion.h2>
        </motion.div>

        <div className="grid grid-cols-1">
          {services.map((service, index) => {
            const IconComponent = service.icon
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -100, filter: "blur(10px)" }}
                whileInView={{ opacity: 1, x: 0, filter: "blur(0px)" }}
                transition={{ 
                  duration: 0.8, 
                  delay: index * 0.15,
                  ease: [0.22, 1, 0.36, 1]
                }}
                viewport={{ once: false, margin: "-100px" }}
                onHoverStart={() => setHoveredIndex(index)}
                onHoverEnd={() => setHoveredIndex(null)}
                className="group border-t border-zinc-800 py-10 md:py-14 hover:bg-zinc-900/40 transition-all duration-700 cursor-pointer relative overflow-hidden"
              >
                {/* Animated gradient background */}
                <motion.div 
                  className={`absolute inset-0 bg-gradient-to-r ${service.color} opacity-0 group-hover:opacity-100`}
                  initial={{ x: "-100%" }}
                  animate={{ x: hoveredIndex === index ? "0%" : "-100%" }}
                  transition={{ duration: 0.6, ease: "easeInOut" }}
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

                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 md:gap-8 relative z-10">
                  <div className="flex items-center gap-6 md:gap-10">
                    {/* Service Icon */}
                    <motion.div
                      className="relative"
                      animate={{
                        scale: hoveredIndex === index ? [1, 1.1, 1] : 1,
                        rotate: hoveredIndex === index ? [0, 5, -5, 0] : 0,
                      }}
                      transition={{ duration: 0.5 }}
                    >
                      <div className="w-12 h-12 md:w-16 md:h-16 rounded-full border border-zinc-700 flex items-center justify-center group-hover:border-primary/50 transition-all duration-500 bg-zinc-900/50 group-hover:bg-zinc-800/50">
                        <IconComponent className="w-5 h-5 md:w-6 md:h-6 text-zinc-500 group-hover:text-primary transition-colors duration-500" />
                      </div>
                      {/* Icon glow */}
                      <motion.div
                        className="absolute inset-0 bg-primary/20 blur-xl rounded-full opacity-0 group-hover:opacity-100"
                        transition={{ duration: 0.5 }}
                      />
                    </motion.div>

                    <div className="flex items-baseline gap-6 md:gap-8">
                      <motion.span 
                        className="text-zinc-600 font-mono text-sm md:text-base min-w-12"
                        animate={{ 
                          color: hoveredIndex === index ? "rgb(212, 175, 55)" : "rgb(82, 82, 91)",
                          scale: hoveredIndex === index ? 1.1 : 1
                        }}
                        transition={{ duration: 0.3 }}
                      >
                        {service.id}
                      </motion.span>
                      <motion.h3 
                        className="text-2xl md:text-4xl lg:text-5xl font-serif text-zinc-400 group-hover:text-white transition-colors duration-500"
                        animate={{ 
                          x: hoveredIndex === index ? 20 : 0,
                          scale: hoveredIndex === index ? 1.02 : 1
                        }}
                        transition={{ duration: 0.4, ease: "easeOut" }}
                      >
                        {service.title}
                      </motion.h3>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-6 md:gap-8 md:pr-8">
                    <motion.p 
                      className="text-zinc-500 text-sm md:text-base max-w-xs hidden md:block leading-relaxed"
                      initial={{ opacity: 0, x: -20, filter: "blur(5px)" }}
                      animate={{ 
                        opacity: hoveredIndex === index ? 1 : 0,
                        x: hoveredIndex === index ? 0 : -20,
                        filter: hoveredIndex === index ? "blur(0px)" : "blur(5px)"
                      }}
                      transition={{ duration: 0.4, ease: "easeOut" }}
                    >
                      {service.description}
                    </motion.p>
                    <motion.div 
                      className="w-12 h-12 md:w-14 md:h-14 rounded-full border border-zinc-700 flex items-center justify-center group-hover:bg-primary group-hover:border-primary transition-all duration-500 relative overflow-hidden"
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
                      <ArrowUpRight className="w-5 h-5 md:w-6 md:h-6 text-zinc-400 group-hover:text-black transition-colors duration-500 relative z-10" />
                    </motion.div>
                  </div>
                </div>

                {/* Bottom border accent on hover */}
                <motion.div
                  className="absolute bottom-0 left-0 h-px bg-gradient-to-r from-primary via-primary/50 to-transparent"
                  initial={{ width: 0 }}
                  animate={{ width: hoveredIndex === index ? "100%" : 0 }}
                  transition={{ duration: 0.6, ease: "easeOut" }}
                />
              </motion.div>
            )
          })}
          <motion.div 
            className="border-t border-zinc-800"
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            transition={{ duration: 1, delay: 0.8, ease: "easeOut" }}
            viewport={{ once: false }}
          />
        </div>
      </div>
    </section>
  )
}
