/**
 * Central API client with cookie credentials
 * All API calls MUST go through this client
 */

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

/**
 * Base fetch wrapper with credentials and error handling
 */
async function request(endpoint, options = {}) {
    const url = `${API_URL}${endpoint}`

    const config = {
        ...options,
        credentials: 'include', // CRITICAL: Required for anonymous identity
        headers: {
            'Content-Type': 'application/json',
            ...options.headers,
        },
    }

    try {
        const response = await fetch(url, config)

        // Parse JSON response
        const data = await response.json()

        if (!response.ok) {
            // Backend returns { error: "message" } for errors
            throw new Error(data.error || `Request failed with status ${response.status}`)
        }

        return data
    } catch (error) {
        // Re-throw with better context
        if (error.message === 'Failed to fetch') {
            throw new Error('Unable to connect to server. Please check your connection.')
        }
        throw error
    }
}

/**
 * GET request
 */
export function get(endpoint) {
    return request(endpoint, { method: 'GET' })
}

/**
 * POST request with JSON body
 */
export function post(endpoint, body) {
    return request(endpoint, {
        method: 'POST',
        body: JSON.stringify(body),
    })
}

export default { get, post }
