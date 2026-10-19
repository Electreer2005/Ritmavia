import { useState } from 'react'
import { Link } from 'react-router-dom'
import { User, Heart, Disc3, Pencil, Check, ArrowUpRight } from 'lucide-react'
import { useFavorites } from '../../hooks/useFavorites'
import styles from './Profile.module.css'
import { useAuth } from '../../hooks/useAuth'
import { supabase } from '../../lib/supabase'
import { authError } from '../../lib/authUtils'

export default function Profile() {
  const { user, signOut } = useAuth()
  const profile = { name: user?.user_metadata?.full_name || '', bio: user?.user_metadata?.bio || '' }
  const [saving, setSaving] = useState(false)
  const [leaving, setLeaving] = useState(false)
  const [draft, setDraft] = useState(profile)
  const [editing, setEditing] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const { favoriteTracks: saved } = useFavorites()
  const artistCount = new Set(saved.map(track => track.artistName || track.artistId).filter(Boolean)).size
  const name = profile.name || 'Tu espacio'
  const initials = profile.name.trim().split(/\s+/).filter(Boolean).slice(0, 2).map(word => Array.from(word)[0]).join('').toLocaleUpperCase()

  function startEditing() {
    setDraft(profile)
    setMessage('')
    setError('')
    setEditing(true)
  }
  async function save(event) {
    event.preventDefault()
    const next = { name: draft.name.trim(), bio: draft.bio.trim() }
    if (!next.name) { setError('Escribí un nombre para tu perfil.'); return }
    if (saving) return
    setSaving(true)
    setError('')
    try {
      const { error } = await supabase.auth.updateUser({ data: { full_name: next.name, bio: next.bio } })
      if (error) throw error
      setEditing(false)
      setMessage('Tu perfil se guardó.')
    } catch (error) { setError(authError(error)) }
    finally { setSaving(false) }
  }
  async function logout() {
    setLeaving(true)
    setMessage('')
    try { await signOut() }
    catch (error) { setMessage(authError(error)); setLeaving(false) }
  }

  return (
    <section className={styles.page} aria-labelledby="profile-title">
      <header className={styles.hero}>
        <div className={styles.avatar} aria-hidden="true">{initials || <User size={48} strokeWidth={1.5} />}</div>
        <div className={styles.heroContent}>
          <span className={styles.eyebrow}>TU CUENTA RITMAVIA</span>
          <h1 id="profile-title" className={styles.title}>{name}</h1>
          <p className={styles.accountEmail}>{user?.email}</p>
          <p className={styles.bio}>{profile.bio || 'Cada canción cuenta algo de vos. Este es tu lugar para guardarlas.'}</p>
          <button type="button" className={styles.editButton} onClick={startEditing} disabled={saving} aria-expanded={editing} aria-controls="profile-editor"><Pencil size={15} aria-hidden="true" />Editar perfil</button>
        </div>
      </header>

      <p className={styles.feedback} role="status">{message}</p>

      {editing && <form id="profile-editor" className={styles.form} onSubmit={save}>
        <h2>Hacelo tuyo</h2>
        <label className={styles.field} htmlFor="profile-name">Nombre
          <input id="profile-name" value={draft.name} maxLength={40} required autoComplete="nickname" onChange={event => setDraft({ ...draft, name: event.target.value })} aria-invalid={Boolean(error)} aria-describedby={error ? 'profile-error' : undefined} />
        </label>
        <label className={styles.field} htmlFor="profile-bio">Sobre vos <span className={styles.optional}>Opcional</span>
          <textarea id="profile-bio" value={draft.bio} maxLength={160} rows={3} placeholder="¿Qué música te acompaña?" onChange={event => setDraft({ ...draft, bio: event.target.value })} />
        </label>
        <span className={styles.characterCount}>{draft.bio.length}/160</span>
        {error && <p className={styles.error} id="profile-error" role="alert">{error}</p>}
        <div className={styles.actions}>
          <button type="submit" className={styles.primary} disabled={saving}><Check size={17} aria-hidden="true" />{saving ? 'Guardando…' : 'Guardar cambios'}</button>
          <button type="button" className={styles.cancel} disabled={saving} onClick={() => { setEditing(false); setError('') }}>Cancelar</button>
        </div>
      </form>}

      <div className={styles.stats} aria-label="Tu colección">
        <div className={styles.stat}><Heart size={21} aria-hidden="true" /><strong>{saved.length}</strong><span>Canciones favoritas</span></div>
        <div className={styles.stat}><User size={21} aria-hidden="true" /><strong>{artistCount}</strong><span>Artistas / canales guardados</span></div>
      </div>
      <div className={styles.sectionHeading}><span className={styles.eyebrow}>SEGUÍ ESCUCHANDO</span><h2>Tu música te espera</h2></div>
      <div className={styles.shortcuts}>
        <Link to="/favoritos" className={styles.shortcut}><span className={styles.shortcutIcon}><Heart size={23} aria-hidden="true" /></span><span><strong>Mis favoritos</strong><small>Volvé a las canciones que guardaste.</small></span><ArrowUpRight size={19} aria-hidden="true" /></Link>
        <Link to="/biblioteca" className={styles.shortcut}><span className={styles.shortcutIcon}><Disc3 size={23} aria-hidden="true" /></span><span><strong>Tu biblioteca</strong><small>Todo tu espacio musical.</small></span><ArrowUpRight size={19} aria-hidden="true" /></Link>
      </div>
      <div className={styles.accountActions}>
        <Link to="/restablecer" className={styles.cancel}>Cambiar contraseña</Link>
        <button type="button" className={styles.logout} disabled={leaving || saving} onClick={logout}>{leaving ? 'Cerrando sesión…' : 'Cerrar sesión'}</button>
      </div>
      <p className={styles.localNote}>Tu perfil está conectado a tu cuenta. Los favoritos se guardan por usuario en este navegador; todavía no se sincronizan entre dispositivos.</p>
    </section>
  )
}
