import { useState } from 'react'
import VoteButtons from './VoteButtons'
import CommentForm from './CommentForm'
import { voteComment, createComment } from '../api/comments'
import styles from './Comment.module.css'

/**
 * Format relative time
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
 * Single comment with nested replies
 * @param {Object} comment - Comment data
 * @param {number} postId - Parent post ID 
 * @param {function} onScoreUpdate - Callback when score changes
 * @param {function} onReplyAdded - Callback when reply is added
 */
function Comment({ comment, postId, onScoreUpdate, onReplyAdded }) {
    const [showReplyForm, setShowReplyForm] = useState(false)
    const [submitting, setSubmitting] = useState(false)

    async function handleVote(value) {
        const result = await voteComment(comment.id, value)
        if (onScoreUpdate) {
            onScoreUpdate(comment.id, result.new_score)
        }
    }

    async function handleReply(content) {
        setSubmitting(true)
        try {
            await createComment(postId, {
                content,
                parent_id: comment.id
            })
            setShowReplyForm(false)
            if (onReplyAdded) {
                onReplyAdded()
            }
        } finally {
            setSubmitting(false)
        }
    }

    return (
        <div className={styles.comment}>
            <VoteButtons
                score={comment.score}
                onVote={handleVote}
            />

            <div className={styles.commentContent}>
                <p className={styles.commentText}>{comment.content}</p>

                <div className={styles.commentMeta}>
                    <span>{formatTimeAgo(comment.created_at)}</span>
                    <button
                        className={styles.replyBtn}
                        onClick={() => setShowReplyForm(!showReplyForm)}
                    >
                        {showReplyForm ? 'Cancel' : 'Reply'}
                    </button>
                </div>

                {showReplyForm && (
                    <div className={styles.replyForm}>
                        <CommentForm
                            onSubmit={handleReply}
                            submitting={submitting}
                            placeholder="Write a reply..."
                            buttonText="Reply"
                            compact
                        />
                    </div>
                )}

                {/* Nested replies */}
                {comment.replies && comment.replies.length > 0 && (
                    <div className={styles.replies}>
                        {comment.replies.map(reply => (
                            <Comment
                                key={reply.id}
                                comment={reply}
                                postId={postId}
                                onScoreUpdate={onScoreUpdate}
                                onReplyAdded={onReplyAdded}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}

export default Comment
