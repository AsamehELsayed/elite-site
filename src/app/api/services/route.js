import { NextResponse } from 'next/server'
import { servicesService } from '@/services/servicesService'
import { requireAdmin } from '@/lib/auth'
import { defaultLocale, isLocaleSupported } from '@/lib/i18n'

// Public: Guest users can view services section
export async function GET(request) {
  try {
    const lang = request.nextUrl.searchParams.get('lang')
    const locale = isLocaleSupported(lang) ? lang : defaultLocale
    const services = await servicesService.get(locale)
    return NextResponse.json(services)
  } catch (error) {
    return NextResponse.json(
      { error: error.message || 'Failed to fetch services' },
      { status: 500 }
    )
  }
}

// Protected: Only authenticated admin can create services
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
    const services = await servicesService.create(body, locale)
    return NextResponse.json(services, { status: 201 })
  } catch (error) {
    return NextResponse.json(
      { error: error.message || 'Failed to create services' },
      { status: 500 }
    )
  }
}

// Protected: Only authenticated admin can update services
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
    const services = await servicesService.upsert(body, locale)
    return NextResponse.json(services)
  } catch (error) {
    return NextResponse.json(
      { error: error.message || 'Failed to update services' },
      { status: 500 }
    )
  }
}




