/**
 * Utility functions for making authenticated API requests
 */

/**
 * Get the authentication headers with Bearer token
 * @returns {Object} Headers object with Authorization
 */
export function getAuthHeaders({ includeJson = true } = {}) {
  const token = localStorage.getItem('token')
  const headers = {}

  if (includeJson) {
    headers['Content-Type'] = 'application/json'
  }

  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }

  return headers
}

/**
 * Make an authenticated API request
 * @param {string} url - The API endpoint URL
 * @param {Object} options - Fetch options (method, body, etc.)
 * @returns {Promise<Response>} The fetch response
 */
export async function authenticatedFetch(url, options = {}) {
  const isFormData = options.body instanceof FormData
  const headers = getAuthHeaders({ includeJson: !isFormData })
  
  const response = await fetch(url, {
    ...options,
    headers: {
      ...headers,
      ...options.headers
    }
  })

  // If unauthorized, redirect to login
  if (response.status === 401 || response.status === 403) {
    localStorage.removeItem('token')
    window.location.href = '/dashboard/login'
    throw new Error('Authentication required')
  }

  return response
}

async function parseJsonSafe(response) {
  const text = await response.text()
  if (!text) return null

  try {
    return JSON.parse(text)
  } catch (err) {
    const snippet = text.slice(0, 200).replace(/\s+/g, ' ').trim()
    const location = response?.url || 'request'
    const reason =
      snippet.startsWith('<!DOCTYPE') || snippet.startsWith('<html')
        ? 'Received HTML instead of JSON'
        : 'Invalid JSON response'

    const wrappedError = new Error(`${reason} from ${location}`)
    wrappedError.cause = err
    wrappedError.responseBody = snippet
    throw wrappedError
  }
}

/**
 * Make an authenticated GET request
 * @param {string} url - The API endpoint URL
 * @returns {Promise<any>} The JSON response data
 */
export async function apiGet(url) {
  const response = await authenticatedFetch(url, { method: 'GET' })
  const data = await parseJsonSafe(response)

  if (!response.ok) {
    throw new Error(data?.error || 'Request failed')
  }
  return data
}

/**
 * Make an authenticated POST request
 * @param {string} url - The API endpoint URL
 * @param {Object} data - The request body data
 * @returns {Promise<any>} The JSON response data
 */
export async function apiPost(url, data) {
  const response = await authenticatedFetch(url, {
    method: 'POST',
    body: JSON.stringify(data)
  })
  const responseData = await parseJsonSafe(response)
  if (!response.ok) {
    throw new Error(responseData.error || 'Request failed')
  }
  return responseData
}

/**
 * Make an authenticated PUT request
 * @param {string} url - The API endpoint URL
 * @param {Object} data - The request body data
 * @returns {Promise<any>} The JSON response data
 */
export async function apiPut(url, data) {
  const response = await authenticatedFetch(url, {
    method: 'PUT',
    body: JSON.stringify(data)
  })
  const responseData = await parseJsonSafe(response)
  if (!response.ok) {
    throw new Error(responseData.error || 'Request failed')
  }
  return responseData
}

/**
 * Make an authenticated DELETE request
 * @param {string} url - The API endpoint URL
 * @returns {Promise<any>} The JSON response data
 */
export async function apiDelete(url) {
  const response = await authenticatedFetch(url, { method: 'DELETE' })
  const responseData = await parseJsonSafe(response)
  if (!response.ok) {
    throw new Error(responseData.error || 'Request failed')
  }
  return responseData
}

