/**
 * Hook for fetching comments
 */
import { useState, useEffect, useCallback } from 'react'
import { getComments } from '../api/comments'

/**
 * @param {number} postId - Post ID to fetch comments for
 */
export function useComments(postId) {
    const [comments, setComments] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    const fetchComments = useCallback(async () => {
        if (!postId) return

        setLoading(true)
        setError(null)

        try {
            const data = await getComments(postId)
            setComments(data.comments || [])
        } catch (err) {
            setError(err.message)
            setComments([])
        } finally {
            setLoading(false)
        }
    }, [postId])

    useEffect(() => {
        fetchComments()
    }, [fetchComments])

    const refetch = useCallback(() => {
        fetchComments()
    }, [fetchComments])

    // Recursive function to update comment score in nested structure
    const updateCommentScore = useCallback((commentId, newScore) => {
        const updateNested = (items) => {
            return items.map(comment => {
                if (comment.id === commentId) {
                    return { ...comment, score: newScore }
                }
                if (comment.replies && comment.replies.length > 0) {
                    return { ...comment, replies: updateNested(comment.replies) }
                }
                return comment
            })
        }

        setComments(current => updateNested(current))
    }, [])

    return { comments, loading, error, refetch, updateCommentScore }
}

export default useComments
