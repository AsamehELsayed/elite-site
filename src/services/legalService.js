"use server"

import { prisma } from '@/lib/prisma'
import { applyTranslations, defaultLocale, upsertTranslations } from '@/lib/i18n'

const LEGAL_FIELDS = ['privacyTitle', 'privacyContent', 'termsTitle', 'termsContent']

export const legalService = {
  async get(locale = defaultLocale) {
    const legal = await prisma.Legal.findFirst()
    return applyTranslations(legal, locale, LEGAL_FIELDS)
  },

  async create(data, locale = defaultLocale) {
    const payload =
      locale === defaultLocale
        ? data
        : {
            translations: {
              [locale]: {
                privacyTitle: data.privacyTitle,
                privacyContent: data.privacyContent,
                termsTitle: data.termsTitle,
                termsContent: data.termsContent,
              },
            },
          }

    return prisma.Legal.create({ data: payload })
  },

  async upsert(data, locale = defaultLocale) {
    if (!data || (!data.privacyContent && !data.termsContent)) {
      throw new Error('Legal content cannot be empty')
    }

    const existing = await prisma.Legal.findFirst()
    if (existing) {
      if (locale === defaultLocale) {
        return prisma.Legal.update({
          where: { id: existing.id },
          data,
        })
      }

      const translations = upsertTranslations(existing, locale, data, LEGAL_FIELDS)
      return prisma.Legal.update({
        where: { id: existing.id },
        data: { translations },
      })
    }

    return this.create(data, locale)
  },
}


