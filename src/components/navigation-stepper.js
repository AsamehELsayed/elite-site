"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"

const sections = [
  { id: "home", label: "Home" },
  { id: "philosophy", label: "Philosophy" },
  { id: "work", label: "Work" },
  { id: "testimonials", label: "Testimonials" },
  { id: "visuals", label: "Visuals" },
  { id: "contact", label: "Contact" },
]

export function NavigationStepper() {
  const [activeSection, setActiveSection] = useState("home")
  const [isHovered, setIsHovered] = useState(false)

  useEffect(() => {
    // Function to find which section is currently active
    const findActiveSection = () => {
      let activeId = null
      let maxVisibility = 0
      
      sections.forEach((section) => {
        const element = document.getElementById(section.id)
        if (!element) return
        
        const rect = element.getBoundingClientRect()
        const viewportHeight = window.innerHeight
        
        // Check if section is in viewport
        if (rect.bottom > 0 && rect.top < viewportHeight) {
          // Calculate visible portion of section in viewport
          const visibleTop = Math.max(0, -rect.top)
          const visibleBottom = Math.min(rect.height, viewportHeight - rect.top)
          const visibleHeight = Math.max(0, visibleBottom - visibleTop)
          const visibility = visibleHeight / Math.min(viewportHeight, rect.height)
          
          // For snap scrolling, prioritize sections that are well-centered
          const centerDistance = Math.abs((rect.top + rect.height / 2) - viewportHeight / 2)
          const centeredness = 1 - Math.min(centerDistance / viewportHeight, 1)
          
          // Combined score
          const score = visibility * (0.7 + centeredness * 0.3)
          
          if (score > maxVisibility) {
            maxVisibility = score
            activeId = section.id
          }
        }
      })
      
      return activeId
    }
    
    // Update active section
    const updateActiveSection = () => {
      const newActive = findActiveSection()
      if (newActive) {
        setActiveSection(prev => {
          if (prev !== newActive) {
            return newActive
          }
          return prev
        })
      }
    }
    
    // Initial check
    updateActiveSection()
    
    // Setup IntersectionObserver
    const observer = new IntersectionObserver(
      (entries) => {
        const visibleSections = entries
          .filter(entry => entry.isIntersecting)
          .map(entry => ({
            id: entry.target.id,
            ratio: entry.intersectionRatio,
            top: entry.boundingClientRect.top
          }))
          .filter(s => sections.some(sec => sec.id === s.id))
        
        if (visibleSections.length > 0) {
          // Find section with highest intersection ratio
          const best = visibleSections.reduce((prev, current) => {
            return current.ratio > prev.ratio ? current : prev
          })
          
          setActiveSection(prev => {
            if (prev !== best.id) {
              return best.id
            }
            return prev
          })
        }
      },
      {
        root: null,
        rootMargin: "0px",
        threshold: [0, 0.25, 0.5, 0.75, 1.0]
      }
    )
    
    // Observe all sections
    sections.forEach(({ id }) => {
      const element = document.getElementById(id)
      if (element) {
        observer.observe(element)
      }
    })
    
    // Get scroll container
    const scrollContainer = document.querySelector('main') || window
    
    // Scroll handler
    const handleScroll = () => {
      updateActiveSection()
    }
    
    // Add event listeners
    scrollContainer.addEventListener("scroll", handleScroll, { passive: true })
    
    // Scrollend handler for snap scrolling
    const handleScrollEnd = () => {
      setTimeout(updateActiveSection, 100)
    }
    
    if ('onscrollend' in window) {
      scrollContainer.addEventListener("scrollend", handleScrollEnd, { passive: true })
    }
    
    // Periodic check as fallback
    const interval = setInterval(updateActiveSection, 250)
    
    // Cleanup
    return () => {
      observer.disconnect()
      scrollContainer.removeEventListener("scroll", handleScroll)
      if ('onscrollend' in window) {
        scrollContainer.removeEventListener("scrollend", handleScrollEnd)
      }
      clearInterval(interval)
    }
  }, [])

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId)
    const mainEl = document.querySelector('main')
    
    if (element && mainEl) {
      const rect = element.getBoundingClientRect()
      const currentScroll = mainEl.scrollTop
      const elementTop = rect.top + currentScroll
      const viewportCenter = window.innerHeight / 2
      
      mainEl.scrollTo({
        top: elementTop - viewportCenter + (rect.height / 2),
        behavior: "smooth"
      })
    }
  }

  return (
    <motion.div
      className="fixed right-4 md:right-8 top-1/2 -translate-y-1/2 z-40 hidden md:block"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay: 1 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex flex-col items-center gap-4 relative">
        {/* Connecting line */}
        <motion.div
          className="absolute left-1/2 top-0 bottom-0 w-[2px] bg-zinc-800"
          initial={{ scaleY: 0 }}
          animate={{ scaleY: 1 }}
          transition={{ duration: 0.8, delay: 1.2 }}
          style={{ originY: 0 }}
        />
        
        {/* Active indicator line */}
        <motion.div
          className="absolute left-1/2 top-0 w-[2px] bg-primary origin-top"
          initial={{ scaleY: 0 }}
          animate={{
            scaleY: ((sections.findIndex((s) => s.id === activeSection) + 1) / sections.length),
          }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
        />

        {sections.map((section) => {
          const isActive = activeSection === section.id

          return (
            <motion.button
              key={section.id}
              onClick={() => scrollToSection(section.id)}
              className="relative z-10 group flex items-center gap-3"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              {/* Dot indicator */}
              <motion.div
                className={`relative w-3 h-3 rounded-full transition-all duration-300 ${
                  isActive ? "bg-primary" : "bg-zinc-600 hover:bg-zinc-500"
                }`}
                animate={{
                  scale: isActive ? [1, 1.3, 1] : 1,
                }}
                transition={{
                  duration: 2,
                  repeat: isActive ? Infinity : 0,
                  ease: "easeInOut",
                }}
              >
                {/* Glow effect for active */}
                {isActive && (
                  <motion.div
                    className="absolute inset-0 bg-primary rounded-full blur-md"
                    animate={{ opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                )}
              </motion.div>

              {/* Label */}
              <AnimatePresence>
                {isHovered && (
                  <motion.span
                    initial={{ opacity: 0, x: 10, width: 0 }}
                    animate={{ opacity: 1, x: 0, width: "auto" }}
                    exit={{ opacity: 0, x: 10, width: 0 }}
                    transition={{ duration: 0.2 }}
                    className={`text-xs uppercase tracking-wider whitespace-nowrap ${
                      isActive ? "text-primary font-semibold" : "text-zinc-400"
                    }`}
                  >
                    {section.label}
                  </motion.span>
                )}
              </AnimatePresence>

              {/* Active section indicator */}
              {isActive && (
                <motion.div
                  className="absolute -right-2 w-1 h-6 bg-primary rounded-full"
                  initial={{ scaleY: 0 }}
                  animate={{ scaleY: 1 }}
                  transition={{ duration: 0.3 }}
                  style={{ originY: 0.5 }}
                />
              )}
            </motion.button>
          )
        })}
      </div>
    </motion.div>
  )
}
