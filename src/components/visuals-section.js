"use client"

import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion"
import { useRef, useState, useEffect } from "react"
import GradualBlur from "./GradualBlur"
import LiquidEther from "./LiquidEther"

const visuals = [
  {
    id: 1,
    image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2000&auto=format&fit=crop",
    category: "Branding",
    title: "Luxury Identity",
  },
  {
    id: 2,
    image: "https://images.unsplash.com/photo-1557683316-973673baf926?q=80&w=2000&auto=format&fit=crop",
    category: "Digital",
    title: "Web Experience",
  },
  {
    id: 3,
    image: "https://images.unsplash.com/photo-1561070791-2526d30994b5?q=80&w=2000&auto=format&fit=crop",
    category: "Photography",
    title: "Editorial Series",
  },
  {
    id: 4,
    image: "https://images.unsplash.com/photo-1558655146-364adaf1fcc9?q=80&w=2000&auto=format&fit=crop",
    category: "Motion",
    title: "Cinematic Reel",
  },
  {
    id: 5,
    image: "https://images.unsplash.com/photo-1614680376573-df3480f0c6ff?q=80&w=2000&auto=format&fit=crop",
    category: "Branding",
    title: "Visual Language",
  },
  {
    id: 6,
    image: "https://images.unsplash.com/photo-1557682250-33bd709cbe85?q=80&w=2000&auto=format&fit=crop",
    category: "Digital",
    title: "Interface Design",
  },
  {
    id: 7,
    image: "https://images.unsplash.com/photo-1558655146-d09347e92766?q=80&w=2000&auto=format&fit=crop",
    category: "Photography",
    title: "Portrait Collection",
  },
  {
    id: 8,
    image: "https://images.unsplash.com/photo-1618005198919-d3d4b5a92ead?q=80&w=2000&auto=format&fit=crop",
    category: "Motion",
    title: "Brand Film",
  },
  {
    id: 9,
    image: "https://images.unsplash.com/photo-1557683311-eac922347aa1?q=80&w=2000&auto=format&fit=crop",
    category: "Branding",
    title: "Identity System",
  },
  {
    id: 10,
    image: "https://images.unsplash.com/photo-1614680376593-902f74cf0d41?q=80&w=2000&auto=format&fit=crop",
    category: "Digital",
    title: "Interactive Showcase",
  },
  {
    id: 11,
    image: "https://images.unsplash.com/photo-1557682257-2f9c37dcd1bc?q=80&w=2000&auto=format&fit=crop",
    category: "Photography",
    title: "Fashion Editorial",
  },
  {
    id: 12,
    image: "https://images.unsplash.com/photo-1618005198865-5bcebb5cbd35?q=80&w=2000&auto=format&fit=crop",
    category: "Motion",
    title: "Animation Series",
  },
]

const categories = ["All", "Branding", "Digital", "Photography", "Motion"]

