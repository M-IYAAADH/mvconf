import { useParams, useLocation, Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import VoteButtons from '../components/VoteButtons'
import Comment from '../components/Comment'
import CommentForm from '../components/CommentForm'
import { getNewPosts, votePost } from '../api/posts'
import { createComment } from '../api/comments'
import useComments from '../hooks/useComments'
import styles from './PostDetail.module.css'

function PostDetail() {
    const { id } = useParams()
    const location = useLocation()

    // Try to get post from navigation state first
    const [post, setPost] = useState(location.state?.post || null)
    const [postLoading, setPostLoading] = useState(!location.state?.post)
    const [submitting, setSubmitting] = useState(false)

    const {
        comments,
        loading: commentsLoading,
        refetch: refetchComments,
        updateCommentScore
    } = useComments(id)

    // Fallback: Try to find post in "new" list if not in state
    useEffect(() => {
        if (post) return

        async function findPost() {
            try {
                const data = await getNewPosts()
                const found = data.posts.find(p => p.id === parseInt(id))
                if (found) {
                    setPost(found)
                }
            } catch (err) {
                console.error('Failed to find post:', err)
            } finally {
                setPostLoading(false)
            }
        }

        findPost()
    }, [id, post])

    async function handleVote(value) {
        if (!post) return
        const result = await votePost(post.id, value)
        setPost(prev => ({ ...prev, score: result.new_score }))
    }

    async function handleComment(content) {
        setSubmitting(true)
        try {
            await createComment(id, { content })
            await refetchComments()
        } finally {
            setSubmitting(false)
        }
    }

    if (postLoading) {
        return (
            <div className="container loading">
                <div className="loading-spinner"></div>
            </div>
        )
    }

    if (!post) {
        return (
            <div className="container">
                <div className={styles.noPost}>
                    <h3>Post not found</h3>
                    <p>
                        This post content could not be loaded directly.
                        <br />
                        Please try finding it on the <Link to="/" style={{ color: 'var(--color-accent)' }}>Home</Link> or <Link to="/new" style={{ color: 'var(--color-accent)' }}>New</Link> pages.
                    </p>
                </div>
            </div>
        )
    }

    return (
        <div className={styles.container}>
            {/* Post Content */}
            <article className={styles.card}>
                <VoteButtons
                    score={post.score}
                    onVote={handleVote}
                />

                <div className={styles.cardContent}>
                    <div className={styles.header}>
                        {post.category && (
                            <span className={`category-badge ${post.category}`}>
                                {post.category.replace('_', ' ')}
                            </span>
                        )}
                    </div>

                    <h1 className={styles.title}>{post.title}</h1>
                    <p className={styles.content}>{post.content}</p>

                    <div className={styles.meta}>
                        <span>{new Date(post.created_at).toLocaleString()}</span>
                    </div>
                </div>
            </article>

            {/* Comments Section */}
            <div className={styles.commentsSection}>
                <div className={styles.commentsHeader}>
                    <h2 className={styles.commentCount}>
                        Comments
                    </h2>
                </div>

                <CommentForm
                    onSubmit={handleComment}
                    submitting={submitting}
                />

                <div className={styles.commentList}>
                    {commentsLoading ? (
                        <div className="loading">
                            <div className="loading-spinner"></div>
                        </div>
                    ) : comments.length === 0 ? (
                        <p style={{ color: 'var(--color-text-muted)', textAlign: 'center', margin: '2rem 0' }}>
                            No comments yet. Be the first to share your thoughts.
                        </p>
                    ) : (
                        comments.map(comment => (
                            <Comment
                                key={comment.id}
                                comment={comment}
                                postId={post.id}
                                onScoreUpdate={updateCommentScore}
                                onReplyAdded={refetchComments}
                            />
                        ))
                    )}
                </div>
            </div>
        </div>
    )
}

export default PostDetail
