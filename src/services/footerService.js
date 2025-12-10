import { prisma } from '@/lib/prisma'
import { applyTranslations, defaultLocale, upsertTranslations } from '@/lib/i18n'

export const footerService = {
  async get(locale = defaultLocale) {
    const footer = await prisma.Footer.findFirst()
    return applyTranslations(footer, locale, [
      'companyName',
      'companyDescription',
      'socialLinks',
      'servicesLinks',
      'companyLinks',
      'newsletterTitle',
      'newsletterDescription',
      'copyrightText',
      'privacyPolicyLink',
      'termsOfServiceLink',
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
                companyDescription: data.companyDescription,
                socialLinks: data.socialLinks,
                servicesLinks: data.servicesLinks,
                companyLinks: data.companyLinks,
                newsletterTitle: data.newsletterTitle,
                newsletterDescription: data.newsletterDescription,
                copyrightText: data.copyrightText,
                privacyPolicyLink: data.privacyPolicyLink,
                termsOfServiceLink: data.termsOfServiceLink,
              },
            },
          }

    return await prisma.Footer.create({
      data: payload,
    })
  },

  async update(id, data, locale = defaultLocale) {
    if (locale === defaultLocale) {
      return await prisma.Footer.update({
        where: { id },
        data,
      })
    }

    const existing = await prisma.Footer.findUnique({ where: { id } })
    const translations = upsertTranslations(existing, locale, data, [
      'companyName',
      'companyDescription',
      'socialLinks',
      'servicesLinks',
      'companyLinks',
      'newsletterTitle',
      'newsletterDescription',
      'copyrightText',
      'privacyPolicyLink',
      'termsOfServiceLink',
    ])

    return await prisma.Footer.update({
      where: { id },
      data: { translations },
    })
  },

  async upsert(data, locale = defaultLocale) {
    // Validate that we have at least some content
    if (!data || Object.keys(data).length === 0) {
      throw new Error('Footer data cannot be empty')
    }

    const existing = await prisma.Footer.findFirst()
    if (existing) {
      if (locale === defaultLocale) {
        return await prisma.Footer.update({
          where: { id: existing.id },
          data,
        })
      }

      const translations = upsertTranslations(existing, locale, data, [
        'companyName',
        'companyDescription',
        'socialLinks',
        'servicesLinks',
        'companyLinks',
        'newsletterTitle',
        'newsletterDescription',
        'copyrightText',
        'privacyPolicyLink',
        'termsOfServiceLink',
      ])

      return await prisma.Footer.update({
        where: { id: existing.id },
        data: { translations },
      })
    }

    return await this.create(data, locale)
  }
}
