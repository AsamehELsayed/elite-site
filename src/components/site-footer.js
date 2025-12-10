"use client"

import Link from "next/link"
import Image from "next/image"
import { motion } from "framer-motion"
import { Facebook, Instagram, Linkedin, Twitter, Mail, ArrowRight } from 'lucide-react'
import { useEffect, useState } from "react"
import { useLocale } from "@/components/locale-provider"
import { safeJsonParse } from "@/lib/utils"

// Blur placeholder data URL
const blurDataURL = 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=='

export function SiteFooter() {
  const { locale, t, direction } = useLocale()
  const isRTL = direction === 'rtl'
  const [footerData, setFooterData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [email, setEmail] = useState("")
  const [hoveredSocial, setHoveredSocial] = useState(null)
  const [submitting, setSubmitting] = useState(false)
  const [submitMessage, setSubmitMessage] = useState("")

  useEffect(() => {
    fetchFooterData()
  }, [locale])

  const fetchFooterData = async () => {
    try {
      const response = await fetch(`/api/footer?lang=${locale}`)
      const data = await response.json()
      if (data && !data.error) {
        setFooterData(data)
      }
    } catch (error) {
      console.error('Failed to fetch footer data:', error)
    } finally {
      setLoading(false)
    }
  }

  // Default data in case API fails
  const socialLinks = safeJsonParse(footerData?.socialLinks, [
    { icon: 'Instagram', href: "#", label: "Instagram" },
    { icon: 'Linkedin', href: "#", label: "LinkedIn" },
    { icon: 'Twitter', href: "#", label: "Twitter" },
    { icon: 'Facebook', href: "#", label: "Facebook" },
  ]).map(link => ({
    icon: link.icon === 'Instagram' ? Instagram :
          link.icon === 'Linkedin' ? Linkedin :
          link.icon === 'Twitter' ? Twitter :
          link.icon === 'Facebook' ? Facebook : Instagram,
    href: link.href || "#",
    label: link.label || link.icon
  }))

  const servicesLinks = safeJsonParse(footerData?.servicesLinks, [
    "Strategic Consulting",
    "Social Media Management",
    "Paid Advertising",
    "Public Relations",
    "Content Creation",
  ])

  const companyLinks = safeJsonParse(footerData?.companyLinks, [
    "About Us",
    "Our Team",
    "Careers",
    "Case Studies",
    "Contact",
    "Terms & Conditions",
    "Privacy Policy",
  ])

  const companyName = footerData?.companyName || 'ELITE.'
  const companyLogo = footerData?.companyLogo || '/logo.png'
  const companyDescription = footerData?.companyDescription || 'A premium digital marketing agency dedicated to elevating brands through strategy, creativity, and innovation.'
  const newsletterTitle = footerData?.newsletterTitle || 'Newsletter'
  const newsletterDescription = footerData?.newsletterDescription || 'Subscribe to our newsletter for the latest insights and trends.'
  const copyrightText = footerData?.copyrightText || '© 2025 Elite Agency. All rights reserved.'
  const privacyPolicyLink = footerData?.privacyPolicyLink || '/privacy'
  const termsOfServiceLink = footerData?.termsOfServiceLink || '/terms'

  const resolveCompanyHref = (link) => {
    const normalized = link.toLowerCase()
    if (normalized.includes('privacy')) return privacyPolicyLink
    if (normalized.includes('term')) return termsOfServiceLink
    return "#"
  }


  const handleNewsletterSubmit = async (e) => {
    e.preventDefault()
    if (!email.trim() || submitting) return

    setSubmitting(true)
    setSubmitMessage("")

    try {
      const response = await fetch('/api/newsletter', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: email.trim() }),
      })

      const data = await response.json()

      if (response.ok) {
        setSubmitMessage(t('footer.subscribeSuccess') || 'Successfully subscribed!')
        setEmail("")
        // Clear success message after 3 seconds
        setTimeout(() => setSubmitMessage(""), 3000)
      } else {
        setSubmitMessage(data.error || t('footer.subscribeError') || 'Failed to subscribe. Please try again.')
      }
    } catch (error) {
      console.error('Newsletter subscription error:', error)
      setSubmitMessage(t('footer.subscribeError') || 'Failed to subscribe. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <footer className="relative w-full bg-black border-t border-white/10 pt-16 sm:pt-20 md:pt-24 pb-8 sm:pb-10 md:pb-12 overflow-hidden">
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

      <div className="container mx-auto px-4 sm:px-5 md:px-6 relative z-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-10 md:gap-12 lg:gap-16 mb-12 sm:mb-16 md:mb-20">
          {/* Brand Column */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="space-y-4 sm:space-y-6 sm:col-span-2 lg:col-span-1"
          >
            <Link href="/" className="group inline-block">
              <motion.div
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.2 }}
              >
                {companyLogo ? (
                  <div className="relative h-16 sm:h-20 w-auto mb-2">
                    <Image
                      src={companyLogo}
                      alt={companyName}
                      width={160}
                      height={80}
                      sizes="(max-width: 640px) 160px, 200px"
                      className="h-16 sm:h-20 w-auto"
                      unoptimized={companyLogo.startsWith('http')}
                      loading="eager"
                      placeholder="blur"
                      blurDataURL={blurDataURL}
                      onError={(e) => {
                        e.target.style.display = 'none'
                      }}
                    />
                  </div>
                ) : (
                  <h2 className={`text-3xl sm:text-4xl font-serif font-bold tracking-tighter text-white mb-2 ${isRTL ? 'text-right' : 'text-left'}`}>
                    {companyName.replace('.', '')}<span className="text-primary">.</span>
                  </h2>
                )}
                <motion.div
                  className={`h-[2px] ${isRTL ? 'bg-gradient-to-l' : 'bg-gradient-to-r'} from-primary to-transparent`}
                  initial={{ width: 0 }}
                  whileInView={{ width: "100%" }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                  viewport={{ once: true }}
                />
              </motion.div>
            </Link>
            <div
              className="text-zinc-400 leading-relaxed text-xs sm:text-sm max-w-xs prose prose-invert prose-sm"
              dangerouslySetInnerHTML={{ __html: companyDescription }}
            />
            <div className="flex gap-2.5 sm:gap-3 pt-2">
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
                      className="relative w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-zinc-400 hover:text-black transition-all duration-300 group overflow-hidden"
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
                      <IconComponent className="w-4 h-4 sm:w-5 sm:h-5 relative z-10" />
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
            className="sm:col-span-1"
          >
            <h4 className="text-white font-bold mb-6 sm:mb-8 uppercase tracking-[0.2em] text-xs sm:text-sm relative">
              {t('footer.services')}
              <motion.div
                className="absolute -bottom-2 left-0 h-[1px] bg-primary"
                initial={{ width: 0 }}
                whileInView={{ width: "40px" }}
                transition={{ duration: 0.6, delay: 0.3 }}
                viewport={{ once: true }}
              />
            </h4>
            <ul className="space-y-2.5 sm:space-y-3.5">
              {servicesLinks.map((link, index) => (
                <motion.li
                  key={link}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: 0.1 + index * 0.05 }}
                  viewport={{ once: true }}
                >
                  <Link
                    href={resolveCompanyHref(link)}
                    className="group flex items-center gap-2 text-zinc-400 hover:text-primary transition-colors duration-300 text-xs sm:text-sm"
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
            className="sm:col-span-1"
          >
            <h4 className="text-white font-bold mb-6 sm:mb-8 uppercase tracking-[0.2em] text-xs sm:text-sm relative">
              {t('footer.company')}
              <motion.div
                className="absolute -bottom-2 left-0 h-[1px] bg-primary"
                initial={{ width: 0 }}
                whileInView={{ width: "40px" }}
                transition={{ duration: 0.6, delay: 0.3 }}
                viewport={{ once: true }}
              />
            </h4>
            <ul className="space-y-2.5 sm:space-y-3.5">
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
                    className="group flex items-center gap-2 text-zinc-400 hover:text-primary transition-colors duration-300 text-xs sm:text-sm"
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
            className="sm:col-span-2 lg:col-span-1"
          >
            <h4 className="text-white font-bold mb-6 sm:mb-8 uppercase tracking-[0.2em] text-xs sm:text-sm relative">
              {newsletterTitle || t('footer.newsletter')}
              <motion.div
                className="absolute -bottom-2 left-0 h-[1px] bg-primary"
                initial={{ width: 0 }}
                whileInView={{ width: "40px" }}
                transition={{ duration: 0.6, delay: 0.3 }}
                viewport={{ once: true }}
              />
            </h4>
            <div
              className="text-zinc-400 mb-4 sm:mb-6 text-xs sm:text-sm leading-relaxed prose prose-invert prose-sm"
              dangerouslySetInnerHTML={{ __html: newsletterDescription }}
            />
            <form onSubmit={handleNewsletterSubmit} className="space-y-2.5 sm:space-y-3">
              <div className="relative group">
                <Mail className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 w-3.5 h-3.5 sm:w-4 sm:h-4 text-zinc-500 group-focus-within:text-primary transition-colors" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value)
                    setSubmitMessage("")
                  }}
                  placeholder="your@email.com"
                  className="w-full bg-white/5 border border-white/10 rounded-lg sm:rounded-xl pl-10 sm:pl-12 pr-3 sm:pr-4 py-3 sm:py-3.5 text-white placeholder:text-zinc-500 focus:border-primary focus:bg-white/10 outline-none transition-all duration-300 text-xs sm:text-sm"
                  required
                  disabled={submitting}
                />
              </div>
              {submitMessage && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`text-xs sm:text-sm ${
                    submitMessage.includes('Success') || submitMessage.includes('success')
                      ? 'text-primary'
                      : 'text-red-400'
                  }`}
                >
                  {submitMessage}
                </motion.p>
              )}
              <motion.button
                type="submit"
                whileHover={{ scale: submitting ? 1 : 1.02 }}
                whileTap={{ scale: submitting ? 1 : 0.98 }}
                disabled={submitting}
                className="w-full btn-enhanced bg-primary text-black px-4 py-3 sm:py-3.5 text-sm sm:text-base font-semibold hover:bg-primary/90 shadow-lg shadow-primary/30 hover:shadow-primary/50 transition-all duration-300 relative overflow-hidden rounded-lg sm:rounded-xl group min-h-[44px] sm:min-h-[48px] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span className="relative z-10 flex items-center justify-center gap-2">
                  {submitting ? (t('footer.subscribing') || 'Subscribing...') : t('footer.subscribe')}
                  {!submitting && <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />}
                </span>
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                  initial={{ x: "-100%" }}
                  whileHover={{ x: submitting ? "-100%" : "100%" }}
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
          className="border-t border-white/10 pt-6 sm:pt-8"
        >
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 sm:gap-6">
            <p className="text-zinc-500 text-xs sm:text-sm text-center sm:text-left">
              {copyrightText}
            </p>
            <div className="flex gap-6 sm:gap-8">
              <Link
                href={privacyPolicyLink}
                className="text-zinc-500 text-xs sm:text-sm hover:text-primary transition-colors duration-300 relative group"
              >
                {t('footer.privacy')}
                <motion.span
                  className="absolute -bottom-1 left-0 h-[1px] bg-primary"
                  initial={{ width: 0 }}
                  whileHover={{ width: "100%" }}
                  transition={{ duration: 0.3 }}
                />
              </Link>
              <Link
                href={termsOfServiceLink}
                className="text-zinc-500 text-xs sm:text-sm hover:text-primary transition-colors duration-300 relative group"
              >
                {t('footer.terms')}
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

