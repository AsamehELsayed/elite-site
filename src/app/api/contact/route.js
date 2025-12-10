import { NextResponse } from 'next/server'
import { contactService } from '@/services/contactService'
import { requireAdmin } from '@/lib/auth'
import { defaultLocale, isLocaleSupported } from '@/lib/i18n'

// Public: Guest users can view contact section
export async function GET(request) {
  try {
    const lang = request.nextUrl.searchParams.get('lang')
    const locale = isLocaleSupported(lang) ? lang : defaultLocale
    const contact = await contactService.get(locale)
    return NextResponse.json(contact)
  } catch (error) {
    return NextResponse.json(
      { error: error.message || 'Failed to fetch contact' },
      { status: 500 }
    )
  }
}

// Protected: Only authenticated admin can create contact
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
    const contact = await contactService.create(body, locale)
    return NextResponse.json(contact, { status: 201 })
  } catch (error) {
    return NextResponse.json(
      { error: error.message || 'Failed to create contact' },
      { status: 500 }
    )
  }
}

// Protected: Only authenticated admin can update contact
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
    const contact = await contactService.upsert(body, locale)
    return NextResponse.json(contact)
  } catch (error) {
    return NextResponse.json(
      { error: error.message || 'Failed to update contact' },
      { status: 500 }
    )
  }
}




