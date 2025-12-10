import { prisma } from '@/lib/prisma'
import { applyTranslations, defaultLocale, upsertTranslations } from '@/lib/i18n'

export const servicesService = {
  async get(locale = defaultLocale) {
    const record = await prisma.Services.findFirst()
    return applyTranslations(record, locale, ['sectionTitle', 'sectionSubtitle', 'services'])
  },

  async create(data, locale = defaultLocale) {
    const payload =
      locale === defaultLocale
        ? data
        : {
            translations: {
              [locale]: {
                sectionTitle: data.sectionTitle,
                sectionSubtitle: data.sectionSubtitle,
                services: data.services,
              },
            },
          }

    return await prisma.Services.create({ data: payload })
  },

  async update(id, data, locale = defaultLocale) {
    if (locale === defaultLocale) {
      return await prisma.Services.update({ where: { id }, data })
    }

    const existing = await prisma.Services.findUnique({ where: { id } })
    const translations = upsertTranslations(existing, locale, data, [
      'sectionTitle',
      'sectionSubtitle',
      'services',
    ])
    return await prisma.Services.update({ where: { id }, data: { translations } })
  },

  async upsert(data, locale = defaultLocale) {
    // Validate that we have at least some content
    if (!data || Object.keys(data).length === 0) {
      throw new Error('Services data cannot be empty')
    }

    const existing = await prisma.Services.findFirst()
    if (existing) {
      if (locale === defaultLocale) {
        return await prisma.Services.update({
          where: { id: existing.id },
          data,
        })
      }

      const translations = upsertTranslations(existing, locale, data, [
        'sectionTitle',
        'sectionSubtitle',
        'services',
      ])
      return await prisma.Services.update({
        where: { id: existing.id },
        data: { translations },
      })
    }
    return await this.create(data, locale)
  }
}
