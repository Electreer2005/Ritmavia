import { useState } from 'react'
import { Link, Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { supabase } from '../../lib/supabase'
import { authError, safeReturnPath } from '../../lib/authUtils'
import AuthLayout from './AuthLayout'
import PasswordField from './PasswordField'
import styles from './Auth.module.css'
export default function Register() {
  const { user, loading } = useAuth()
  const { state } = useLocation()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [sent, setSent] = useState(false)
  if (loading) return <p role="status">Cargando tu sesión…</p>
  if (user) return <Navigate to={safeReturnPath(state?.from)} replace />
  async function submit(event) {
    event.preventDefault()
    if (!supabase || busy) return
    if (!name.trim()) { setError('Completá tu nombre.'); return }
    if (password !== confirm) { setError('Las contraseñas no coinciden.'); return }
    setBusy(true); setError('')
    try {
      const { error } = await supabase.auth.signUp({
        email: email.trim(), password,
        options: { data: { full_name: name.trim() }, emailRedirectTo: window.location.origin + '/auth/callback' },
      })
      if (error) throw error
      setSent(true); setPassword(''); setConfirm('')
    } catch (error) { setError(authError(error)) }
    finally { setBusy(false) }
  }
  return <AuthLayout title={sent ? 'Revisá tu correo' : 'Tu música empieza acá'} description={sent ? 'Si el registro corresponde, vas a recibir un enlace para confirmar tu correo. Revisá también spam. Si ya tenés cuenta, podés iniciar sesión.' : 'Creá tu cuenta en Ritmavia.'}>
    {sent ? <Link className={styles.primary} to="/login">Ir a iniciar sesión</Link> : <form className={styles.form} onSubmit={submit}>
      <div className={styles.field}><label htmlFor="register-name">Tu nombre</label><input id="register-name" required maxLength={40} autoComplete="nickname" value={name} onChange={e => setName(e.target.value)} /></div>
      <div className={styles.field}><label htmlFor="register-email">Correo electrónico</label><input id="register-email" type="email" required autoComplete="email" value={email} onChange={e => setEmail(e.target.value)} /></div>
      <PasswordField autoComplete="new-password" value={password} onChange={e => setPassword(e.target.value)} />
      <p className={styles.hint}>Usá al menos 8 caracteres.</p>
      <PasswordField label="Repetí la contraseña" autoComplete="new-password" value={confirm} onChange={e => setConfirm(e.target.value)} />
      {error && <p role="alert" className={styles.error}>{error}</p>}
      <button className={styles.primary} disabled={busy || !supabase}>{busy ? 'Creando cuenta…' : 'Crear cuenta'}</button>
    </form>}
    <p className={styles.footer}>¿Ya tenés cuenta? <Link to="/login" state={state}>Ingresá</Link></p>
  </AuthLayout>
}
