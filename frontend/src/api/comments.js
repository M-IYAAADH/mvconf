/**
 * Comments API functions
 */
import { get, post } from './client'

/**
 * Get comments for a post
 * @param {number} postId - Post ID
 */
export function getComments(postId) {
    return get(`/posts/${postId}/comments/`)
}

/**
 * Create a new comment
 * @param {number} postId - Post ID
 * @param {Object} data - Comment data
 * @param {string} data.content - Comment content
 * @param {number} data.parent_id - Parent comment ID (for replies)
 */
export function createComment(postId, data) {
    return post(`/posts/${postId}/comments/create/`, data)
}

/**
 * Vote on a comment
 * @param {number} commentId - Comment ID
 * @param {number} value - Vote value: 1 (upvote) or -1 (downvote)
 */
export function voteComment(commentId, value) {
    return post(`/comments/${commentId}/vote/`, { value })
}
