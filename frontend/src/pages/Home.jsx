import { useState } from 'react'
import PostCard from '../components/PostCard'
import CategoryTabs from '../components/CategoryTabs'
import usePosts from '../hooks/usePosts'

function Home() {
    const [category, setCategory] = useState(null)
    const { posts, loading, error, refetch, updatePostScore } = usePosts('hot', { category })

    if (error) {
        return (
            <div className="container">
                <div className="error-message">
                    Error loading posts: {error}
                    <button className="btn btn-secondary" onClick={refetch} style={{ marginLeft: '1rem' }}>
                        Retry
                    </button>
                </div>
            </div>
        )
    }

    return (
        <div className="container">
            <CategoryTabs selected={category} onSelect={setCategory} />

            {loading ? (
                <div className="loading">
                    <div className="loading-spinner"></div>
                </div>
            ) : posts.length === 0 ? (
                <div className="empty-state">
                    <h3>No posts found</h3>
                    <p>Be the first to confess something!</p>
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

export default Home
