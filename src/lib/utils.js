import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs) {
  return twMerge(clsx(inputs))
}

/**
 * Safely parse JSON string, returning defaultValue on error or empty string
 * @param {string} jsonString - The JSON string to parse
 * @param {any} defaultValue - The default value to return on parse error (defaults to null)
 * @returns {any} The parsed JSON or defaultValue
 */
export function safeJsonParse(jsonString, defaultValue = null) {
  if (!jsonString || typeof jsonString !== 'string' || jsonString.trim() === '') {
    return defaultValue
  }
  
  try {
    return JSON.parse(jsonString)
  } catch (error) {
    console.error('JSON parse error:', error.message, 'Input:', jsonString.slice(0, 100))
    return defaultValue
  }
}

