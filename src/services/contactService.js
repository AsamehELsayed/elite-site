import { prisma } from '@/lib/prisma'
import { applyTranslations, defaultLocale, upsertTranslations } from '@/lib/i18n'

export const contactService = {
  async get(locale = defaultLocale) {
    const record = await prisma.Contact.findFirst()
    return applyTranslations(record, locale, [
      'sectionTitle',
      'sectionDescription',
      'briefingSteps',
      'sessionFocus',
      'bookingEmail',
      'bookingSlots',
    ])
  },

  async create(data, locale = defaultLocale) {
    const payload =
      locale === defaultLocale
        ? data
        : {
            translations: {
              [locale]: {
                sectionTitle: data.sectionTitle,
                sectionDescription: data.sectionDescription,
                briefingSteps: data.briefingSteps,
                sessionFocus: data.sessionFocus,
                bookingEmail: data.bookingEmail,
                bookingSlots: data.bookingSlots,
              },
            },
          }

    return await prisma.Contact.create({ data: payload })
  },

  async update(id, data, locale = defaultLocale) {
    if (locale === defaultLocale) {
      return await prisma.Contact.update({
        where: { id },
        data,
      })
    }

    const existing = await prisma.Contact.findUnique({ where: { id } })
    const translations = upsertTranslations(existing, locale, data, [
      'sectionTitle',
      'sectionDescription',
      'briefingSteps',
      'sessionFocus',
      'bookingEmail',
      'bookingSlots',
    ])

    return await prisma.Contact.update({
      where: { id },
      data: { translations },
    })
  },

  async upsert(data, locale = defaultLocale) {
    // Validate that we have at least some content
    if (!data || Object.keys(data).length === 0) {
      throw new Error('Contact data cannot be empty')
    }

    const existing = await prisma.Contact.findFirst()
    if (existing) {
      if (locale === defaultLocale) {
        return await prisma.Contact.update({
          where: { id: existing.id },
          data,
        })
      }

      const translations = upsertTranslations(existing, locale, data, [
        'sectionTitle',
        'sectionDescription',
        'briefingSteps',
        'sessionFocus',
        'bookingEmail',
        'bookingSlots',
      ])

      return await prisma.Contact.update({
        where: { id: existing.id },
        data: { translations },
      })
    }

    return await this.create(data, locale)
  }
}
