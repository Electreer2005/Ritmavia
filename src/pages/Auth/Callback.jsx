import { Link } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import AuthLayout from './AuthLayout'
import styles from './Auth.module.css'
export default function Callback() {
  const { user, loading } = useAuth()
  return <AuthLayout title={loading ? 'Verificando tu correo…' : user ? 'Ya estás en Ritmavia' : 'Revisemos tu acceso'} description={user ? 'Tu sesión está lista. Tu música te espera.' : 'Si el enlace venció, iniciá sesión o volvé a registrarte para solicitar la confirmación.'}>
    {loading ? <p role="status">Un momento…</p> : <Link className={styles.primary} to={user ? '/perfil' : '/login'}>{user ? 'Ir a mi perfil' : 'Iniciar sesión'}</Link>}
  </AuthLayout>
}
