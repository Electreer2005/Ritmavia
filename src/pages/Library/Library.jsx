import { Link } from 'react-router-dom'
import { Heart, Play, Search } from 'lucide-react'
import { useFavorites } from '../../hooks/useFavorites'
import { usePlayerStore } from '../../store/playerStore'
import TrackList from '../../components/TrackList/TrackList'
import CatalogNotice from '../../components/CatalogNotice'
import styles from './Library.module.css'

export default function Library() {
  const { favoriteTracks: saved } = useFavorites()
  const playTrack = usePlayerStore(s => s.playTrack)

  return (
    <section className={styles.page} aria-labelledby="library-title">
      <header className={styles.hero}>
        <div className={styles.artwork} aria-hidden="true"><Heart size={64} fill="currentColor" strokeWidth={1.5} /></div>
        <div className={styles.heroContent}>
          <span className={styles.eyebrow}>TU COLECCIÓN PERSONAL</span>
          <h1 id="library-title" className={styles.title}>Tu biblioteca</h1>
          <p className={styles.description}>Las canciones que querés volver a escuchar, en un solo lugar.</p>
          <span className={styles.count}>{saved.length} {saved.length === 1 ? 'canción guardada' : 'canciones guardadas'}</span>
        </div>
      </header>

      <div className={styles.toolbar}>
        <button type="button" className={styles.primary} disabled={!saved.length} onClick={() => playTrack(saved[0], saved)}>
          <Play size={17} fill="currentColor" aria-hidden="true" />Escuchar favoritos
        </button>
        <Link className={styles.secondary} to="/buscar"><Search size={16} aria-hidden="true" />Descubrir música</Link>
      </div>

      <div className={styles.sectionHeading}><h2>Mis favoritos</h2><Heart size={18} aria-hidden="true" /></div>
      <div className={styles.notice}>{saved.some(track => track.videoId) ? <p>Videos de YouTube guardados. El video permanece visible durante la reproducción.</p> : <CatalogNotice />}</div>
      <div className={styles.panel}>
        <TrackList tracks={saved} emptyMessage="Todavía no guardaste favoritos. Tocá el corazón de una canción para encontrarla acá." />
      </div>
    </section>
  )
}
