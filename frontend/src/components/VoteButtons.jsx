import { useState } from 'react'
import styles from './VoteButtons.module.css'

/**
 * Upvote/downvote buttons component
 * @param {number} score - Current score
 * @param {function} onVote - Callback with vote value (1 or -1)
 * @param {boolean} disabled - Disable voting
 */
function VoteButtons({ score = 0, onVote, disabled = false }) {
    const [voting, setVoting] = useState(false)
    const [userVote, setUserVote] = useState(null)

    async function handleVote(value) {
        if (voting || disabled) return

        setVoting(true)
        try {
            await onVote(value)
            setUserVote(value)
        } catch (err) {
            // Error handled by parent
        } finally {
            setVoting(false)
        }
    }

    const scoreClass = score > 0 ? styles.positive : score < 0 ? styles.negative : ''

    return (
        <div className={styles.voteButtons}>
            <button
                className={`${styles.voteBtn} ${styles.upvote} ${userVote === 1 ? styles.active : ''}`}
                onClick={() => handleVote(1)}
                disabled={voting || disabled}
                aria-label="Upvote"
            >
                <span className={styles.arrow}>▲</span>
            </button>

            <span className={`${styles.score} ${scoreClass}`}>
                {score}
            </span>

            <button
                className={`${styles.voteBtn} ${styles.downvote} ${userVote === -1 ? styles.active : ''}`}
                onClick={() => handleVote(-1)}
                disabled={voting || disabled}
                aria-label="Downvote"
            >
                <span className={styles.arrow}>▼</span>
            </button>
        </div>
    )
}

export default VoteButtons
