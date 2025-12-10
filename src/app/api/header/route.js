import { NextResponse } from 'next/server'
import { headerService } from '@/services/headerService'
import { requireAdmin } from '@/lib/auth'
import { defaultLocale, isLocaleSupported } from '@/lib/i18n'

// Public: Guest users can view header section
export async function GET(request) {
  try {
    const lang = request.nextUrl.searchParams.get('lang')
    const locale = isLocaleSupported(lang) ? lang : defaultLocale
    const header = await headerService.get(locale)
    return NextResponse.json(header)
  } catch (error) {
    return NextResponse.json(
      { error: error.message || 'Failed to fetch header' },
      { status: 500 }
    )
  }
}

// Protected: Only authenticated admin can create header
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
    const header = await headerService.create(body, locale)
    return NextResponse.json(header, { status: 201 })
  } catch (error) {
    return NextResponse.json(
      { error: error.message || 'Failed to create header' },
      { status: 500 }
    )
  }
}

// Protected: Only authenticated admin can update header
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
    const header = await headerService.upsert(body, locale)
    return NextResponse.json(header)
  } catch (error) {
    return NextResponse.json(
      { error: error.message || 'Failed to update header' },
      { status: 500 }
    )
  }
}




