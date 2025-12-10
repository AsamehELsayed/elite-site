import { NextResponse } from 'next/server'
import { heroService } from '@/services/heroService'
import { requireAdmin } from '@/lib/auth'
import { defaultLocale, isLocaleSupported } from '@/lib/i18n'
import { prisma } from '@/lib/prisma'

// Public: Guest users can view hero section
export async function GET(request) {
  try {
    const lang = request.nextUrl.searchParams.get('lang')
    const locale = isLocaleSupported(lang) ? lang : defaultLocale

    // Fetch raw to ensure translations are merged even if stored as JSON string
    const hero = await prisma.Hero.findFirst()
    if (!hero) return NextResponse.json(hero)

    const translations = normalizeTranslations(hero.translations)
    const localeData = locale === defaultLocale ? null : translations?.[locale]
    const merged = {
      ...hero,
      ...(localeData
        ? pickLocalized(localeData, ['title', 'subtitle', 'description', 'ctaText', 'ctaLink'])
        : {}),
      translations,
    }

    return NextResponse.json(merged)
  } catch (error) {
    return NextResponse.json(
      { error: error.message || 'Failed to fetch hero' },
      { status: 500 }
    )
  }
}

function normalizeTranslations(value) {
  if (!value) return {}
  if (typeof value === 'string') {
    try {
      return JSON.parse(value)
    } catch {
      return {}
    }
  }
  return value
}

function pickLocalized(localeData, fields) {
  return fields.reduce((acc, field) => {
    if (localeData[field] !== undefined && localeData[field] !== null) {
      acc[field] = localeData[field]
    }
    return acc
  }, {})
}

// Protected: Only authenticated admin can create hero
export async function POST(request) {
  // Verify authentication
  const authResult = await requireAdmin(request)
  if (authResult instanceof NextResponse) {
    return authResult // Return error response if not authenticated
  }

  try {
    const body = await request.json()
    const lang = request.nextUrl.searchParams.get('lang')
    const locale = isLocaleSupported(lang) ? lang : defaultLocale
    const hero = await heroService.create(body, locale)
    return NextResponse.json(hero, { status: 201 })
  } catch (error) {
    return NextResponse.json(
      { error: error.message || 'Failed to create hero' },
      { status: 500 }
    )
  }
}

// Protected: Only authenticated admin can update hero
export async function PUT(request) {
  // Verify authentication
  const authResult = await requireAdmin(request)
  if (authResult instanceof NextResponse) {
    return authResult // Return error response if not authenticated
  }

  try {
    const body = await request.json()
    const lang = request.nextUrl.searchParams.get('lang')
    const locale = isLocaleSupported(lang) ? lang : defaultLocale
    const hero = await heroService.upsert(body, locale)
    return NextResponse.json(hero)
  } catch (error) {
    return NextResponse.json(
      { error: error.message || 'Failed to update hero' },
      { status: 500 }
    )
  }
}




