/**
 * Utility functions for making authenticated API requests
 */

/**
 * Get the authentication headers with Bearer token
 * @returns {Object} Headers object with Authorization
 */
export function getAuthHeaders() {
  const token = localStorage.getItem('token')
  return {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` })
  }
}

/**
 * Make an authenticated API request
 * @param {string} url - The API endpoint URL
 * @param {Object} options - Fetch options (method, body, etc.)
 * @returns {Promise<Response>} The fetch response
 */
export async function authenticatedFetch(url, options = {}) {
  const headers = getAuthHeaders()
  
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

/**
 * Make an authenticated GET request
 * @param {string} url - The API endpoint URL
 * @returns {Promise<any>} The JSON response data
 */
export async function apiGet(url) {
  const response = await authenticatedFetch(url, { method: 'GET' })
  
  // Handle empty responses
  const contentType = response.headers.get('content-type')
  if (!contentType || !contentType.includes('application/json')) {
    return null
  }
  
  const data = await response.json()
  
  // Handle null or undefined data
  if (data === null || data === undefined) {
    return null
  }
  
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
  const responseData = await response.json()
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
  const responseData = await response.json()
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
  const responseData = await response.json()
  if (!response.ok) {
    throw new Error(responseData.error || 'Request failed')
  }
  return responseData
}

