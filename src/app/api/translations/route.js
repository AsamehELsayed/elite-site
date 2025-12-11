import { NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/auth'
import { defaultLocale, isLocaleSupported } from '@/lib/i18n'
import { getTranslations, updateTranslations } from '@/services/translationService'

function getLocaleFromRequest(request) {
  const lang = request.nextUrl.searchParams.get('lang')
  return isLocaleSupported(lang) ? lang : defaultLocale
}

export async function GET(request) {
  const authResult = await requireAdmin(request)
  if (authResult instanceof NextResponse) {
    return authResult
  }

  try {
    const locale = getLocaleFromRequest(request)
    const data = await getTranslations(locale)
    return NextResponse.json({ locale, data })
  } catch (error) {
    return NextResponse.json(
      { error: error.message || 'Failed to read translations' },
      { status: 500 }
    )
  }
}

export async function PUT(request) {
  const authResult = await requireAdmin(request)
  if (authResult instanceof NextResponse) {
    return authResult
  }

  try {
    const locale = getLocaleFromRequest(request)
    const body = await request.json()
    const payload = body?.translations ?? body?.data ?? body

    if (!payload) {
      return NextResponse.json(
        { error: 'No translations provided' },
        { status: 400 }
      )
    }

    const updated = await updateTranslations(locale, payload)
    return NextResponse.json({ locale, data: updated })
  } catch (error) {
    return NextResponse.json(
      { error: error.message || 'Failed to update translations' },
      { status: 500 }
    )
  }
}


