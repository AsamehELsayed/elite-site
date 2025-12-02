import { NextResponse } from 'next/server'
import { statService } from '@/services/statService'

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

export async function POST(request) {
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



