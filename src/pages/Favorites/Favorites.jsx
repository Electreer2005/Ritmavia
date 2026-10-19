import { Heart, Play, Search } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useFavorites } from '../../hooks/useFavorites'
import { usePlayerStore } from '../../store/playerStore'
import TrackList from '../../components/TrackList/TrackList'
import styles from './Favorites.module.css'

export default function Favorites() {
  const { favoriteTracks: saved } = useFavorites()
  const playTrack = usePlayerStore(s => s.playTrack)
  return (
    <section className={styles.page} aria-labelledby="favorites-title">
      <header className={styles.hero}>
        <div className={styles.artwork} aria-hidden="true"><Heart size={60} fill="currentColor" /></div>
        <div className={styles.heroContent}>
          <span className={styles.eyebrow}>LO QUE TE MUEVE</span>
          <h1 id="favorites-title" className={styles.title}>Mis favoritos</h1>
          <p className={styles.description}>Tu selección, tus canciones, las veces que quieras.</p>
          <span className={styles.count}>{saved.length} {saved.length === 1 ? 'canción guardada' : 'canciones guardadas'}</span>
        </div>
      </header>
      <div className={styles.toolbar}>
        <button type="button" className={styles.primary} disabled={!saved.length} onClick={() => playTrack(saved[0], saved)}><Play size={17} fill="currentColor" aria-hidden="true" />Reproducir favoritos</button>
        <Link to="/buscar" className={styles.secondary}><Search size={16} aria-hidden="true" />Encontrar más música</Link>
      </div>
      <div className={styles.sectionHeading}><h2>Tu selección</h2><Heart size={18} aria-hidden="true" /></div>
      {saved.some(track => track.videoId) && <p className={styles.notice}>Videos de YouTube guardados. La disponibilidad depende de cada video y su región.</p>}
      <div className={styles.panel}><TrackList tracks={saved} emptyMessage="Tu colección empieza con un corazón. Agregá canciones a favoritos desde Buscar." /></div>
    </section>
  )
}
