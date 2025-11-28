"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { Facebook, Instagram, Linkedin, Twitter, Mail, ArrowRight } from 'lucide-react'
import { useState } from "react"

const socialLinks = [
  { icon: Instagram, href: "#", label: "Instagram" },
  { icon: Linkedin, href: "#", label: "LinkedIn" },
  { icon: Twitter, href: "#", label: "Twitter" },
  { icon: Facebook, href: "#", label: "Facebook" },
]

const servicesLinks = [
  "Strategic Consulting",
  "Social Media Management",
  "Paid Advertising",
  "Public Relations",
  "Content Creation",
]

const companyLinks = [
  "About Us",
  "Our Team",
  "Careers",
  "Case Studies",
  "Contact",
]

export function SiteFooter() {
  const [email, setEmail] = useState("")
  const [hoveredSocial, setHoveredSocial] = useState(null)

  const handleNewsletterSubmit = (e) => {
    e.preventDefault()
    // TODO: Add newsletter subscription logic
    console.log("Newsletter subscription:", email)
    setEmail("")
  }

  return (
    <footer className="relative w-full bg-black border-t border-white/10 pt-24 pb-12 overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-black pointer-events-none" />
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
      
      {/* Subtle grid pattern */}
      <div 
        className="absolute inset-0 opacity-[0.02] pointer-events-none" 
        style={{
          backgroundImage: `linear-gradient(rgba(212, 175, 55, 0.1) 1px, transparent 1px),
                            linear-gradient(90deg, rgba(212, 175, 55, 0.1) 1px, transparent 1px)`,
          backgroundSize: '50px 50px'
        }}
      />

      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-16 mb-20">
          {/* Brand Column */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <Link href="/" className="group inline-block">
              <motion.div
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.2 }}
              >
                <h2 className="text-4xl font-serif font-bold tracking-tighter text-white mb-2">
                  ELITE<span className="text-primary">.</span>
                </h2>
                <motion.div
                  className="h-[2px] bg-gradient-to-r from-primary to-transparent"
                  initial={{ width: 0 }}
                  whileInView={{ width: "100%" }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                  viewport={{ once: true }}
                />
              </motion.div>
            </Link>
            <p className="text-zinc-400 leading-relaxed text-sm max-w-xs">
              A premium digital marketing agency dedicated to elevating brands through strategy, creativity, and innovation.
            </p>
            <div className="flex gap-3 pt-2">
              {socialLinks.map((social, index) => {
                const IconComponent = social.icon
                return (
                  <motion.div
                    key={social.label}
                    initial={{ opacity: 0, scale: 0 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                    viewport={{ once: true }}
                    onHoverStart={() => setHoveredSocial(index)}
                    onHoverEnd={() => setHoveredSocial(null)}
                  >
                    <Link
                      href={social.href}
                      className="relative w-11 h-11 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-zinc-400 hover:text-black transition-all duration-300 group overflow-hidden"
                      aria-label={social.label}
                    >
                      {/* Hover background */}
                      <motion.div
                        className="absolute inset-0 bg-primary rounded-full"
                        initial={{ scale: 0 }}
                        animate={{ scale: hoveredSocial === index ? 1 : 0 }}
                        transition={{ duration: 0.3 }}
                      />
                      {/* Icon glow */}
                      <motion.div
                        className="absolute inset-0 bg-primary/30 blur-xl rounded-full opacity-0"
                        animate={{ opacity: hoveredSocial === index ? 1 : 0 }}
                        transition={{ duration: 0.3 }}
                      />
                      <IconComponent className="w-5 h-5 relative z-10" />
                    </Link>
                  </motion.div>
                )
              })}
            </div>
          </motion.div>

          {/* Services Column */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={{ once: true }}
          >
            <h4 className="text-white font-bold mb-8 uppercase tracking-[0.2em] text-sm relative">
              Services
              <motion.div
                className="absolute -bottom-2 left-0 h-[1px] bg-primary"
                initial={{ width: 0 }}
                whileInView={{ width: "40px" }}
                transition={{ duration: 0.6, delay: 0.3 }}
                viewport={{ once: true }}
              />
            </h4>
            <ul className="space-y-3.5">
              {servicesLinks.map((link, index) => (
                <motion.li
                  key={link}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: 0.1 + index * 0.05 }}
                  viewport={{ once: true }}
                >
                  <Link
                    href="#"
                    className="group flex items-center gap-2 text-zinc-400 hover:text-primary transition-colors duration-300 text-sm"
                  >
                    <motion.span
                      className="text-primary opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all duration-300"
                    >
                      →
                    </motion.span>
                    <span>{link}</span>
                  </Link>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* Company Column */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <h4 className="text-white font-bold mb-8 uppercase tracking-[0.2em] text-sm relative">
              Company
              <motion.div
                className="absolute -bottom-2 left-0 h-[1px] bg-primary"
                initial={{ width: 0 }}
                whileInView={{ width: "40px" }}
                transition={{ duration: 0.6, delay: 0.3 }}
                viewport={{ once: true }}
              />
            </h4>
            <ul className="space-y-3.5">
              {companyLinks.map((link, index) => (
                <motion.li
                  key={link}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: 0.1 + index * 0.05 }}
                  viewport={{ once: true }}
                >
                  <Link
                    href="#"
                    className="group flex items-center gap-2 text-zinc-400 hover:text-primary transition-colors duration-300 text-sm"
                  >
                    <motion.span
                      className="text-primary opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all duration-300"
                    >
                      →
                    </motion.span>
                    <span>{link}</span>
                  </Link>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* Newsletter Column */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            viewport={{ once: true }}
            className="lg:col-span-1"
          >
            <h4 className="text-white font-bold mb-8 uppercase tracking-[0.2em] text-sm relative">
              Newsletter
              <motion.div
                className="absolute -bottom-2 left-0 h-[1px] bg-primary"
                initial={{ width: 0 }}
                whileInView={{ width: "40px" }}
                transition={{ duration: 0.6, delay: 0.3 }}
                viewport={{ once: true }}
              />
            </h4>
            <p className="text-zinc-400 mb-6 text-sm leading-relaxed">
              Subscribe to our newsletter for the latest insights and trends.
            </p>
            <form onSubmit={handleNewsletterSubmit} className="space-y-3">
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 group-focus-within:text-primary transition-colors" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-12 py-3.5 text-white placeholder:text-zinc-500 focus:border-primary focus:bg-white/10 outline-none transition-all duration-300 text-sm"
                  required
                />
              </div>
              <motion.button
                type="submit"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full btn-enhanced bg-primary text-black px-4 py-3.5 font-semibold hover:bg-primary/90 shadow-lg shadow-primary/30 hover:shadow-primary/50 transition-all duration-300 relative overflow-hidden rounded-xl group"
              >
                <span className="relative z-10 flex items-center justify-center gap-2">
                  Subscribe
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </span>
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                  initial={{ x: "-100%" }}
                  whileHover={{ x: "100%" }}
                  transition={{ duration: 0.6 }}
                />
              </motion.button>
            </form>
          </motion.div>
        </div>

        {/* Bottom Bar */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
          className="border-t border-white/10 pt-8"
        >
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <p className="text-zinc-500 text-sm">
              © 2025 Elite Agency. All rights reserved.
            </p>
            <div className="flex gap-8">
              <Link
                href="#"
                className="text-zinc-500 text-sm hover:text-primary transition-colors duration-300 relative group"
              >
                Privacy Policy
                <motion.span
                  className="absolute -bottom-1 left-0 h-[1px] bg-primary"
                  initial={{ width: 0 }}
                  whileHover={{ width: "100%" }}
                  transition={{ duration: 0.3 }}
                />
              </Link>
              <Link
                href="#"
                className="text-zinc-500 text-sm hover:text-primary transition-colors duration-300 relative group"
              >
                Terms of Service
                <motion.span
                  className="absolute -bottom-1 left-0 h-[1px] bg-primary"
                  initial={{ width: 0 }}
                  whileHover={{ width: "100%" }}
                  transition={{ duration: 0.3 }}
                />
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </footer>
  )
}

