/**
 * Hook for anonymous user identity
 * Calls /whoami/ to get user pseudonym
 * Does NOT store user ID anywhere (privacy)
 */
import { useState, useEffect } from 'react'
import { get } from '../api/client'

export function useAnonUser() {
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        let mounted = true

        async function fetchUser() {
            try {
                const data = await get('/whoami/')
                if (mounted) {
                    setUser(data)
                    setError(null)
                }
            } catch (err) {
                if (mounted) {
                    setError(err.message)
                }
            } finally {
                if (mounted) {
                    setLoading(false)
                }
            }
        }

        fetchUser()

        return () => {
            mounted = false
        }
    }, [])

    return { user, loading, error }
}

export default useAnonUser
