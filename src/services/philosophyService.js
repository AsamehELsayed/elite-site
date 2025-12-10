import { prisma } from '@/lib/prisma'
import { applyTranslations, defaultLocale, upsertTranslations } from '@/lib/i18n'

export const philosophyService = {
  async get(locale = defaultLocale) {
    const record = await prisma.Philosophy.findFirst()
    return applyTranslations(record, locale, ['title', 'content'])
  },

  async create(data, locale = defaultLocale) {
    const payload =
      locale === defaultLocale
        ? data
        : {
            translations: {
              [locale]: {
                title: data.title,
                content: data.content,
              },
            },
          }

    return await prisma.Philosophy.create({ data: payload })
  },

  async update(id, data, locale = defaultLocale) {
    if (locale === defaultLocale) {
      return await prisma.Philosophy.update({ where: { id }, data })
    }

    const existing = await prisma.Philosophy.findUnique({ where: { id } })
    const translations = upsertTranslations(existing, locale, data, ['title', 'content'])
    return await prisma.Philosophy.update({ where: { id }, data: { translations } })
  },

  async upsert(data, locale = defaultLocale) {
    // Validate that we have content
    if (!data || !data.content) {
      throw new Error('Philosophy content is required')
    }

    const existing = await prisma.Philosophy.findFirst()
    if (existing) {
      if (locale === defaultLocale) {
        return await prisma.Philosophy.update({
          where: { id: existing.id },
          data,
        })
      }

      const translations = upsertTranslations(existing, locale, data, ['title', 'content'])
      return await prisma.Philosophy.update({
        where: { id: existing.id },
        data: { translations },
      })
    }
    return await this.create(data, locale)
  }
}




