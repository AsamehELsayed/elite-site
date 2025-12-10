import { prisma } from '@/lib/prisma'
import { applyTranslations, defaultLocale, upsertTranslations } from '@/lib/i18n'

export const headerService = {
  async get(locale = defaultLocale) {
    const header = await prisma.Header.findFirst()
    return applyTranslations(header, locale, [
      'companyName',
      'navLinks',
      'serviceLinks',
      'phone',
      'email',
      'socialLinks',
      'galleryImages',
      'sinceYear',
      'footerText',
    ])
  },

  async create(data, locale = defaultLocale) {
    const payload =
      locale === defaultLocale
        ? data
        : {
            translations: {
              [locale]: {
                companyName: data.companyName,
                navLinks: data.navLinks,
                serviceLinks: data.serviceLinks,
                phone: data.phone,
                email: data.email,
                socialLinks: data.socialLinks,
                galleryImages: data.galleryImages,
                sinceYear: data.sinceYear,
                footerText: data.footerText,
              },
            },
          }

    return await prisma.Header.create({
      data: payload,
    })
  },

  async update(id, data, locale = defaultLocale) {
    if (locale === defaultLocale) {
      return await prisma.Header.update({
        where: { id },
        data,
      })
    }

    const existing = await prisma.Header.findUnique({ where: { id } })
    const translations = upsertTranslations(existing, locale, data, [
      'companyName',
      'navLinks',
      'serviceLinks',
      'phone',
      'email',
      'socialLinks',
      'galleryImages',
      'sinceYear',
      'footerText',
    ])

    return await prisma.Header.update({
      where: { id },
      data: { translations },
    })
  },

  async upsert(data, locale = defaultLocale) {
    // Validate that we have at least some content
    if (!data || Object.keys(data).length === 0) {
      throw new Error('Header data cannot be empty')
    }

    const existing = await prisma.Header.findFirst()
    if (existing) {
      if (locale === defaultLocale) {
        return await prisma.Header.update({
          where: { id: existing.id },
          data,
        })
      }

      const translations = upsertTranslations(existing, locale, data, [
        'companyName',
        'navLinks',
        'serviceLinks',
        'phone',
        'email',
        'socialLinks',
        'galleryImages',
        'sinceYear',
        'footerText',
      ])

      return await prisma.Header.update({
        where: { id: existing.id },
        data: { translations },
      })
    }

    return await this.create(data, locale)
  }
}
