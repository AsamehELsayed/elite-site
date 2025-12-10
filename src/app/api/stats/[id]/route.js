import { NextResponse } from 'next/server'
import { statService } from '@/services/statService'
import { requireAdmin } from '@/lib/auth'
import { defaultLocale, isLocaleSupported } from '@/lib/i18n'

// Public: Guest users can view individual stats
export async function GET(request, { params }) {
  try {
    const { id } = await params
    const lang = request.nextUrl.searchParams.get('lang')
    const locale = isLocaleSupported(lang) ? lang : defaultLocale
    const stat = await statService.getById(id, locale)
    if (!stat) {
      return NextResponse.json(
        { error: 'Stat not found' },
        { status: 404 }
      )
    }
    return NextResponse.json(stat)
  } catch (error) {
    return NextResponse.json(
      { error: error.message || 'Failed to fetch stat' },
      { status: 500 }
    )
  }
}

// Protected: Only authenticated admin can update stats
export async function PUT(request, { params }) {
  // Verify authentication
  const authResult = await requireAdmin(request)
  if (authResult instanceof NextResponse) {
    return authResult // Return error response if not authenticated
  }

  try {
    const { id } = await params
    const body = await request.json()
    const lang = request.nextUrl.searchParams.get('lang')
    const locale = isLocaleSupported(lang) ? lang : defaultLocale
    const stat = await statService.update(id, body, locale)
    return NextResponse.json(stat)
  } catch (error) {
    return NextResponse.json(
      { error: error.message || 'Failed to update stat' },
      { status: 500 }
    )
  }
}

// Protected: Only authenticated admin can delete stats
export async function DELETE(request, { params }) {
  // Verify authentication
  const authResult = await requireAdmin(request)
  if (authResult instanceof NextResponse) {
    return authResult // Return error response if not authenticated
  }

  try {
    const { id } = await params
    await statService.delete(id)
    return NextResponse.json({ message: 'Stat deleted successfully' })
  } catch (error) {
    return NextResponse.json(
      { error: error.message || 'Failed to delete stat' },
      { status: 500 }
    )
  }
}




