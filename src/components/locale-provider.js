"use client"

import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import en from '@/locales/en.json'
import ar from '@/locales/ar.json'
import { defaultLocale, isLocaleSupported, locales } from '@/lib/i18n'

const LocaleContext = createContext({
  locale: defaultLocale,
  setLocale: () => {},
  t: (key) => key,
  direction: 'ltr',
})

const dictionaries = { en, ar }

export function LocaleProvider({ children, initialLocale = defaultLocale }) {
  // Use a consistent initial locale on both server and client to avoid hydration mismatches.
  const [locale, setLocaleState] = useState(initialLocale || defaultLocale)

  const direction = locale === 'ar' ? 'rtl' : 'ltr'

  const setLocale = (next) => {
    const safe = isLocaleSupported(next) ? next : defaultLocale
    setLocaleState(safe)
    if (typeof window !== 'undefined') {
      localStorage.setItem('locale', safe)
      // Persist for server-rendered pages (e.g., case studies detail)
      document.cookie = `locale=${safe};path=/;max-age=${60 * 60 * 24 * 30}`
    }
  }

  useEffect(() => {
    if (typeof window === 'undefined') return
    const stored = localStorage.getItem('locale')
    if (stored && isLocaleSupported(stored) && stored !== locale) {
      setLocaleState(stored)
    }
  }, [locale])

  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.documentElement.lang = locale
      document.documentElement.dir = direction
    }
  }, [locale, direction])

  const t = useMemo(() => {
    const dict = dictionaries[locale] || dictionaries[defaultLocale]
    return (key, fallback) => {
      const value = key.split('.').reduce((acc, part) => acc?.[part], dict)
      return value ?? fallback ?? key
    }
  }, [locale])

  const value = useMemo(
    () => ({ locale, setLocale, t, direction, locales }),
    [locale, t, direction]
  )

  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>
}

export function useLocale() {
  return useContext(LocaleContext)
}

