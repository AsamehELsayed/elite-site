// Lightweight i18n utilities for locale-aware data and copy
export const locales = ['en', 'ar']
export const defaultLocale = 'en'

// Given a record with a translations JSON, merge the requested locale over base fields
export function applyTranslations(record, locale = defaultLocale, fields = []) {
  if (!record) return record
  const translationsObj = normalizeTranslations(record.translations)

  if (locale === defaultLocale) {
    const localeData = translationsObj?.[locale]
    const merged = { ...record, translations: translationsObj }

    // If a default-locale translation exists, prefer it over base fields
    if (localeData) {
      fields.forEach((field) => {
        if (localeData[field] !== undefined && localeData[field] !== null) {
          merged[field] = localeData[field]
        }
      })
    }

    return merged
  }

  const localeData = translationsObj?.[locale]
  if (!localeData) {
    return {
      ...record,
      translations: translationsObj,
    }
  }

  const merged = { ...record, translations: translationsObj }
  fields.forEach((field) => {
    if (localeData[field] !== undefined && localeData[field] !== null) {
      merged[field] = localeData[field]
    }
  })
  return merged
}

// Normalize translations to an object even if stored as a string
function normalizeTranslations(translations) {
  if (!translations) return {}
  if (typeof translations === 'string') {
    try {
      return JSON.parse(translations)
    } catch {
      return {}
    }
  }
  return translations
}

// Update translations JSON for a given locale with provided data (only whitelisted fields)
export function upsertTranslations(record, locale, data, fields = []) {
  const existing = record?.translations || {}
  const localeData = existing[locale] || {}

  const nextLocaleData = { ...localeData }
  fields.forEach((field) => {
    if (data[field] !== undefined) {
      nextLocaleData[field] = data[field]
    }
  })

  return {
    ...existing,
    [locale]: nextLocaleData,
  }
}

export function isLocaleSupported(locale) {
  return locales.includes(locale)
}

