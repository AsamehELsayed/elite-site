"use client"

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'

export function SEOHead({ 
  title, 
  description, 
  canonical, 
  openGraph,
  twitter,
  languageAlternates,
}) {
  const pathname = usePathname()
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://elite.com'

  useEffect(() => {
    // Ensure document and document.head exist
    if (typeof document === 'undefined' || !document.head) {
      return
    }

    // Update document title
    if (title) {
      document.title = title
    }

    // Update or create meta tags
    const updateMetaTag = (name, content, attribute = 'name') => {
      if (!document.head) return
      
      let element = document.querySelector(`meta[${attribute}="${name}"]`)
      if (!element) {
        element = document.createElement('meta')
        element.setAttribute(attribute, name)
        document.head.appendChild(element)
      }
      if (element && content) {
        element.setAttribute('content', content)
      }
    }

    // Update description
    if (description) {
      updateMetaTag('description', description)
    }

    // Update Open Graph tags
    if (openGraph) {
      if (openGraph.title) updateMetaTag('og:title', openGraph.title, 'property')
      if (openGraph.description) updateMetaTag('og:description', openGraph.description, 'property')
      if (openGraph.url) updateMetaTag('og:url', openGraph.url, 'property')
      if (openGraph.type) updateMetaTag('og:type', openGraph.type, 'property')
      if (openGraph.siteName) updateMetaTag('og:site_name', openGraph.siteName, 'property')
      if (openGraph.locale) updateMetaTag('og:locale', openGraph.locale, 'property')
      if (openGraph.images && openGraph.images.length > 0) {
        updateMetaTag('og:image', openGraph.images[0].url, 'property')
        if (openGraph.images[0].width) updateMetaTag('og:image:width', openGraph.images[0].width, 'property')
        if (openGraph.images[0].height) updateMetaTag('og:image:height', openGraph.images[0].height, 'property')
        if (openGraph.images[0].alt) updateMetaTag('og:image:alt', openGraph.images[0].alt, 'property')
      }
    }

    // Update Twitter tags
    if (twitter) {
      if (twitter.card) updateMetaTag('twitter:card', twitter.card)
      if (twitter.cardType) updateMetaTag('twitter:card', twitter.cardType)
      if (twitter.title) updateMetaTag('twitter:title', twitter.title)
      if (twitter.description) updateMetaTag('twitter:description', twitter.description)
      if (twitter.handle) updateMetaTag('twitter:site', twitter.handle)
      if (twitter.site) updateMetaTag('twitter:site', twitter.site)
      if (twitter.images && twitter.images.length > 0) {
        const imageUrl = typeof twitter.images[0] === 'string' ? twitter.images[0] : twitter.images[0].url
        updateMetaTag('twitter:image', imageUrl)
      }
    }

    // Update canonical link
    if (canonical && document.head) {
      let canonicalLink = document.querySelector('link[rel="canonical"]')
      if (!canonicalLink) {
        canonicalLink = document.createElement('link')
        canonicalLink.setAttribute('rel', 'canonical')
        document.head.appendChild(canonicalLink)
      }
      if (canonicalLink) {
        canonicalLink.setAttribute('href', canonical)
      }
    }

    // Update language alternates
    if (languageAlternates && languageAlternates.length > 0 && document.head) {
      // Remove existing alternate links safely
      const existingAlternates = document.querySelectorAll('link[rel="alternate"][hreflang]')
      existingAlternates.forEach(link => {
        if (link && link.parentNode) {
          try {
            link.parentNode.removeChild(link)
          } catch (e) {
            // Link might already be removed, ignore error
          }
        }
      })

      // Add new alternate links
      languageAlternates.forEach(({ hrefLang, href }) => {
        if (!hrefLang || !href) return
        
        // Check if link already exists
        const existingLink = document.querySelector(`link[rel="alternate"][hreflang="${hrefLang}"]`)
        if (existingLink && existingLink.parentNode) {
          existingLink.setAttribute('href', href)
        } else {
          const link = document.createElement('link')
          link.setAttribute('rel', 'alternate')
          link.setAttribute('hreflang', hrefLang)
          link.setAttribute('href', href)
          if (document.head) {
            document.head.appendChild(link)
          }
        }
      })
    }
  }, [title, description, canonical, openGraph, twitter, languageAlternates, pathname])

  return null
}

