import { NextResponse } from 'next/server'
import { contactBookingService } from '@/services/contactBookingService'
import { requireAdmin } from '@/lib/auth'

// Protected: Only authenticated admin can view contact bookings
export async function GET(request) {
  // Verify authentication
  const authResult = await requireAdmin(request)
  if (authResult instanceof NextResponse) {
    return authResult // Return error response if not authenticated
  }

  try {
    const bookings = await contactBookingService.getAll()
    return NextResponse.json(bookings)
  } catch (error) {
    return NextResponse.json(
      { error: error.message || 'Failed to fetch contact bookings' },
      { status: 500 }
    )
  }
}

// Public: Guest users can submit contact forms
export async function POST(request) {
  try {
    const body = await request.json()
    
    // Validate required fields
    if (!body.name || !body.email) {
      return NextResponse.json(
        { error: 'Name and email are required' },
        { status: 400 }
      )
    }

    const booking = await contactBookingService.create(body)
    return NextResponse.json(booking, { status: 201 })
  } catch (error) {
    return NextResponse.json(
      { error: error.message || 'Failed to create contact booking' },
      { status: 500 }
    )
  }
}

