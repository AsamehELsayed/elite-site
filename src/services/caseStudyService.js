import { prisma } from '@/lib/prisma'
import { applyTranslations, defaultLocale, upsertTranslations } from '@/lib/i18n'

const slugify = (value = '') =>
  value
    .toString()
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .replace(/-{2,}/g, '-') || null

async function generateUniqueSlug(baseValue, excludeId) {
  const baseSlug = slugify(baseValue)
  if (!baseSlug) return null

  let slug = baseSlug
  let suffix = 1

  // Keep trying until we find an unused slug, skipping the current record when updating
  while (true) {
    const existing = await prisma.caseStudy.findFirst({
      where: {
        slug,
        ...(excludeId ? { NOT: { id: excludeId } } : {})
      }
    })

    if (!existing) {
      return slug
    }

    slug = `${baseSlug}-${suffix}`
    suffix += 1
  }
}

async function findByIdentifier(identifier) {
  if (!identifier || identifier === 'undefined') {
    return null
  }

  return prisma.caseStudy.findFirst({
    where: {
      OR: [
        { id: identifier },
        { slug: identifier }
      ]
    }
  })
}

export const caseStudyService = {
  async getAll(locale = defaultLocale) {
    const localizedFields = ['title', 'category', 'description', 'link', 'image', 'year']
    const items = await prisma.caseStudy.findMany({
      orderBy: { order: 'asc' },
    })
    return items.map((c) => applyTranslations(c, locale, localizedFields))
  },

  async getById(id, locale = defaultLocale) {
    const localizedFields = ['title', 'category', 'description', 'link', 'image', 'year']
    const cs = await prisma.caseStudy.findUnique({
      where: { id },
    })
    return applyTranslations(cs, locale, localizedFields)
  },

  async getBySlugOrId(identifier, locale = defaultLocale) {
    const localizedFields = ['title', 'category', 'description', 'link', 'image', 'year']
    const cs = await findByIdentifier(identifier)
    return applyTranslations(cs, locale, localizedFields)
  },

  async create(data, locale = defaultLocale) {
    const { title, category, image, year, description, link, order = 0, slug: incomingSlug } = data

    // Validate required fields
    if (!title || !category || !image || !year || !description) {
      throw new Error('Missing required fields: title, category, image, year, and description are required')
    }

    const slugInput = incomingSlug || title
    const baseSlug = slugify(slugInput)

    if (locale !== defaultLocale) {
      // Try to attach a translation to an existing record sharing the same slug
      const existing = baseSlug ? await findByIdentifier(baseSlug) : null

      if (existing) {
        const translations = upsertTranslations(existing, locale, data, ['title', 'category', 'description', 'link', 'image', 'year'])
        return prisma.caseStudy.update({
          where: { id: existing.id },
          data: { translations },
        })
      }

      // No base record yet: create with empty base fields so EN stays clean; store actual content in translations
      const slug = await generateUniqueSlug(slugInput)
      const baseData = {
        title: '',
        slug,
        category: '',
        image: '',
        year: '',
        description: '',
        link: null,
        order,
      }

      return prisma.caseStudy.create({
        data: {
          ...baseData,
          translations: {
            [locale]: {
              title,
              category,
              description,
              link,
              image,
              year,
            },
          },
        },
      })
    }

    // Default locale create
    const slug = await generateUniqueSlug(slugInput)
    const baseData = {
      title,
      slug,
      category,
      image,
      year,
      description,
      link: link || null,
      order,
    }

    return prisma.caseStudy.create({ data: baseData })
  },

  async update(identifier, data, locale = defaultLocale) {
    const existing = await findByIdentifier(identifier)
    if (!existing) {
      throw new Error('Case study not found')
    }

    // Only generate a slug if explicitly provided, or if the record does not yet have one.
    // Avoid deriving slugs from translated titles to prevent cross-locale slug drift.
    let newSlug
    if (data.slug !== undefined) {
      newSlug = await generateUniqueSlug(data.slug || existing.slug || existing.title, existing.id)
    } else if (locale === defaultLocale && !existing.slug && (data.title || existing.title)) {
      newSlug = await generateUniqueSlug(data.title || existing.title, existing.id)
    }

    if (locale === defaultLocale) {
      const updated = await prisma.caseStudy.update({
        where: { id: existing.id },
        data: {
          ...data,
          ...(newSlug !== undefined ? { slug: newSlug } : {}),
        },
      })

      // Keep a default-locale translation copy in sync so applyTranslations can prefer it without mutating base
      const translations = upsertTranslations(updated, defaultLocale, updated, ['title', 'category', 'description', 'link', 'image', 'year'])
      if (translations !== updated.translations) {
        return prisma.caseStudy.update({
          where: { id: updated.id },
          data: { translations },
        })
      }
      return updated
    }

    const translations = upsertTranslations(existing, locale, data, ['title', 'category', 'description', 'link', 'image', 'year'])

    return prisma.caseStudy.update({
      where: { id: existing.id },
      data: {
        translations,
        ...(newSlug !== undefined ? { slug: newSlug } : {}),
      },
    })
  },

  async delete(identifier) {
    if (!identifier) {
      throw new Error('Case study ID or slug is required')
    }

    const existing = await findByIdentifier(identifier)

    // Treat missing records as already deleted for idempotency
    if (!existing) {
      return { id: identifier, deleted: true }
    }

    try {
      return await prisma.caseStudy.delete({
        where: { id: existing.id }
      })
    } catch (error) {
      if (error.code === 'P2025') {
        return { id: existing.id, deleted: true }
      }
      throw error
    }
  }
}




