import { useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import { authError } from '../../lib/authUtils'
import AuthLayout from './AuthLayout'
import styles from './Auth.module.css'
export default function ForgotPassword() {
  const [email, setEmail] = useState('')
  const [busy, setBusy] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')
  async function submit(event) {
    event.preventDefault()
    if (!supabase || busy) return
    setBusy(true); setError('')
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), { redirectTo: window.location.origin + '/restablecer' })
      if (error) throw error
      setSent(true)
    } catch (error) { setError(authError(error)) }
    finally { setBusy(false) }
  }
  return <AuthLayout title="Recuperá tu acceso" description="Te ayudamos a volver a tu música.">
    {sent ? <p className={styles.success} role="status">Si existe una cuenta con ese correo, recibirás un enlace para elegir una nueva contraseña.</p> : <form className={styles.form} onSubmit={submit}>
      <div className={styles.field}><label htmlFor="recovery-email">Correo electrónico</label><input id="recovery-email" type="email" autoComplete="email" required value={email} onChange={e => setEmail(e.target.value)} /></div>
      {error && <p role="alert" className={styles.error}>{error}</p>}
      <button className={styles.primary} disabled={busy || !supabase}>{busy ? 'Enviando…' : 'Enviar enlace'}</button>
    </form>}
    <p className={styles.footer}><Link to="/login">Volver a iniciar sesión</Link></p>
  </AuthLayout>
}
