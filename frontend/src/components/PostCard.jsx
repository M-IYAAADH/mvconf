import { Link } from 'react-router-dom'
import VoteButtons from './VoteButtons'
import { votePost } from '../api/posts'
import styles from './PostCard.module.css'

/**
 * Format relative time (e.g., "2h ago", "3d ago")
 */
function formatTimeAgo(dateString) {
    const date = new Date(dateString)
    const now = new Date()
    const seconds = Math.floor((now - date) / 1000)

    if (seconds < 60) return 'just now'
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`
    if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`
    return date.toLocaleDateString()
}

/**
 * Post card component
 * @param {Object} post - Post data
 * @param {function} onScoreUpdate - Optional callback when score changes
 */
function PostCard({ post, onScoreUpdate }) {
    async function handleVote(value) {
        const result = await votePost(post.id, value)
        if (onScoreUpdate) {
            onScoreUpdate(post.id, result.new_score)
        }
    }

    return (
        <article className={styles.card}>
            <VoteButtons
                score={post.score}
                onVote={handleVote}
            />

            <div className={styles.cardContent}>
                <Link to={`/post/${post.id}`} className={styles.cardLink}>
                    <div className={styles.header}>
                        {post.category && (
                            <span className={`category-badge ${post.category}`}>
                                {post.category.replace('_', ' ')}
                            </span>
                        )}
                    </div>

                    <h2 className={styles.title}>{post.title}</h2>
                    <p className={styles.content}>{post.content}</p>
                </Link>

                <div className={styles.meta}>
                    <span className={styles.metaItem}>
                        {formatTimeAgo(post.created_at)}
                    </span>
                </div>
            </div>
        </article>
    )
}

export default PostCard
