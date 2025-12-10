import { NextResponse } from 'next/server'
import { servicesService } from '@/services/servicesService'
import { defaultLocale, isLocaleSupported } from '@/lib/i18n'

const toSlug = (value) =>
  (value || '')
    .toString()
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '')

const FALLBACK_SERVICES = [
  {
    id: '01',
    title: 'Brand Identity',
    description: 'Crafting visual systems that speak without words.',
    icon: 'Palette',
  },
  {
    id: '02',
    title: 'Digital Experience',
    description: 'Immersive web and mobile solutions for the modern age.',
    icon: 'Globe',
  },
  {
    id: '03',
    title: 'Content Strategy',
    description: 'Narratives that engage, convert, and retain.',
    icon: 'FileText',
  },
  {
    id: '04',
    title: 'Growth Marketing',
    description: 'Data-driven campaigns for scalable success.',
    icon: 'TrendingUp',
  },
]

const normalizeServices = (services) => {
  if (!services) return []
  try {
    const parsed = typeof services === 'string' ? JSON.parse(services) : services
    if (Array.isArray(parsed)) return parsed
    return []
  } catch {
    return []
  }
}

const computeSlug = (service, fallbackTitle) =>
  toSlug(service?.slug) ||
  toSlug(service?.title) ||
  toSlug(fallbackTitle) ||
  toSlug(service?.id) ||
  service?.id ||
  ''

const withSlug = (service, fallbackTitle) => ({
  ...service,
  slug: computeSlug(service, fallbackTitle),
})

function extractSlug(request, params) {
  const fromParams = params?.slug
  if (fromParams) return fromParams

  // Fallback: take last path segment
  const pathParts = request.nextUrl?.pathname?.split('/').filter(Boolean) || []
  const last = pathParts[pathParts.length - 1]
  return last && last !== 'services' ? last : undefined
}

export async function GET(request, { params }) {
  try {
    const slug = extractSlug(request, params)
    if (!slug) {
      return NextResponse.json({ error: 'Slug is required' }, { status: 400 })
    }

    const lang = request.nextUrl.searchParams.get('lang')
    const locale = isLocaleSupported(lang) ? lang : defaultLocale

    const recordLocalized = await servicesService.get(locale)
    const recordDefault =
      locale === defaultLocale ? recordLocalized : await servicesService.get(defaultLocale)

    const localizedServices = normalizeServices(recordLocalized?.services)
    const defaultServices =
      normalizeServices(recordDefault?.services).length > 0
        ? normalizeServices(recordDefault?.services)
        : FALLBACK_SERVICES

    const defaultWithSlugs = defaultServices.map((service) =>
      withSlug(service, service.title)
    )

    const localizedWithSlugs = localizedServices.map((service) => {
      const fallback = defaultWithSlugs.find((s) => s.id === service.id)
      return withSlug(service, fallback?.title || service.title)
    })

    const targetSlug = toSlug(slug)
    const matchedDefault = defaultWithSlugs.find(
      (s) => toSlug(s.slug) === targetSlug
    )

    if (!matchedDefault) {
      return NextResponse.json({ error: 'Service not found' }, { status: 404 })
    }

    const matchedLocalized =
      localizedWithSlugs.find((s) => s.id === matchedDefault.id) || matchedDefault

    const servicesForResponse =
      localizedWithSlugs.length > 0 ? localizedWithSlugs : defaultWithSlugs

    return NextResponse.json({
      service: matchedLocalized,
      services: servicesForResponse,
      sectionTitle: recordLocalized?.sectionTitle ?? recordDefault?.sectionTitle ?? null,
      sectionSubtitle: recordLocalized?.sectionSubtitle ?? recordDefault?.sectionSubtitle ?? null,
    })
  } catch (error) {
    return NextResponse.json(
      { error: error.message || 'Failed to fetch service' },
      { status: 500 }
    )
  }
}

