import { Link, useLocation, useNavigate, useSearchParams } from 'react-router-dom'
import { Search, User } from 'lucide-react';
import styles from './Header.module.css';

import { useAuth } from '../../hooks/useAuth'

export default function Header() {
  const { user, loading } = useAuth()
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const [params] = useSearchParams()
  const query = pathname === '/buscar' ? params.get('q') || '' : ''
  return (
    <header className={styles.header}>
      <span className={styles.title}>HECHO PARA ESCUCHAR</span>
      <div className={styles.search}>
        <Search size={21} className={styles.icon}/>
        <input aria-label="Buscar canciones o artistas" placeholder="¿Qué querés escuchar?" value={query} onChange={event => {
          const search = new URLSearchParams()
          if (event.target.value) search.set('q', event.target.value)
          navigate({ pathname: '/buscar', search: search.toString() }, { replace: pathname === '/buscar' })
        }} />
      </div>
      {!loading && <Link className={styles.authLink} to={user ? '/perfil' : '/login'}><User size={18} aria-hidden="true" /><span>{user ? (user.user_metadata?.full_name || 'Mi perfil') : 'Ingresar'}</span></Link>}
    </header>
  )
}
