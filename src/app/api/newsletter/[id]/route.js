import { NextResponse } from 'next/server'
import { newsletterService } from '@/services/newsletterService'
import { requireAdmin } from '@/lib/auth'

// Protected: Only authenticated admin can update newsletter subscription
export async function PUT(request, { params }) {
  // Verify authentication
  const authResult = await requireAdmin(request)
  if (authResult instanceof NextResponse) {
    return authResult // Return error response if not authenticated
  }

  try {
    const { id } = params
    const body = await request.json()
    const { status } = body

    if (!status || !['active', 'unsubscribed'].includes(status)) {
      return NextResponse.json(
        { error: 'Valid status (active or unsubscribed) is required' },
        { status: 400 }
      )
    }

    const subscription = await newsletterService.updateStatus(id, status)
    return NextResponse.json(subscription)
  } catch (error) {
    return NextResponse.json(
      { error: error.message || 'Failed to update newsletter subscription' },
      { status: 500 }
    )
  }
}

// Protected: Only authenticated admin can delete newsletter subscription
export async function DELETE(request, { params }) {
  // Verify authentication
  const authResult = await requireAdmin(request)
  if (authResult instanceof NextResponse) {
    return authResult // Return error response if not authenticated
  }

  try {
    const { id } = params
    await newsletterService.delete(id)
    return NextResponse.json({ message: 'Newsletter subscription deleted successfully' })
  } catch (error) {
    return NextResponse.json(
      { error: error.message || 'Failed to delete newsletter subscription' },
      { status: 500 }
    )
  }
}