export function VisualsSection() {
  const containerRef = useRef(null)
  const scrollContainerRef = useRef(null)
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [selectedImage, setSelectedImage] = useState(null)
  const [hoveredIndex, setHoveredIndex] = useState(null)

  const { scrollYProgress } = useScroll({
    target: scrollContainerRef,
    offset: ["start start", "end end"]
  })

  const headerOpacity = useTransform(scrollYProgress, [0, 0.1], [1, 0.8])
  const headerY = useTransform(scrollYProgress, [0, 0.2], [0, -20])

  const filteredVisuals = selectedCategory === "All" 
    ? visuals 
    : visuals.filter(v => v.category === selectedCategory)

  useEffect(() => {
    if (selectedImage !== null) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [selectedImage])

  return (
    <section 
      ref={containerRef} 
      id="visuals" 
      className="relative w-full min-h-screen bg-black overflow-hidden"
    >
      {/* Background Effects */}
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

      {/* Glowing Effects Layer */}
      <div className="pointer-events-none absolute inset-0 z-[1] overflow-hidden">
        {/* Animated Glowing Orbs */}
        <motion.div
          className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-primary/20 blur-[120px]"
          animate={{
            x: [0, 100, -50, 0],
            y: [0, -80, 60, 0],
            scale: [1, 1.2, 0.9, 1],
            opacity: [0.3, 0.5, 0.4, 0.3],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute top-1/2 right-1/4 w-[500px] h-[500px] rounded-full bg-primary/15 blur-[140px]"
          animate={{
            x: [0, -120, 80, 0],
            y: [0, 100, -70, 0],
            scale: [1, 0.8, 1.3, 1],
            opacity: [0.25, 0.45, 0.35, 0.25],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute bottom-1/4 left-1/3 w-80 h-80 rounded-full bg-primary/25 blur-[100px]"
          animate={{
            x: [0, 70, -90, 0],
            y: [0, -100, 50, 0],
            scale: [1, 1.1, 0.95, 1],
            opacity: [0.2, 0.4, 0.3, 0.2],
          }}
          transition={{
            duration: 18,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute top-3/4 right-1/3 w-[400px] h-[400px] rounded-full bg-primary/18 blur-[130px]"
          animate={{
            x: [0, -60, 110, 0],
            y: [0, 80, -90, 0],
            scale: [1, 0.85, 1.15, 1],
            opacity: [0.22, 0.42, 0.32, 0.22],
          }}
          transition={{
            duration: 22,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        {/* Radial Gradient Glows */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(212,175,55,0.15),transparent_60%)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_70%,rgba(255,215,0,0.12),transparent_65%)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_20%,rgba(212,175,55,0.1),transparent_55%)]"></div>
        
        {/* Animated Gradient Mesh */}
        <motion.div
          className="absolute inset-0 opacity-30"
          style={{
            background: `
              radial-gradient(at 20% 30%, rgba(212, 175, 55, 0.2) 0px, transparent 50%),
              radial-gradient(at 80% 70%, rgba(255, 215, 0, 0.15) 0px, transparent 50%),
              radial-gradient(at 50% 50%, rgba(212, 175, 55, 0.1) 0px, transparent 50%),
              radial-gradient(at 10% 80%, rgba(255, 215, 0, 0.12) 0px, transparent 50%)
            `,
          }}
          animate={{
            opacity: [0.25, 0.35, 0.28, 0.25],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        {/* Pulsing Center Glow */}
        <motion.div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-primary/10 blur-[150px]"
          animate={{
            scale: [1, 1.3, 0.9, 1],
            opacity: [0.15, 0.25, 0.18, 0.15],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        {/* Subtle Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/15 via-transparent to-black/50"></div>
      </div>
 
      {/* Fixed Header */}
      <motion.div 
        className="absolute top-0 left-0 w-full px-6 md:px-12 pt-8 md:pt-12 z-30 pointer-events-none"
        style={{ opacity: headerOpacity, y: headerY }}
      >
        <div className="w-full">
          <motion.h2
            className="text-4xl md:text-6xl lg:text-7xl font-serif text-white mb-6 relative inline-block pt-10"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            viewport={{ once: false }}
          >
            Visual Gallery
            <motion.div
              className="absolute bottom-0 left-0 h-[2px] bg-primary"
              initial={{ width: 0 }}
              whileInView={{ width: "100%" }}
              transition={{ duration: 1, delay: 0.3 }}
              viewport={{ once: false }}
            ></motion.div>
          </motion.h2>
          
          {/* Category Filter */}
          <motion.div
            className="flex flex-wrap gap-3 mt-6 pointer-events-auto"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            viewport={{ once: false }}
          >
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                  selectedCategory === category
                    ? "bg-primary text-black shadow-lg shadow-primary/30"
                    : "bg-white/10 text-white/70 hover:bg-white/15 hover:text-white border border-white/20"
                }`}
              >
                {category}
              </button>
            ))}
          </motion.div>
        </div>
      </motion.div>

      {/* Scrollable Content Container */}
      <div 
        ref={scrollContainerRef}
        className="absolute inset-0 pt-48 md:pt-56 pb-20 overflow-y-auto overflow-x-hidden no-scrollbar z-10"
        style={{ 
          scrollBehavior: 'smooth',
        }}
      >
        <div className="container mx-auto px-4 md:px-6 lg:px-8">
          {/* Masonry-style Grid */}
          <div className="columns-1 md:columns-2 lg:columns-3 xl:columns-4 gap-4 md:gap-6 space-y-4 md:space-y-6">
            <AnimatePresence mode="popLayout">
              {filteredVisuals.map((visual, index) => (
                <motion.div
                  key={visual.id}
                  layout
                  initial={{ opacity: 0, scale: 0.8, y: 50 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.8, y: -50 }}
                  transition={{ 
                    duration: 0.5, 
                    delay: index * 0.03,
                    ease: [0.16, 1, 0.3, 1]
                  }}
                  className="group relative break-inside-avoid mb-4 md:mb-6 cursor-pointer"
                  onMouseEnter={() => setHoveredIndex(visual.id)}
                  onMouseLeave={() => setHoveredIndex(null)}
                  onClick={() => setSelectedImage(visual)}
                  data-cursor="interactive"
                >
                  {/* Image Container */}
                  <div className="relative overflow-hidden rounded-lg bg-black/20 backdrop-blur-sm border border-white/10 group-hover:border-primary/40 transition-all duration-500">
                    <motion.div
                      className="relative aspect-[4/5] overflow-hidden"
                      whileHover={{ scale: 1.05 }}
                      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                    >
                      {/* Image */}
                      <motion.img
                        src={visual.image}
                        alt={visual.title}
                        className="w-full h-full object-cover"
                        initial={{ scale: 1.1 }}
                        animate={{ 
                          scale: hoveredIndex === visual.id ? 1.15 : 1.1,
                          filter: hoveredIndex === visual.id ? "brightness(1.1)" : "brightness(0.9)"
                        }}
                        transition={{ duration: 0.6 }}
                      />
                      
                      {/* Gradient Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/0 to-black/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                      
                      {/* Content Overlay */}
                      <motion.div
                        className="absolute inset-0 flex flex-col justify-end p-6 text-white"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ 
                          opacity: hoveredIndex === visual.id ? 1 : 0,
                          y: hoveredIndex === visual.id ? 0 : 20
                        }}
                        transition={{ duration: 0.4 }}
                      >
                        <span className="text-xs uppercase tracking-wider text-primary/80 mb-2">
                          {visual.category}
                        </span>
                        <h3 className="text-xl font-serif">{visual.title}</h3>
                      </motion.div>

                      {/* Shine Effect */}
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                        initial={{ x: "-100%" }}
                        animate={{ 
                          x: hoveredIndex === visual.id ? "100%" : "-100%"
                        }}
                        transition={{ 
                          duration: 0.8,
                          ease: "easeInOut"
                        }}
                      />
                    </motion.div>

                    {/* Border Glow */}
                    <motion.div
                      className="absolute inset-0 rounded-lg pointer-events-none"
                      initial={{ opacity: 0 }}
                      animate={{ 
                        opacity: hoveredIndex === visual.id ? 1 : 0,
                        boxShadow: hoveredIndex === visual.id 
                          ? "0 0 30px rgba(212, 175, 55, 0.4), inset 0 0 30px rgba(212, 175, 55, 0.1)"
                          : "none"
                      }}
                      transition={{ duration: 0.4 }}
                    />
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Empty State */}
          {filteredVisuals.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-20"
            >
              <p className="text-white/50 text-lg">No visuals found in this category.</p>
            </motion.div>
          )}
        </div>
      </div>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/95 backdrop-blur-md"
            onClick={() => setSelectedImage(null)}
          >
            {/* Close Button */}
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-6 right-6 z-10 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 flex items-center justify-center text-white transition-all duration-300 hover:scale-110"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Image Container */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="relative max-w-7xl max-h-[90vh] w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={selectedImage.image}
                alt={selectedImage.title}
                className="w-full h-full object-contain rounded-lg"
              />
              
              {/* Image Info */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/90 to-transparent rounded-b-lg"
              >
                <span className="text-sm uppercase tracking-wider text-primary/80">
                  {selectedImage.category}
                </span>
                <h3 className="text-2xl font-serif text-white mt-2">{selectedImage.title}</h3>
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bottom Blur Effect */}
      <GradualBlur
        position="bottom"
        height="8rem"
        strength={3}
        divCount={8}
        opacity={1}
        curve="ease-out"
        className="z-20"
      />
    </section>
  )
}
