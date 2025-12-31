import { useState } from 'react'
import styles from './CommentForm.module.css'

/**
 * Comment form component
 * @param {function} onSubmit - Callback with comment content
 * @param {boolean} submitting - Loading state
 * @param {string} placeholder - Textarea placeholder
 * @param {string} buttonText - Submit button text
 * @param {boolean} compact - Use compact variant
 */
function CommentForm({
    onSubmit,
    submitting = false,
    placeholder = 'Write a comment...',
    buttonText = 'Comment',
    compact = false
}) {
    const [content, setContent] = useState('')
    const [error, setError] = useState(null)

    async function handleSubmit(e) {
        e.preventDefault()

        const trimmed = content.trim()
        if (!trimmed) {
            setError('Comment cannot be empty')
            return
        }

        if (trimmed.length > 1000) {
            setError('Comment is too long (max 1000 characters)')
            return
        }

        setError(null)

        try {
            await onSubmit(trimmed)
            setContent('')
        } catch (err) {
            setError(err.message)
        }
    }

    return (
        <form
            className={`${styles.form} ${compact ? styles.compact : ''}`}
            onSubmit={handleSubmit}
        >
            <textarea
                className={styles.textarea}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder={placeholder}
                disabled={submitting}
                maxLength={1000}
            />

            {error && <p className={styles.error}>{error}</p>}

            <div className={styles.actions}>
                <button
                    type="submit"
                    className={styles.submitBtn}
                    disabled={submitting || !content.trim()}
                >
                    {submitting ? 'Posting...' : buttonText}
                </button>
            </div>
        </form>
    )
}

export default CommentForm
