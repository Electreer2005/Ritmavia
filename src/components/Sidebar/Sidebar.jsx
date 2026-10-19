import { NavLink, Link } from 'react-router-dom'
import { Home, Search, Library, Heart, User, ChevronRight } from 'lucide-react'
import Logo from '../../assets/Logo.png'
import styles from './Sidebar.module.css'
import { useAuth } from '../../hooks/useAuth'

const links = [
  { path: '/', label: 'Inicio', mobileLabel: 'Inicio', icon: Home },
  { path: '/buscar', label: 'Buscar', mobileLabel: 'Buscar', icon: Search },
  { path: '/biblioteca', label: 'Tu biblioteca', mobileLabel: 'Biblioteca', icon: Library },
  { path: '/favoritos', label: 'Mis favoritos', mobileLabel: 'Favoritos', icon: Heart },
]

export default function Sidebar() {
  const { user } = useAuth()
  return (
    <aside className={styles.sidebar} aria-label="Navegación de Ritmavia">
      <Link className={styles.brand} to="/" aria-label="Ritmavia, ir al inicio">
        <img src={Logo} className={styles.logo} alt="Ritmavia" />
        <span className={styles.tagline}>Tu música, a tu ritmo.</span>
      </Link>

      <div className={styles.navigation}>
        <p className={styles.sectionLabel}>TU ESPACIO</p>
        <nav className={styles.navBar} aria-label="Navegación principal">
          {links.map(({ path, label, mobileLabel, icon: Icon }) => (
            <NavLink
              key={path}
              to={path}
              end={path === '/'}
              className={({ isActive }) =>
                `${styles.navItem} ${isActive ? styles.active : ''}`
              }
              aria-label={label}
            >
              <Icon size={21} className={styles.icon} aria-hidden="true" />
              <span className={styles.desktopLabel}>{label}</span>
              <span className={styles.mobileLabel}>{mobileLabel}</span>
            </NavLink>
          ))}
          <NavLink
            to="/perfil"
            className={({ isActive }) =>
              `${styles.navItem} ${styles.mobileProfile} ${isActive ? styles.active : ''}`
            }
          >
            <User size={21} className={styles.icon} aria-hidden="true" />
            <span>Perfil</span>
          </NavLink>
        </nav>
      </div>

      <div className={styles.bottom}>
        <div className={styles.brandNote}>
          <span className={styles.noteMark} aria-hidden="true"><i /><i /><i /><i /></span>
          <span>Un momento para vos.<small>Dale play a lo que te mueve.</small></span>
        </div>
        <NavLink
          to="/perfil"
          className={({ isActive }) =>
            `${styles.profile} ${isActive ? styles.profileActive : ''}`
          }
        >
          <span className={styles.avatar}><User size={20} aria-hidden="true" /></span>
          <span className={styles.profileText}>
            <strong>{user?.user_metadata?.full_name || 'Tu perfil'}</strong>
            <small>{user ? 'Tu cuenta' : 'Iniciá sesión'}</small>
          </span>
          <ChevronRight size={16} className={styles.chevron} aria-hidden="true" />
        </NavLink>
      </div>
    </aside>
  )
}
