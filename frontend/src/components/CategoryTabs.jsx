import styles from './CategoryTabs.module.css'

const CATEGORIES = [
    { id: null, label: 'All' },
    { id: 'island', label: 'Island Life' },
    { id: 'relationship', label: 'Relationships' },
    { id: 'work', label: 'Work' },
    { id: 'society', label: 'Society' },
    { id: 'dark', label: 'Dark' },
    { id: 'funny', label: 'Funny' },
]

/**
 * Category filter tabs
 * @param {string|null} selected - Selected category ID
 * @param {function} onSelect - Callback with category ID
 */
function CategoryTabs({ selected = null, onSelect }) {
    return (
        <div className={styles.tabs}>
            {CATEGORIES.map(cat => (
                <button
                    key={cat.id ?? 'all'}
                    className={`${styles.tab} ${selected === cat.id ? styles.active : ''} ${cat.id ? styles[cat.id] : ''}`}
                    onClick={() => onSelect(cat.id)}
                >
                    {cat.label}
                </button>
            ))}
        </div>
    )
}

export default CategoryTabs
export { CATEGORIES }
