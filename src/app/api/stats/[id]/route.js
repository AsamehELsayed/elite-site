import { NextResponse } from 'next/server'
import { statService } from '@/services/statService'
import { requireAdmin } from '@/lib/auth'

// Public: Guest users can view individual stats
export async function GET(request, { params }) {
  try {
    const { id } = params
    const stat = await statService.getById(id)
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
    const { id } = params
    const body = await request.json()
    const stat = await statService.update(id, body)
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
    const { id } = params
    await statService.delete(id)
    return NextResponse.json({ message: 'Stat deleted successfully' })
  } catch (error) {
    return NextResponse.json(
      { error: error.message || 'Failed to delete stat' },
      { status: 500 }
    )
  }
}




