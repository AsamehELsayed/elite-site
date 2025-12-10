import { NextResponse } from 'next/server'
import { caseStudyService } from '@/services/caseStudyService'
import { requireAdmin } from '@/lib/auth'
import { defaultLocale, isLocaleSupported } from '@/lib/i18n'

// Public: Guest users can view individual case studies
export async function GET(request, { params }) {
  try {
    const { slug } = await params
    const identifier = slug
    const lang = request.nextUrl.searchParams.get('lang')
    const locale = isLocaleSupported(lang) ? lang : defaultLocale
    const caseStudy = identifier ? await caseStudyService.getBySlugOrId(identifier, locale) : null

    if (!caseStudy) {
      return NextResponse.json(
        { error: 'Case study not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(caseStudy)
  } catch (error) {
    return NextResponse.json(
      { error: error.message || 'Failed to fetch case study' },
      { status: 500 }
    )
  }
}

// Protected: Only authenticated admin can update case studies
export async function PUT(request, { params }) {
  // Verify authentication
  const authResult = await requireAdmin(request)
  if (authResult instanceof NextResponse) {
    return authResult // Return error response if not authenticated
  }

  try {
    const { slug } = await params
    const identifier = slug
    const body = await request.json()
    const lang = request.nextUrl.searchParams.get('lang')
    const locale = isLocaleSupported(lang) ? lang : defaultLocale
    const caseStudy = await caseStudyService.update(identifier, body, locale)
    return NextResponse.json(caseStudy)
  } catch (error) {
    return NextResponse.json(
      { error: error.message || 'Failed to update case study' },
      { status: 500 }
    )
  }
}

// Protected: Only authenticated admin can delete case studies
export async function DELETE(request, { params }) {
  // Verify authentication
  const authResult = await requireAdmin(request)
  if (authResult instanceof NextResponse) {
    return authResult // Return error response if not authenticated
  }

  try {
    const url = new URL(request.url)
    let identifier =
      (await params)?.slug ||
      url.searchParams.get('id') ||
      url.searchParams.get('slug')

    // Last-segment fallback in case params are missing
    if (!identifier) {
      const pathParts = url.pathname.split('/').filter(Boolean)
      const last = pathParts[pathParts.length - 1]
      if (last && last !== 'case-studies') {
        identifier = last
      }
    }

    // Fallback: allow identifier in JSON body for clients that can't pass it in the path
    if (!identifier) {
      const body = await request.json().catch(() => null)
      identifier = body?.id || body?.slug
    }

    if (!identifier) {
      return NextResponse.json(
        { error: 'Case study ID or slug is required' },
        { status: 400 }
      )
    }
    
    await caseStudyService.delete(identifier)
    return NextResponse.json({ message: 'Case study deleted successfully' })
  } catch (error) {
    return NextResponse.json(
      { error: error.message || 'Failed to delete case study' },
      { status: 500 }
    )
  }
}


