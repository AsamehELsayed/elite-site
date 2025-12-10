import { NextResponse } from 'next/server'
import { legalService } from '@/services/legalService'
import { requireAdmin } from '@/lib/auth'
import { defaultLocale, isLocaleSupported } from '@/lib/i18n'

// Public: fetch legal content (privacy + terms)
export async function GET(request) {
  try {
    const lang = request.nextUrl.searchParams.get('lang')
    const locale = isLocaleSupported(lang) ? lang : defaultLocale
    const legal = await legalService.get(locale)
    return NextResponse.json(legal)
  } catch (error) {
    return NextResponse.json(
      { error: error.message || 'Failed to fetch legal content' },
      { status: 500 }
    )
  }
}

// Protected: create a legal record (admin)
export async function POST(request) {
  const authResult = await requireAdmin(request)
  if (authResult instanceof NextResponse) {
    return authResult
  }

  try {
    const body = await request.json()
    const lang = request.nextUrl.searchParams.get('lang')
    const locale = isLocaleSupported(lang) ? lang : defaultLocale
    const legal = await legalService.create(body, locale)
    return NextResponse.json(legal, { status: 201 })
  } catch (error) {
    return NextResponse.json(
      { error: error.message || 'Failed to create legal content' },
      { status: 500 }
    )
  }
}

// Protected: update/upsert the legal record (admin)
export async function PUT(request) {
  const authResult = await requireAdmin(request)
  if (authResult instanceof NextResponse) {
    return authResult
  }

  try {
    const body = await request.json()
    const lang = request.nextUrl.searchParams.get('lang')
    const locale = isLocaleSupported(lang) ? lang : defaultLocale
    const legal = await legalService.upsert(body, locale)
    return NextResponse.json(legal)
  } catch (error) {
    return NextResponse.json(
      { error: error.message || 'Failed to update legal content' },
      { status: 500 }
    )
  }
}

