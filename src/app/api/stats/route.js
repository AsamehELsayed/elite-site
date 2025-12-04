import { NextResponse } from 'next/server'
import { statService } from '@/services/statService'
import { requireAdmin } from '@/lib/auth'

// Public: Guest users can view stats
export async function GET() {
  try {
    const stats = await statService.getAll()
    return NextResponse.json(stats)
  } catch (error) {
    return NextResponse.json(
      { error: error.message || 'Failed to fetch stats' },
      { status: 500 }
    )
  }
}

// Protected: Only authenticated admin can create stats
export async function POST(request) {
  // Verify authentication
  const authResult = await requireAdmin(request)
  if (authResult instanceof NextResponse) {
    return authResult // Return error response if not authenticated
  }

  try {
    const body = await request.json()
    const stat = await statService.create(body)
    return NextResponse.json(stat, { status: 201 })
  } catch (error) {
    return NextResponse.json(
      { error: error.message || 'Failed to create stat' },
      { status: 500 }
    )
  }
}




