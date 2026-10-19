import { Play, Pause, Heart, Music2 } from 'lucide-react'
import { usePlayerStore } from '../../store/playerStore'
import { useFavorites } from '../../hooks/useFavorites'
import styles from './TrackList.module.css'

export default function TrackList({ tracks = [], emptyMessage = 'No encontramos canciones con esa búsqueda.' }) {
  const player = usePlayerStore()
  const { favorites, toggleFavorite } = useFavorites()

  if (!tracks.length) {
    return <div className={styles.empty} role="status">
      <Music2 size={28} aria-hidden="true" />
      <p>{emptyMessage}</p>
    </div>
  }

  return (
    <div className={styles.trackList}>
      <div className={styles.heading} aria-hidden="true">
        <span>#</span><span>Canción</span><span className={styles.albumHeading}>Artista / Canal</span><span />
      </div>
      <ol className={styles.list} aria-label="Canciones">
        {tracks.map((track, index) => {
          const active = player.currentTrack?.id === track.id
          const playing = active && player.isPlaying
          const liked = favorites.includes(track.id)
          const cover = track.cover || track.thumbnail
          const artist = track.artistName || track.artist || track.channelTitle || 'YouTube'
          const toggleTrack = () => active ? player.togglePlay() : player.playTrack(track, tracks)

          return (
            <li className={`${styles.row} ${active ? styles.selected : ''}`} key={track.id}>
              <button type="button" className={styles.playButton} aria-label={(playing ? 'Pausar ' : 'Reproducir ') + track.title} onClick={toggleTrack}>
                <span className={styles.number} aria-hidden="true">{String(index + 1).padStart(2, '0')}</span>
                <span className={styles.playIcon}>{playing ? <Pause size={17} fill="currentColor" aria-hidden="true" /> : <Play size={17} fill="currentColor" aria-hidden="true" />}</span>
              </button>
              <button type="button" className={styles.trackButton} onClick={toggleTrack} aria-label={(playing ? 'Pausar ' : 'Reproducir ') + track.title}>
                <span className={styles.cover}>{cover ? <img src={cover} alt="" loading="lazy" /> : <Music2 size={18} aria-hidden="true" />}</span>
                <span className={styles.meta}><strong className={styles.title} title={track.title}>{track.title}</strong><span className={styles.artist}>{artist}</span></span>
              </button>
              <span className={styles.album} title={artist}>{artist}</span>
              <button type="button" className={`${styles.favoriteButton} ${liked ? styles.liked : ''}`} aria-label={(liked ? 'Quitar de favoritos: ' : 'Agregar a favoritos: ') + track.title} aria-pressed={liked} onClick={() => toggleFavorite(track.id)}>
                <Heart size={18} fill={liked ? 'currentColor' : 'none'} aria-hidden="true" />
              </button>
            </li>
          )
        })}
      </ol>
    </div>
  )
}
