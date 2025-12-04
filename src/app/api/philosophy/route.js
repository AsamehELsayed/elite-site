import { NextResponse } from 'next/server'
import { philosophyService } from '@/services/philosophyService'
import { requireAdmin } from '@/lib/auth'

// Public: Guest users can view philosophy section
export async function GET() {
  try {
    const philosophy = await philosophyService.get()
    return NextResponse.json(philosophy)
  } catch (error) {
    return NextResponse.json(
      { error: error.message || 'Failed to fetch philosophy' },
      { status: 500 }
    )
  }
}

// Protected: Only authenticated admin can create philosophy
export async function POST(request) {
  // Verify authentication
  const authResult = await requireAdmin(request)
  if (authResult instanceof NextResponse) {
    return authResult // Return error response if not authenticated
  }

  try {
    const body = await request.json()
    const philosophy = await philosophyService.create(body)
    return NextResponse.json(philosophy, { status: 201 })
  } catch (error) {
    return NextResponse.json(
      { error: error.message || 'Failed to create philosophy' },
      { status: 500 }
    )
  }
}

// Protected: Only authenticated admin can update philosophy
export async function PUT(request) {
  // Verify authentication
  const authResult = await requireAdmin(request)
  if (authResult instanceof NextResponse) {
    return authResult // Return error response if not authenticated
  }

  try {
    const body = await request.json()
    const philosophy = await philosophyService.upsert(body)
    return NextResponse.json(philosophy)
  } catch (error) {
    return NextResponse.json(
      { error: error.message || 'Failed to update philosophy' },
      { status: 500 }
    )
  }
}




