import { useState } from 'react'
import { Link, Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { supabase } from '../../lib/supabase'
import { authError, safeReturnPath } from '../../lib/authUtils'
import AuthLayout from './AuthLayout'
import PasswordField from './PasswordField'
import styles from './Auth.module.css'
export default function Login() {
  const { user, loading, recovery } = useAuth()
  const { state } = useLocation()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  if (loading) return <p role="status">Cargando tu sesión…</p>
  if (user) return <Navigate replace to={recovery ? '/restablecer' : safeReturnPath(state?.from)} />
  async function submit(event) {
    event.preventDefault()
    if (!supabase || busy) return
    setBusy(true); setError('')
    try {
      const { error } = await supabase.auth.signInWithPassword({ email: email.trim(), password })
      if (error) throw error
    } catch (error) { setError(authError(error)) }
    finally { setBusy(false) }
  }
  return <AuthLayout title="Qué bueno verte" description="Ingresá a tu cuenta y seguí escuchando.">
    <form className={styles.form} onSubmit={submit}>
      <div className={styles.field}><label htmlFor="login-email">Correo electrónico</label><input id="login-email" type="email" required autoComplete="email" value={email} onChange={e => setEmail(e.target.value)} /></div>
      <PasswordField minLength={1} value={password} onChange={e => setPassword(e.target.value)} />
      <Link className={styles.textLink} to="/recuperar">¿Olvidaste tu contraseña?</Link>
      {error && <p className={styles.error} role="alert">{error}</p>}
      <button className={styles.primary} disabled={busy || !supabase}>{busy ? 'Ingresando…' : 'Iniciar sesión'}</button>
    </form>
    <p className={styles.footer}>¿Todavía no tenés cuenta? <Link to="/registro" state={state}>Registrate</Link></p>
  </AuthLayout>
}
