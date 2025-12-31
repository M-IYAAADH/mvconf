import PostCard from '../components/PostCard'
import usePosts from '../hooks/usePosts'

function New() {
    const { posts, loading, error, refetch, updatePostScore } = usePosts('new')

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
            <h1 style={{ fontSize: 'var(--text-xl)', marginBottom: 'var(--space-lg)', fontWeight: 'bold' }}>
                Latest Confessions
            </h1>

            {loading ? (
                <div className="loading">
                    <div className="loading-spinner"></div>
                </div>
            ) : posts.length === 0 ? (
                <div className="empty-state">
                    <h3>No posts found</h3>
                    <p>It's quiet... too quiet.</p>
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

export default New
