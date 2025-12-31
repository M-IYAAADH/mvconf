import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { createPost } from '../api/posts'
import { CATEGORIES } from '../components/CategoryTabs'
import styles from './CreatePost.module.css'

function CreatePost() {
    const navigate = useNavigate()
    const [submitting, setSubmitting] = useState(false)
    const [error, setError] = useState(null)

    const [formData, setFormData] = useState({
        title: '',
        content: '',
        category: 'island'
    })

    // Filter out 'All' option from categories
    const categoryOptions = CATEGORIES.filter(c => c.id !== null)

    function handleChange(e) {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value }))
    }

    async function handleSubmit(e) {
        e.preventDefault()

        if (!formData.title.trim() || !formData.content.trim()) {
            setError('Title and content are required')
            return
        }

        setSubmitting(true)
        setError(null)

        try {
            await createPost(formData)
            navigate('/new')
        } catch (err) {
            setError(err.message)
            setSubmitting(false)
        }
    }

    return (
        <div className="container">
            <div className={styles.wrapper}>
                <h1 className={styles.heading}>Make a Confession</h1>

                {error && <div className="error-message">{error}</div>}

                <form onSubmit={handleSubmit} className={styles.form}>
                    <div className={styles.field}>
                        <label htmlFor="title" className={styles.label}>Title</label>
                        <input
                            type="text"
                            id="title"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            placeholder="Give your confession a title"
                            className="input"
                            maxLength={120}
                            required
                        />
                    </div>

                    <div className={styles.field}>
                        <label htmlFor="category" className={styles.label}>Category</label>
                        <div className="select-wrapper">
                            <select
                                id="category"
                                name="category"
                                value={formData.category}
                                onChange={handleChange}
                                className="input select"
                            >
                                {categoryOptions.map(cat => (
                                    <option key={cat.id} value={cat.id}>
                                        {cat.label}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className={styles.field}>
                        <label htmlFor="content" className={styles.label}>Content</label>
                        <textarea
                            id="content"
                            name="content"
                            value={formData.content}
                            onChange={handleChange}
                            placeholder="Type your confession here... (max 2000 chars)"
                            className="input textarea"
                            maxLength={2000}
                            required
                        />
                    </div>

                    <div className={styles.actions}>
                        <button
                            type="button"
                            className="btn btn-secondary"
                            onClick={() => navigate(-1)}
                            disabled={submitting}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="btn btn-primary"
                            disabled={submitting}
                        >
                            {submitting ? 'Posting...' : 'Post Confession'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default CreatePost
