import { prisma } from '@/lib/prisma'
import { applyTranslations, defaultLocale, upsertTranslations } from '@/lib/i18n'

export const visualService = {
  async get(locale = defaultLocale) {
    try {
      // Check if Visual model exists in Prisma Client
      if (!prisma.Visual) {
        throw new Error('Visual model not found. Please run: npm run db:generate')
      }
      const visual = await prisma.Visual.findFirst()
      return applyTranslations(
        visual,
        locale,
        [
          'section1Title',
          'section1Highlight',
          'section2Title',
          'section2Highlight',
          'section3Title',
          'section3Highlight',
          'section4Title',
          'section4Highlight',
          'section5Title',
          'section5Highlight',
          'gallery1Images',
          'gallery2Images',
        ]
      )
    } catch (error) {
      // If model doesn't exist, return null instead of throwing
      if (error.message.includes('not found') || error.message.includes('undefined')) {
        return null
      }
      throw error
    }
  },

  async create(data, locale = defaultLocale) {
    // Validate required fields
    if (!data) {
      throw new Error('Visual data cannot be empty')
    }

    if (locale !== defaultLocale) {
      return await prisma.Visual.create({
        data: {
          translations: {
            [locale]: {
              section1Title: data.section1Title,
              section1Highlight: data.section1Highlight,
              section2Title: data.section2Title,
              section2Highlight: data.section2Highlight,
              section3Title: data.section3Title,
              section3Highlight: data.section3Highlight,
              section4Title: data.section4Title,
              section4Highlight: data.section4Highlight,
              section5Title: data.section5Title,
              section5Highlight: data.section5Highlight,
              gallery1Images: data.gallery1Images,
              gallery2Images: data.gallery2Images,
            },
          },
        },
      })
    }

    return await prisma.Visual.create({
      data: {
        ...data,
        gallery1Images: data.gallery1Images ? JSON.stringify(data.gallery1Images) : null,
        gallery2Images: data.gallery2Images ? JSON.stringify(data.gallery2Images) : null
      }
    })
  },

  async update(id, data, locale = defaultLocale) {
    if (locale === defaultLocale) {
      const updateData = { ...data }
      if (updateData.gallery1Images && Array.isArray(updateData.gallery1Images)) {
        updateData.gallery1Images = JSON.stringify(updateData.gallery1Images)
      }
      if (updateData.gallery2Images && Array.isArray(updateData.gallery2Images)) {
        updateData.gallery2Images = JSON.stringify(updateData.gallery2Images)
      }
      return await prisma.Visual.update({
        where: { id },
        data: updateData,
      })
    }

    const existing = await prisma.Visual.findUnique({ where: { id } })
    const translations = upsertTranslations(existing, locale, data, [
      'section1Title',
      'section1Highlight',
      'section2Title',
      'section2Highlight',
      'section3Title',
      'section3Highlight',
      'section4Title',
      'section4Highlight',
      'section5Title',
      'section5Highlight',
      'gallery1Images',
      'gallery2Images',
    ])

    return await prisma.Visual.update({
      where: { id },
      data: { translations },
    })
  },

  async upsert(data, locale = defaultLocale) {
    // Validate that we have at least some content
    if (!data || Object.keys(data).length === 0) {
      throw new Error('Visual data cannot be empty')
    }

    // Check if Visual model exists in Prisma Client
    if (!prisma.Visual) {
      throw new Error('Visual model not found. Please run: npm run db:generate')
    }

    const existing = await prisma.Visual.findFirst()
    if (existing) {
      return await this.update(existing.id, data, locale)
    }
    return await this.create(data, locale)
  }
}

