import { useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../hooks/useAuth'
import { authError } from '../../lib/authUtils'
import AuthLayout from './AuthLayout'
import PasswordField from './PasswordField'
import styles from './Auth.module.css'
export default function ResetPassword() {
  const { user, loading, finishRecovery } = useAuth()
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [busy, setBusy] = useState(false)
  const [done, setDone] = useState(false)
  const [error, setError] = useState('')
  async function submit(event) {
    event.preventDefault()
    if (!user || !supabase || busy) return
    if (password !== confirm) { setError('Las contraseñas no coinciden.'); return }
    setBusy(true); setError('')
    try {
      const { error } = await supabase.auth.updateUser({ password })
      if (error) throw error
      finishRecovery(); setDone(true); setPassword(''); setConfirm('')
    } catch (error) { setError(authError(error)) }
    finally { setBusy(false) }
  }
  return <AuthLayout title={done ? 'Contraseña actualizada' : 'Elegí una nueva contraseña'} description="Usá al menos 8 caracteres y guardala en un lugar seguro.">
    {loading ? <p role="status">Verificando el enlace…</p> : done ? <><p className={styles.success} role="status">Los cambios se guardaron.</p><Link className={styles.primary} to="/perfil">Ir a mi perfil</Link></> : !user ? <><p className={styles.error} role="alert">El enlace no es válido o venció. Pedí uno nuevo para continuar.</p><Link className={styles.textLink} to="/recuperar">Solicitar nuevo enlace</Link></> : <form className={styles.form} onSubmit={submit}>
      <PasswordField label="Nueva contraseña" autoComplete="new-password" value={password} onChange={e => setPassword(e.target.value)} />
      <PasswordField label="Repetí la contraseña" autoComplete="new-password" value={confirm} onChange={e => setConfirm(e.target.value)} />
      {error && <p className={styles.error} role="alert">{error}</p>}
      <button className={styles.primary} disabled={busy}>{busy ? 'Guardando…' : 'Guardar contraseña'}</button>
    </form>}
  </AuthLayout>
}
