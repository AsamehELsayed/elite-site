import { readFile, writeFile } from 'fs/promises'
import path from 'path'
import { defaultLocale, isLocaleSupported } from '@/lib/i18n'

const localesDir = path.join(process.cwd(), 'src', 'locales')

function resolveLocale(locale) {
  return isLocaleSupported(locale) ? locale : defaultLocale
}

export async function getTranslations(locale = defaultLocale) {
  const safeLocale = resolveLocale(locale)
  const filePath = path.join(localesDir, `${safeLocale}.json`)
  const content = await readFile(filePath, 'utf-8')
  return JSON.parse(content)
}

export async function updateTranslations(locale, data) {
  const safeLocale = resolveLocale(locale)

  if (!data || typeof data !== 'object' || Array.isArray(data)) {
    throw new Error('Translations must be a JSON object')
  }

  const filePath = path.join(localesDir, `${safeLocale}.json`)
  const serialized = `${JSON.stringify(data, null, 2)}\n`
  await writeFile(filePath, serialized, 'utf-8')
  return data
}


