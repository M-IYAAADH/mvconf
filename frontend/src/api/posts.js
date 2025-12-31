/**
 * Posts API functions
 */
import { get, post } from './client'

/**
 * Get hot posts (sorted by hot_score)
 */
export function getHotPosts(category = null) {
    let endpoint = '/posts/search/?sort=hot'
    if (category) {
        endpoint += `&category=${encodeURIComponent(category)}`
    }
    return get(endpoint)
}

/**
 * Get new posts (sorted by created_at)
 */
export function getNewPosts() {
    return get('/posts/')
}

/**
 * Search posts with filters
 * @param {Object} params - Search parameters
 * @param {string} params.q - Search query
 * @param {string} params.category - Category filter
 * @param {string} params.sort - Sort order: hot | new | top
 * @param {string} params.time - Time filter: 24h | 7d | all
 */
export function searchPosts({ q, category, sort, time } = {}) {
    const params = new URLSearchParams()

    if (q) params.append('q', q)
    if (category) params.append('category', category)
    if (sort) params.append('sort', sort)
    if (time) params.append('time', time)

    const queryString = params.toString()
    return get(`/posts/search/${queryString ? `?${queryString}` : ''}`)
}

/**
 * Create a new post
 * @param {Object} data - Post data
 * @param {string} data.title - Post title
 * @param {string} data.content - Post content
 * @param {string} data.category - Post category
 */
export function createPost(data) {
    return post('/posts/create/', data)
}

/**
 * Vote on a post
 * @param {number} postId - Post ID
 * @param {number} value - Vote value: 1 (upvote) or -1 (downvote)
 */
export function votePost(postId, value) {
    return post(`/posts/${postId}/vote/`, { value })
}
