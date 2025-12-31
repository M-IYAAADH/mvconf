import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import PostCard from '../components/PostCard'
import usePosts from '../hooks/usePosts'
import { CATEGORIES } from '../components/CategoryTabs'

function Search() {
    const [searchParams, setSearchParams] = useSearchParams()

    // Local state for form
    const [q, setQ] = useState(searchParams.get('q') || '')
    const [category, setCategory] = useState(searchParams.get('category') || '')
    const [sort, setSort] = useState(searchParams.get('sort') || 'hot')
    const [time, setTime] = useState(searchParams.get('time') || 'all')

    // Hook params
    const queryParams = {
        q: searchParams.get('q'),
        category: searchParams.get('category'),
        sort: searchParams.get('sort') || 'hot',
        time: searchParams.get('time') || 'all'
    }

    const { posts, loading, error, refetch, updatePostScore } = usePosts('search', queryParams)

    // Update URL when form is submitted
    function handleSearch(e) {
        e.preventDefault()
        const newParams = { sort, time }
        if (q) newParams.q = q
        if (category) newParams.category = category
        setSearchParams(newParams)
    }

    return (
        <div className="container">
            <div style={{
                marginBottom: 'var(--space-xl)',
                padding: 'var(--space-lg)',
                background: 'var(--color-bg-secondary)',
                borderRadius: 'var(--radius-lg)',
                border: '1px solid var(--color-border)'
            }}>
                <form onSubmit={handleSearch} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
                    <div style={{ display: 'flex', gap: 'var(--space-md)' }}>
                        <input
                            type="text"
                            className="input"
                            placeholder="Search confessions..."
                            value={q}
                            onChange={(e) => setQ(e.target.value)}
                            style={{ flex: 1 }}
                        />
                        <button type="submit" className="btn btn-primary" style={{ minWidth: '100px' }}>
                            Search
                        </button>
                    </div>

                    <div style={{ display: 'flex', gap: 'var(--space-md)', flexWrap: 'wrap' }}>
                        <select
                            className="input select"
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                            style={{ flex: 1, minWidth: '140px' }}
                        >
                            <option value="">All Categories</option>
                            {CATEGORIES.filter(c => c.id).map(c => (
                                <option key={c.id} value={c.id}>{c.label}</option>
                            ))}
                        </select>

                        <select
                            className="input select"
                            value={sort}
                            onChange={(e) => setSort(e.target.value)}
                            style={{ flex: 1, minWidth: '140px' }}
                        >
                            <option value="hot">Hot</option>
                            <option value="top">Top</option>
                            <option value="new">New</option>
                        </select>

                        <select
                            className="input select"
                            value={time}
                            onChange={(e) => setTime(e.target.value)}
                            style={{ flex: 1, minWidth: '140px' }}
                        >
                            <option value="all">All Time</option>
                            <option value="24h">Past 24 Hours</option>
                            <option value="7d">Past Week</option>
                        </select>
                    </div>
                </form>
            </div>

            {loading ? (
                <div className="loading">
                    <div className="loading-spinner"></div>
                </div>
            ) : posts.length === 0 ? (
                <div className="empty-state">
                    <h3>No results found</h3>
                    <p>Try adjusting your search filters.</p>
                </div>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {posts.map(post => (
                        <PostCard
                            key={post.id}
                            post={post}
                            onScoreUpdate={updatePostScore}
                        />
                    ))}
                </div>
            )}
        </div>
    )
}

export default Search
