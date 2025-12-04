"use client"

import { motion } from "framer-motion"
import { useRef, useState, useEffect } from "react"
import InfiniteMenu from "./InfiniteMenu"

// Default fallback data
const defaultCases = [
  {
    title: "Lumina Fashion",
    category: "E-Commerce",
    image: "https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=2070&auto=format&fit=crop",
    year: "2024",
    description: "A modern e-commerce platform revolutionizing the fashion retail experience",
    link: "https://google.com/"
  },
]

export function CaseStudiesSection() {
  const containerRef = useRef(null)
  const [cases, setCases] = useState(defaultCases)

  // Fetch case studies from API
  useEffect(() => {
    const fetchCaseStudies = async () => {
      try {
        const response = await fetch('/api/case-studies')
        if (response.ok) {
          const data = await response.json()
          if (Array.isArray(data) && data.length > 0) {
            setCases(data)
          }
        }
      } catch (error) {
        console.error('Failed to fetch case studies:', error)
      }
    }
    
    fetchCaseStudies()
  }, [])

  // Transform cases to InfiniteMenu format
  const menuItems = cases.map(caseItem => ({
    image: caseItem.image,
    link: caseItem.link || "#",
    title: caseItem.title,
    description: caseItem.description || `${caseItem.category} / ${caseItem.year}`
  }))

  return (
    <section
      ref={containerRef}
      id="work"
      className="w-full h-screen bg-black overflow-hidden relative"
    >
      
      <div className="absolute top-0 left-0 w-full px-6 md:px-10 pt-10 md:pt-14 z-20">
        <motion.div
          initial={{ opacity: 0, y: 30, filter: "blur(10px)" }}
          whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
          viewport={{ once: false }}
          className="w-full"
        >
          <div className="flex items-center gap-4 mb-3">
            <motion.div 
              className="h-px bg-gradient-to-r from-primary/60 to-transparent w-12"
              initial={{ width: 0, opacity: 0 }}
              whileInView={{ width: 48, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: false }}
            />
            <span className="text-primary/60 text-xs uppercase tracking-[0.35em] font-light">Portfolio</span>
          </div>
          <h2 className="text-4xl md:text-6xl lg:text-7xl font-serif text-white relative inline-block font-light tracking-wide">
            Selected
            <span className="block text-primary/90">Works</span>
            <motion.div
              className="absolute -bottom-2 left-0 h-px bg-gradient-to-r from-primary/50 via-primary/20 to-transparent"
              initial={{ width: 0 }}
              whileInView={{ width: "120%" }}
              transition={{ duration: 1.2, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
              viewport={{ once: false }}
            />
          </h2>
        </motion.div>
      </div>

      <div className="absolute inset-0 w-full h-full z-10">
        <InfiniteMenu items={menuItems} />
      </div>
    </section>
  )
}
