"use client"

import { useEffect, useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { ShieldCheck, ScrollText } from 'lucide-react'
import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'
import { useLocale } from '@/components/locale-provider'
import { SEOHead } from '@/components/SEOHead'
import { getPageSEO } from '@/lib/seo'

const defaultLegal = {
  privacyTitle: 'Privacy Policy',
  privacyContent: `<p>We respect your privacy and handle your data with care. This page outlines what we collect, how we use it, and the rights you have regarding your information.</p>
  <p>By using our services, you agree to the collection and use of information in accordance with this policy.</p>`,
  termsTitle: 'Terms & Conditions',
  termsContent: `<p>Welcome to Elite. These Terms govern your use of our website and services. By accessing or using the site you agree to these Terms.</p>
  <p>If you do not agree with any part of the Terms, please discontinue use of the site.</p>`,
}

function formatDate(value) {
  if (!value) return null
  const date = new Date(value)
  if (isNaN(date.getTime())) return null
  return date.toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

export function LegalPage({ variant = 'privacy' }) {
  const { locale } = useLocale()
  const [legal, setLegal] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let active = true
    const fetchLegal = async () => {
      setLoading(true)
      try {
        const response = await fetch(`/api/legal?lang=${locale}`)
        const data = await response.json()
        if (active && data && !data.error) {
          setLegal(data)
        }
      } catch (error) {
        console.error('Failed to fetch legal content:', error)
      } finally {
        if (active) setLoading(false)
      }
    }

    fetchLegal()
    return () => {
      active = false
    }
  }, [locale])

  const isPrivacy = variant === 'privacy'
  const title = isPrivacy
    ? legal?.privacyTitle || defaultLegal.privacyTitle
    : legal?.termsTitle || defaultLegal.termsTitle
  const content = isPrivacy
    ? legal?.privacyContent || defaultLegal.privacyContent
    : legal?.termsContent || defaultLegal.termsContent
  const lastUpdated = useMemo(() => formatDate(legal?.updatedAt), [legal?.updatedAt])

  const pagePath = isPrivacy ? '/privacy' : '/terms'
  const seoConfig = getPageSEO({
    title: isPrivacy 
      ? (locale === 'ar' ? 'سياسة الخصوصية' : 'Privacy Policy')
      : (locale === 'ar' ? 'الشروط والأحكام' : 'Terms & Conditions'),
    description: isPrivacy
      ? (locale === 'ar' 
          ? 'كيف نجمع ونستخدم ونحمي بياناتك عبر ممتلكات إيليت.'
          : 'How we collect, use, and protect your data across Elite properties.')
      : (locale === 'ar'
          ? 'إرشادات لاستخدام موقع إيليت وخدماته والتجارب الرقمية.'
          : 'Guidelines for using Elite\'s website, services, and digital experiences.'),
    url: pagePath,
  }, locale)

  return (
    <>
      <SEOHead {...seoConfig} />
      <main className="bg-black text-white min-h-screen">
        <SiteHeader />

      <section className="relative overflow-hidden border-b border-white/5">
        {/* Background accents */}
        <motion.div
          className="absolute -left-10 top-10 h-40 w-40 sm:h-56 sm:w-56 rounded-full bg-primary/10 blur-3xl"
          animate={{ scale: [1, 1.1, 1], opacity: [0.6, 0.9, 0.6] }}
          transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute -right-16 bottom-10 h-52 w-52 sm:h-72 sm:w-72 rounded-full bg-primary/5 blur-[120px]"
          animate={{ scale: [1, 1.05, 1], opacity: [0.4, 0.7, 0.4] }}
          transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut' }}
        />

        <div className="container mx-auto px-4 md:px-6 py-16 sm:py-20 relative z-10">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs uppercase tracking-[0.2em] text-primary">
              {isPrivacy ? <ShieldCheck className="h-4 w-4" /> : <ScrollText className="h-4 w-4" />}
              {isPrivacy ? 'Privacy' : 'Terms'}
            </div>
            <h1 className="mt-6 text-3xl sm:text-4xl lg:text-5xl font-serif leading-tight">
              {title}
            </h1>
            <p className="mt-3 text-zinc-400 max-w-2xl">
              {isPrivacy
                ? 'How we collect, use, and protect your data across Elite properties.'
                : 'Guidelines for using Elite’s website, services, and digital experiences.'}
            </p>
            {lastUpdated ? (
              <p className="mt-4 text-sm text-zinc-500">
                Last updated: <span className="text-primary">{lastUpdated}</span>
              </p>
            ) : null}
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 md:px-6 py-12 sm:py-16">
        {loading ? (
          <div className="flex min-h-[200px] items-center justify-center text-zinc-400">
            Loading...
          </div>
        ) : (
          <div className="mx-auto max-w-4xl rounded-2xl border border-white/10 bg-white/[0.02] p-6 sm:p-8 backdrop-blur">
            <div
              className="prose prose-invert prose-sm sm:prose-base max-w-none leading-relaxed text-zinc-200"
              dangerouslySetInnerHTML={{ __html: content }}
            />
          </div>
        )}
      </section>

      <SiteFooter />
      </main>
    </>
  )
}

