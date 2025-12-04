import { NextResponse } from 'next/server'
import { caseStudyService } from '@/services/caseStudyService'
import { requireAdmin } from '@/lib/auth'

// Public: Guest users can view individual case studies
export async function GET(request, { params }) {
  try {
    const { id } = params
    const caseStudy = await caseStudyService.getById(id)
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
    const { id } = params
    const body = await request.json()
    const caseStudy = await caseStudyService.update(id, body)
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
    const { id } = params
    await caseStudyService.delete(id)
    return NextResponse.json({ message: 'Case study deleted successfully' })
  } catch (error) {
    return NextResponse.json(
      { error: error.message || 'Failed to delete case study' },
      { status: 500 }
    )
  }
}




