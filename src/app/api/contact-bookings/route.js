import { NextResponse } from 'next/server'
import { contactBookingService } from '@/services/contactBookingService'

export async function GET() {
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

export async function POST(request) {
  try {
    const body = await request.json()
    const booking = await contactBookingService.create(body)
    return NextResponse.json(booking, { status: 201 })
  } catch (error) {
    return NextResponse.json(
      { error: error.message || 'Failed to create contact booking' },
      { status: 500 }
    )
  }
}

