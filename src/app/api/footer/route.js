import { NextResponse } from 'next/server'
import { footerService } from '@/services/footerService'
import { requireAdmin } from '@/lib/auth'
import { defaultLocale, isLocaleSupported } from '@/lib/i18n'

// Public: Guest users can view footer section
export async function GET(request) {
  try {
    const lang = request.nextUrl.searchParams.get('lang')
    const locale = isLocaleSupported(lang) ? lang : defaultLocale
    const footer = await footerService.get(locale)
    return NextResponse.json(footer)
  } catch (error) {
    return NextResponse.json(
      { error: error.message || 'Failed to fetch footer' },
      { status: 500 }
    )
  }
}

// Protected: Only authenticated admin can create footer
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
    const footer = await footerService.create(body, locale)
    return NextResponse.json(footer, { status: 201 })
  } catch (error) {
    return NextResponse.json(
      { error: error.message || 'Failed to create footer' },
      { status: 500 }
    )
  }
}

// Protected: Only authenticated admin can update footer
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
    const footer = await footerService.upsert(body, locale)
    return NextResponse.json(footer)
  } catch (error) {
    return NextResponse.json(
      { error: error.message || 'Failed to update footer' },
      { status: 500 }
    )
  }
}




