import { Link } from 'react-router-dom'
import Logo from '../../assets/Logo.png'
import { isSupabaseConfigured } from '../../lib/supabase'
import styles from './Auth.module.css'
export default function AuthLayout({ title, description, children }) {
  return <section className={styles.wrapper}>
    <div className={styles.card}>
      <Link className={styles.brand} to="/"><img src={Logo} alt="Ritmavia" /></Link>
      <span className={styles.eyebrow}>TU MÚSICA, A TU RITMO</span>
      <h1>{title}</h1><p className={styles.description}>{description}</p>
      {!isSupabaseConfigured && <p className={styles.error} role="alert">Falta conectar Supabase. Completá VITE_SUPABASE_URL y VITE_SUPABASE_PUBLISHABLE_KEY en .env.local y reiniciá Vite.</p>}
      {children}
    </div>
  </section>
}
