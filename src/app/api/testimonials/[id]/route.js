import { NextResponse } from 'next/server'
import { testimonialService } from '@/services/testimonialService'
import { requireAdmin } from '@/lib/auth'
import { defaultLocale, isLocaleSupported } from '@/lib/i18n'

// Public: Guest users can view individual testimonials
export async function GET(request, { params }) {
  try {
    const { id } = await params
    const lang = request.nextUrl.searchParams.get('lang')
    const locale = isLocaleSupported(lang) ? lang : defaultLocale
    const testimonial = await testimonialService.getById(id, locale)
    if (!testimonial) {
      return NextResponse.json(
        { error: 'Testimonial not found' },
        { status: 404 }
      )
    }
    return NextResponse.json(testimonial)
  } catch (error) {
    return NextResponse.json(
      { error: error.message || 'Failed to fetch testimonial' },
      { status: 500 }
    )
  }
}

// Protected: Only authenticated admin can update testimonials
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
    const testimonial = await testimonialService.update(id, body, locale)
    return NextResponse.json(testimonial)
  } catch (error) {
    return NextResponse.json(
      { error: error.message || 'Failed to update testimonial' },
      { status: 500 }
    )
  }
}

// Protected: Only authenticated admin can delete testimonials
export async function DELETE(request, { params }) {
  // Verify authentication
  const authResult = await requireAdmin(request)
  if (authResult instanceof NextResponse) {
    return authResult // Return error response if not authenticated
  }

  try {
    const { id } = await params
    await testimonialService.delete(id)
    return NextResponse.json({ message: 'Testimonial deleted successfully' })
  } catch (error) {
    return NextResponse.json(
      { error: error.message || 'Failed to delete testimonial' },
      { status: 500 }
    )
  }
}

