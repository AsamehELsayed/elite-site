import { NextResponse } from 'next/server'
import { visualService } from '@/services/visualService'
import { requireAdmin } from '@/lib/auth'
import { defaultLocale, isLocaleSupported } from '@/lib/i18n'

// Public: Guest users can view visual section
export async function GET(request) {
  try {
    const lang = request.nextUrl.searchParams.get('lang')
    const locale = isLocaleSupported(lang) ? lang : defaultLocale
    const visual = await visualService.get(locale)
    if (!visual) {
      // Return empty object instead of null for better client handling
      return NextResponse.json({
        gallery1Images: [],
        gallery2Images: []
      })
    }
    
    // Parse JSON strings back to arrays
    const parsed = {
      ...visual,
      gallery1Images: visual.gallery1Images ? JSON.parse(visual.gallery1Images) : [],
      gallery2Images: visual.gallery2Images ? JSON.parse(visual.gallery2Images) : []
    }
    
    return NextResponse.json(parsed)
  } catch (error) {
    console.error('Visual GET error:', error)
    // Return empty object on error so frontend doesn't break
    return NextResponse.json(
      { 
        error: error.message || 'Failed to fetch visual section',
        gallery1Images: [],
        gallery2Images: []
      },
      { status: 500 }
    )
  }
}

// Protected: Only authenticated admin can create visual section
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
    const visual = await visualService.create(body, locale)
    
    // Parse JSON strings back to arrays
    const parsed = {
      ...visual,
      gallery1Images: visual.gallery1Images ? JSON.parse(visual.gallery1Images) : [],
      gallery2Images: visual.gallery2Images ? JSON.parse(visual.gallery2Images) : []
    }
    
    return NextResponse.json(parsed, { status: 201 })
  } catch (error) {
    return NextResponse.json(
      { error: error.message || 'Failed to create visual section' },
      { status: 500 }
    )
  }
}

// Protected: Only authenticated admin can update visual section
export async function PUT(request) {
  // Verify authentication
  const authResult = await requireAdmin(request)
  if (authResult instanceof NextResponse) {
    return authResult // Return error response if not authenticated
  }

  try {
    const body = await request.json()
    console.log('PUT /api/visuals - Received data:', JSON.stringify(body, null, 2))
    
    const lang = request.nextUrl.searchParams.get('lang')
    const locale = isLocaleSupported(lang) ? lang : defaultLocale
    const visual = await visualService.upsert(body, locale)
    
    // Parse JSON strings back to arrays
    const parsed = {
      ...visual,
      gallery1Images: visual.gallery1Images ? JSON.parse(visual.gallery1Images) : [],
      gallery2Images: visual.gallery2Images ? JSON.parse(visual.gallery2Images) : []
    }
    
    return NextResponse.json(parsed)
  } catch (error) {
    console.error('PUT /api/visuals - Error:', error)
    console.error('PUT /api/visuals - Error stack:', error.stack)
    return NextResponse.json(
      { error: error.message || 'Failed to update visual section' },
      { status: 500 }
    )
  }
}

