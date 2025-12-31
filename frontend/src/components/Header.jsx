import { Link, NavLink } from 'react-router-dom'
import styles from './Header.module.css'

function Header() {
    return (
        <header className={styles.header}>
            <div className={styles.headerContent}>
                <Link to="/" className={styles.logo}>
                    <span className={styles.logoIcon}>M</span>
                    <span>MVConf</span>
                </Link>

                <nav className={styles.nav}>
                    <NavLink
                        to="/"
                        end
                        className={({ isActive }) =>
                            `${styles.navLink} ${isActive ? styles.active : ''}`
                        }
                    >
                        <span>🔥</span> <span>Hot</span>
                    </NavLink>

                    <NavLink
                        to="/new"
                        className={({ isActive }) =>
                            `${styles.navLink} ${isActive ? styles.active : ''}`
                        }
                    >
                        <span>✨</span> <span>New</span>
                    </NavLink>

                    <NavLink
                        to="/search"
                        className={({ isActive }) =>
                            `${styles.navLink} ${isActive ? styles.active : ''}`
                        }
                    >
                        <span>🔍</span> <span>Search</span>
                    </NavLink>
                </nav>

                <Link to="/create" className={styles.createBtn}>
                    <span className={styles.createIcon}>+</span>
                    <span>Confess</span>
                </Link>
            </div>
        </header>
    )
}

export default Header
