import { NextResponse } from 'next/server'
import { caseStudyService } from '@/services/caseStudyService'
import { requireAdmin } from '@/lib/auth'

// Public: Guest users can view case studies
export async function GET() {
  try {
    const caseStudies = await caseStudyService.getAll()
    return NextResponse.json(caseStudies)
  } catch (error) {
    return NextResponse.json(
      { error: error.message || 'Failed to fetch case studies' },
      { status: 500 }
    )
  }
}

// Protected: Only authenticated admin can create case studies
export async function POST(request) {
  // Verify authentication
  const authResult = await requireAdmin(request)
  if (authResult instanceof NextResponse) {
    return authResult // Return error response if not authenticated
  }

  try {
    const body = await request.json()
    const caseStudy = await caseStudyService.create(body)
    return NextResponse.json(caseStudy, { status: 201 })
  } catch (error) {
    return NextResponse.json(
      { error: error.message || 'Failed to create case study' },
      { status: 500 }
    )
  }
}




