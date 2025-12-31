/**
 * Hook for fetching posts
 */
import { useState, useEffect, useCallback } from 'react'
import { getHotPosts, getNewPosts, searchPosts } from '../api/posts'

/**
 * @param {string} type - 'hot' | 'new' | 'search'
 * @param {Object} params - Search parameters (for search type)
 */
export function usePosts(type = 'hot', params = {}) {
    const [posts, setPosts] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    const fetchPosts = useCallback(async () => {
        setLoading(true)
        setError(null)

        try {
            let data

            switch (type) {
                case 'new':
                    data = await getNewPosts()
                    setPosts(data.posts || [])
                    break
                case 'search':
                    data = await searchPosts(params)
                    setPosts(data.results || [])
                    break
                case 'hot':
                default:
                    data = await getHotPosts(params.category)
                    setPosts(data.results || [])
                    break
            }
        } catch (err) {
            setError(err.message)
            setPosts([])
        } finally {
            setLoading(false)
        }
    }, [type, params.category, params.q, params.sort, params.time])

    useEffect(() => {
        fetchPosts()
    }, [fetchPosts])

    const refetch = useCallback(() => {
        fetchPosts()
    }, [fetchPosts])

    // Update a single post's score (for optimistic updates)
    const updatePostScore = useCallback((postId, newScore) => {
        setPosts(current =>
            current.map(post =>
                post.id === postId ? { ...post, score: newScore } : post
            )
        )
    }, [])

    return { posts, loading, error, refetch, updatePostScore }
}

export default usePosts
