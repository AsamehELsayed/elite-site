import { prisma } from '@/lib/prisma'
import { applyTranslations, defaultLocale, upsertTranslations } from '@/lib/i18n'

export const statService = {
  async getAll(locale = defaultLocale) {
    const stats = await prisma.Stat.findMany({
      orderBy: { order: 'asc' },
    })
    return stats.map((s) => applyTranslations(s, locale, ['label', 'value']))
  },

  async getById(id, locale = defaultLocale) {
    const stat = await prisma.Stat.findUnique({
      where: { id },
    })
    return applyTranslations(stat, locale, ['label', 'value'])
  },

  async create(data, locale = defaultLocale) {
    const { label, value, order = 0 } = data

    // Validate required fields
    if (!label || !value) {
      throw new Error('Missing required fields: label and value are required')
    }

    if (locale !== defaultLocale) {
      // Prisma model requires base label/value, so store them alongside the locale translation
      return await prisma.Stat.create({
        data: {
          label,
          value,
          order,
          translations: {
            [locale]: { label, value },
          },
        },
      })
    }

    return await prisma.Stat.create({
      data: {
        label,
        value,
        order,
      },
    })
  },

  async update(id, data, locale = defaultLocale) {
    if (locale === defaultLocale) {
      return await prisma.Stat.update({
        where: { id },
        data,
      })
    }

    const existing = await prisma.Stat.findUnique({ where: { id } })
    const translations = upsertTranslations(existing, locale, data, ['label', 'value'])
    return await prisma.Stat.update({
      where: { id },
      data: { translations },
    })
  },

  async delete(id) {
    try {
      return await prisma.Stat.delete({
        where: { id }
      })
    } catch (error) {
      // If the record doesn't exist (P2025), treat it as successful deletion
      if (error.code === 'P2025') {
        return { id, deleted: true } // Return success for already deleted items
      }
      throw error
    }
  }
}




