import { prisma } from '@/lib/prisma'
import { applyTranslations, defaultLocale, upsertTranslations } from '@/lib/i18n'

export const heroService = {
  async get(locale = defaultLocale) {
    const hero = await prisma.Hero.findFirst()
    if (!hero) return hero

    // Normalize translations in case they are stored as a string
    const translations =
      typeof hero.translations === 'string'
        ? safeParseJson(hero.translations)
        : hero.translations || {}

    if (locale === defaultLocale) {
      return { ...hero, translations }
    }

    const localeData = translations?.[locale]
    if (!localeData) {
      return { ...hero, translations }
    }

    return {
      ...hero,
      ...['title', 'subtitle', 'description', 'ctaText', 'ctaLink'].reduce((acc, field) => {
        if (localeData[field] !== undefined && localeData[field] !== null) {
          acc[field] = localeData[field]
        }
        return acc
      }, {}),
      translations,
    }
  },

  async create(data, locale = defaultLocale) {
    // If creating in non-default locale, store in translations and keep base empty
    const payload =
      locale === defaultLocale
        ? data
        : {
            translations: {
              [locale]: {
                title: data.title,
                subtitle: data.subtitle,
                description: data.description,
                ctaText: data.ctaText,
                ctaLink: data.ctaLink,
              },
            },
          }

function safeParseJson(value) {
  try {
    return JSON.parse(value)
  } catch {
    return {}
  }
}
    return await prisma.Hero.create({
      data: payload,
    })
  },

  async update(id, data, locale = defaultLocale) {
    if (locale === defaultLocale) {
      return await prisma.Hero.update({
        where: { id },
        data,
      })
    }

    const existing = await prisma.Hero.findUnique({ where: { id } })
    const translations = upsertTranslations(existing, locale, data, [
      'title',
      'subtitle',
      'description',
      'ctaText',
      'ctaLink',
    ])

    return await prisma.Hero.update({
      where: { id },
      data: { translations },
    })
  },

  async upsert(data, locale = defaultLocale) {
    // Validate that we have at least some content
    if (!data || Object.keys(data).length === 0) {
      throw new Error('Hero data cannot be empty')
    }

    const existing = await prisma.Hero.findFirst()
    if (existing) {
      if (locale === defaultLocale) {
        return await prisma.Hero.update({
          where: { id: existing.id },
          data,
        })
      }

      const translations = upsertTranslations(existing, locale, data, [
        'title',
        'subtitle',
        'description',
        'ctaText',
        'ctaLink',
      ])

      return await prisma.Hero.update({
        where: { id: existing.id },
        data: { translations },
      })
    }

    // Create new
    return await this.create(data, locale)
  }
}




