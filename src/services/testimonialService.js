import { prisma } from '@/lib/prisma'
import { applyTranslations, defaultLocale, upsertTranslations } from '@/lib/i18n'

export const testimonialService = {
  async getAll(locale = defaultLocale) {
    const testimonials = await prisma.Testimonial.findMany({
      orderBy: { order: 'asc' },
    })
    return testimonials.map((t) => {
      const withLocale = applyTranslations(t, locale, ['quote', 'author', 'role', 'city', 'metrics'])
      return {
        ...withLocale,
        metrics: withLocale.metrics ? JSON.parse(withLocale.metrics) : [],
      }
    })
  },

  async getById(id, locale = defaultLocale) {
    const testimonial = await prisma.Testimonial.findUnique({
      where: { id }
    })
    if (!testimonial) return null
    const withLocale = applyTranslations(testimonial, locale, ['quote', 'author', 'role', 'city', 'metrics'])
    return {
      ...withLocale,
      metrics: withLocale.metrics ? JSON.parse(withLocale.metrics) : []
    }
  },

  async create(data, locale = defaultLocale) {
    const { quote, author, role, city, metrics, order = 0 } = data

    // Validate required fields
    if (!quote || !author || !role || !city) {
      throw new Error('Missing required fields: quote, author, role, and city are required')
    }

    const metricsString = JSON.stringify(metrics || [])

    // For non-default locale, stash into translations
    if (locale !== defaultLocale) {
      const testimonial = await prisma.Testimonial.create({
        data: {
          quote,
          author,
          role,
          city,
          metrics: metricsString,
          order,
          translations: {
            [locale]: {
              quote,
              author,
              role,
              city,
              metrics: metricsString,
            },
          },
        },
      })
      return { ...testimonial, metrics: testimonial.metrics ? JSON.parse(testimonial.metrics) : [] }
    }

    const testimonial = await prisma.Testimonial.create({
      data: {
        quote,
        author,
        role,
        city,
        metrics: metricsString,
        order,
      },
    })
    return { ...testimonial, metrics: testimonial.metrics ? JSON.parse(testimonial.metrics) : [] }
  },

  async update(id, data, locale = defaultLocale) {
    if (locale === defaultLocale) {
      const updateData = { ...data }
      if (updateData.metrics && Array.isArray(updateData.metrics)) {
        updateData.metrics = JSON.stringify(updateData.metrics)
      }
      const testimonial = await prisma.Testimonial.update({
        where: { id },
        data: updateData,
      })
      return { ...testimonial, metrics: testimonial.metrics ? JSON.parse(testimonial.metrics) : [] }
    }

    const existing = await prisma.Testimonial.findUnique({ where: { id } })
    const translatedData = { ...data }
    if (translatedData.metrics && Array.isArray(translatedData.metrics)) {
      translatedData.metrics = JSON.stringify(translatedData.metrics)
    }
    const translations = upsertTranslations(existing, locale, translatedData, ['quote', 'author', 'role', 'city', 'metrics'])
    const testimonial = await prisma.Testimonial.update({
      where: { id },
      data: { translations },
    })
    return { ...testimonial, metrics: testimonial.metrics ? JSON.parse(testimonial.metrics) : [] }
  },

  async delete(id) {
    try {
      return await prisma.Testimonial.delete({
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

