import { NextResponse } from 'next/server'
import { heroService } from '@/services/heroService'
import { requireAdmin } from '@/lib/auth'

// Public: Guest users can view hero section
export async function GET() {
  try {
    const hero = await heroService.get()
    return NextResponse.json(hero)
  } catch (error) {
    return NextResponse.json(
      { error: error.message || 'Failed to fetch hero' },
      { status: 500 }
    )
  }
}

// Protected: Only authenticated admin can create hero
export async function POST(request) {
  // Verify authentication
  const authResult = await requireAdmin(request)
  if (authResult instanceof NextResponse) {
    return authResult // Return error response if not authenticated
  }

  try {
    const body = await request.json()
    const hero = await heroService.create(body)
    return NextResponse.json(hero, { status: 201 })
  } catch (error) {
    return NextResponse.json(
      { error: error.message || 'Failed to create hero' },
      { status: 500 }
    )
  }
}

// Protected: Only authenticated admin can update hero
export async function PUT(request) {
  // Verify authentication
  const authResult = await requireAdmin(request)
  if (authResult instanceof NextResponse) {
    return authResult // Return error response if not authenticated
  }

  try {
    const body = await request.json()
    const hero = await heroService.upsert(body)
    return NextResponse.json(hero)
  } catch (error) {
    return NextResponse.json(
      { error: error.message || 'Failed to update hero' },
      { status: 500 }
    )
  }
}




