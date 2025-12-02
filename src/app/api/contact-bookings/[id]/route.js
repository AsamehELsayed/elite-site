import { NextResponse } from 'next/server'
import { contactBookingService } from '@/services/contactBookingService'

export async function GET(request, { params }) {
  try {
    const { id } = params
    const booking = await contactBookingService.getById(id)
    if (!booking) {
      return NextResponse.json(
        { error: 'Contact booking not found' },
        { status: 404 }
      )
    }
    return NextResponse.json(booking)
  } catch (error) {
    return NextResponse.json(
      { error: error.message || 'Failed to fetch contact booking' },
      { status: 500 }
    )
  }
}

export async function PUT(request, { params }) {
  try {
    const { id } = params
    const body = await request.json()
    const booking = await contactBookingService.update(id, body)
    return NextResponse.json(booking)
  } catch (error) {
    return NextResponse.json(
      { error: error.message || 'Failed to update contact booking' },
      { status: 500 }
    )
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = params
    await contactBookingService.delete(id)
    return NextResponse.json({ message: 'Contact booking deleted successfully' })
  } catch (error) {
    return NextResponse.json(
      { error: error.message || 'Failed to delete contact booking' },
      { status: 500 }
    )
  }
}

