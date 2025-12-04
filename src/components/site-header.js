"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { AnimatePresence, motion, useScroll, useMotionValueEvent } from "framer-motion"
import { Menu, X } from 'lucide-react'
import { Button } from "@/components/ui/button"

export function SiteHeader() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const { scrollY } = useScroll()
  const [hidden, setHidden] = useState(false)
  const [heroHeight, setHeroHeight] = useState(0)

  useEffect(() => {
    // Get the height of the hero section (first section)
    const heroSection = document.querySelector('#home') || document.querySelector('.snap-section:first-child')
    if (heroSection) {
      setHeroHeight(heroSection.offsetHeight)
    } else {
      // Fallback to viewport height if hero section not found
      setHeroHeight(window.innerHeight)
    }
  }, [])

  useMotionValueEvent(scrollY, "change", (latest) => {
    const previous = scrollY.getPrevious() ?? 0
    if (latest > previous && latest > 150) {
      setHidden(true)
    } else {
      setHidden(false)
    }
    // Only show background when scrolled past the hero section
    setIsScrolled(latest > heroHeight)
  })

  const navLinks = [
    { name: "Home", href: "#home" },
    { name: "Services", href: "#services" },
    { name: "Portfolio", href: "#work" },
    { name: "Contact Us", href: "#contact" },
  ]

  const serviceLinks = [
    "Web Development",
    "Mobile App",
    "Branding",
    "Social Media Management",
    "Google Adword",
    "Media Production"
  ]

  const galleryImages = [
    { src: "https://images.unsplash.com/photo-1529333166437-7750a6dd5a70?auto=format&fit=crop&w=800&q=80", caption: "Creative Studio" },
    { src: "https://images.unsplash.com/photo-1489515217757-5fd1be406fef?auto=format&fit=crop&w=800&q=80", caption: "Digital Lab" },
    { src: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=800&q=80", caption: "Brand Session" },
    { src: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80", caption: "Campaign Hub" },
  ]

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.classList.add("overflow-hidden")
    } else {
      document.body.classList.remove("overflow-hidden")
    }

    return () => document.body.classList.remove("overflow-hidden")
  }, [isMobileMenuOpen])

  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === "Escape") {
        setIsMobileMenuOpen(false)
      }
    }

    window.addEventListener("keydown", handleEscape)
    return () => window.removeEventListener("keydown", handleEscape)
  }, [])

  return (
    <motion.header
      data-cursor="interactive"
      variants={{
        visible: { y: 0 },
        hidden: { y: "-100%" },
      }}
      animate={hidden ? "hidden" : "visible"}
      transition={{ duration: 0.35, ease: "easeInOut" }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled ? "bg-[oklch(0.30_0_0)]/90 backdrop-blur-md border-b border-white/15 shadow-lg shadow-primary/10" : "bg-transparent"
      }`}
    >
      <div className="container mx-auto px-4 md:px-6 h-20 flex items-center justify-between">
        <Link
          href="/"
          data-cursor="interactive"
          className="text-2xl font-serif font-bold text-white tracking-tighter relative group"
        >
          <motion.span
            className="relative z-10"
            whileHover={{ scale: 1.1 }}
            transition={{ type: "spring", stiffness: 400 }}
          >
            ELITE<span className="text-primary">.</span>
          </motion.span>
          <motion.span
            className="absolute inset-0 blur-md text-primary opacity-0 group-hover:opacity-50 transition-opacity"
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            ELITE.
          </motion.span>
        </Link>

        {/* Menu Toggle */}
        <div className="flex items-center gap-4 ml-auto">
          <motion.div whileTap={{ scale: 0.9 }}>
            <Button 
              variant="ghost" 
              size="icon"
              className="text-white hover:text-primary transition-colors"
              data-cursor="interactive"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              <motion.div
                animate={{ rotate: isMobileMenuOpen ? 90 : 0 }}
                transition={{ duration: 0.3 }}
              >
                {isMobileMenuOpen ? <X /> : <Menu />}
              </motion.div>
            </Button>
          </motion.div>
        </div>
      </div>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            className="fixed inset-0 z-50 bg-[oklch(0.20_0_0)] text-white overflow-hidden"
            initial={{ x: "100%", opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: "100%", opacity: 0 }}
            transition={{ duration: 0.45, ease: [0.6, 0.05, 0.01, 0.9] }}
          >
            <motion.button
              type="button"
              data-cursor="interactive"
              className="absolute top-6 right-6 z-60 w-14 h-14 rounded-full border border-white/30 text-white/80 hover:text-primary hover:border-primary/70 transition-colors flex items-center justify-center bg-[oklch(0.25_0_0)]/40 backdrop-blur"
              onClick={() => setIsMobileMenuOpen(false)}
              initial={{ opacity: 0, rotate: -90, scale: 0.8 }}
              animate={{ opacity: 1, rotate: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ delay: 0.15 }}
              aria-label="Close navigation"
            >
              <X className="w-8 h-8" />
            </motion.button>

            <div className="absolute inset-0 hidden md:flex pointer-events-none">
              {[0, 1, 2].map((panel) => (
                <motion.div
                  key={panel}
                  className="flex-1 border-r border-white/5 bg-white/2"
                  initial={{ y: "100%" }}
                  animate={{ y: 0 }}
                  exit={{ y: "-100%" }}
                  transition={{ duration: 0.5, delay: 0.1 * panel, ease: [0.65, 0, 0.35, 1] }}
                />
              ))}
            </div>
            <div className="absolute top-0 right-0 hidden md:block h-full w-2 bg-primary"></div>
            <motion.div
              className="flex flex-col h-full md:grid md:grid-cols-[1fr_1.4fr_1fr]"
              initial="hidden"
              animate="visible"
              exit="hidden"
            >
              <motion.section
                className="w-full px-6 md:px-10 py-14 border-b md:border-b-0 md:border-r border-white/10 flex flex-col gap-10 bg-[oklch(0.22_0_0)]/40"
                variants={{
                  hidden: { y: 30, opacity: 0 },
                  visible: { y: 0, opacity: 1, transition: { duration: 0.5, delay: 0.2, ease: [0.45, 0, 0.55, 1] } },
                }}
              >
                <div>
                  <p className="text-sm uppercase tracking-[0.3em] text-white/60">Our Services</p>
                  <div className="mt-8 flex flex-col gap-4">
                    {serviceLinks.map((service, idx) => (
                      <motion.span
                        key={service}
                        className="text-lg text-white/80 hover:text-primary transition-colors"
                        data-cursor="interactive"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.25 + idx * 0.05 }}
                      >
                        {service}
                      </motion.span>
                    ))}
                  </div>
                </div>
                <div className="mt-auto flex flex-col gap-3 text-sm text-white/60">
                  <p className="text-white tracking-[0.25em] uppercase text-xs">Contact</p>
                  <p className="font-semibold text-white text-lg">+201009957000</p>
                  <p>info@be-group.com</p>
                  <div className="flex gap-5 text-base text-white">
                    {["Fb", "In", "Tw"].map((item) => (
                      <span
                        key={item}
                        className="hover:text-primary transition-colors"
                        data-cursor="interactive"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.section>

              <motion.section
                className="relative w-full border-b md:border-b-0 md:border-r border-white/10 px-6 md:px-12 py-10 flex flex-col gap-10"
                variants={{
                  hidden: { scale: 0.95, opacity: 0 },
                  visible: { scale: 1, opacity: 1, transition: { duration: 0.55, delay: 0.35, ease: [0.45, 0, 0.55, 1] } },
                }}
              >
                <div className="flex-1 grid grid-cols-2 gap-4">
                  {galleryImages.map((image, idx) => (
                    <motion.div
                      key={image.caption + idx}
                      className="relative rounded-3xl overflow-hidden border border-white/10 shadow-lg"
                      initial={{ opacity: 0, y: 40 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.45 + idx * 0.05, duration: 0.4 }}
                    >
                      <div
                        className="h-36 md:h-40 w-full bg-cover bg-center"
                        style={{ backgroundImage: `url('${image.src}')` }}
                      >
                        <div className="w-full h-full bg-linear-to-t from-black/60 via-black/10 to-transparent"></div>
                      </div>
                      <div className="absolute bottom-4 left-4 text-xs uppercase tracking-[0.3em] text-white/70">
                        {image.caption}
                      </div>
                      <span className="absolute top-4 right-4 text-white/40 text-xs">0{idx + 1}</span>
                    </motion.div>
                  ))}
                </div>
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8 text-sm text-white/70">
                  <div>
                    <p className="uppercase tracking-[0.4em] text-white/40 text-xs">Call us</p>
                    <p className="text-xl text-white mt-2">+201009957000</p>
                  </div>
                  <div>
                    <p className="uppercase tracking-[0.4em] text-white/40 text-xs">Email</p>
                    <p className="text-xl text-white mt-2">info@be-group.com</p>
                  </div>
                  <div className="flex gap-4 text-lg text-white">
                    {["Fb", "In", "Tw"].map((item) => (
                      <span key={item} className="hover:text-primary transition-colors" data-cursor="interactive">
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.section>

              <motion.section
                className="relative w-full px-6 md:px-10 py-14 flex flex-col justify-center gap-10"
                variants={{
                  hidden: { y: 30, opacity: 0 },
                  visible: { y: 0, opacity: 1, transition: { duration: 0.5, delay: 0.45, ease: [0.45, 0, 0.55, 1] } },
                }}
              >
                <div className="space-y-6">
                  <div className="text-xs uppercase tracking-[0.8em] text-white/40">Since</div>
                  <div className="w-10 h-10 border border-white/20 rounded-full flex items-center justify-center text-primary">
                    <span className="text-xs tracking-[0.4em]">20</span>
                  </div>
                </div>
                <div className="space-y-6">
                  {navLinks.map((link, idx) => (
                    <motion.div
                      key={link.name}
                      initial={{ opacity: 0, x: 40 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.5 + idx * 0.07 }}
                    >
                      <Link
                        href={link.href}
                        className="text-4xl md:text-5xl font-semibold uppercase tracking-tight hover:text-primary transition-colors block"
                        data-cursor="interactive"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        {link.name}
                      </Link>
                    </motion.div>
                  ))}
                </div>
                <span className="hidden md:block absolute right-10 bottom-12 rotate-90 text-xs tracking-[0.6em] text-white/40 uppercase">
                  Market Reference
                </span>
              </motion.section>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  )
}
