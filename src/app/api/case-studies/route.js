import { NextResponse } from 'next/server'
import { caseStudyService } from '@/services/caseStudyService'

export async function GET() {
  try {
    const caseStudies = await caseStudyService.getAll()
    return NextResponse.json(caseStudies)
  } catch (error) {
    return NextResponse.json(
      { error: error.message || 'Failed to fetch case studies' },
      { status: 500 }
    )
  }
}

export async function POST(request) {
  try {
    const body = await request.json()
    const caseStudy = await caseStudyService.create(body)
    return NextResponse.json(caseStudy, { status: 201 })
  } catch (error) {
    return NextResponse.json(
      { error: error.message || 'Failed to create case study' },
      { status: 500 }
    )
  }
}



