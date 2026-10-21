import { Play, Pause, SkipBack, SkipForward, Shuffle, Repeat, Repeat1 } from 'lucide-react'
import { usePlayerStore } from '../../store/playerStore'
import styles from './Controls.module.css'

const RESTART_THRESHOLD = 3

export default function Controls({ audioRef }) {
  const player = usePlayerStore()
  const hasTrack = Boolean(player.currentTrack)
  const currentIndex = hasTrack ? player.queue.findIndex((t) => t.id === player.currentTrack.id) : -1
  const isLast = currentIndex === -1 || (currentIndex >= player.queue.length - 1 && player.repeatMode !== 'all' && player.shuffle === false)

  const handlePrevious = () => {
    if (player.currentTrack?.videoId && player.currentTime > RESTART_THRESHOLD) {
      player.seekTo(0)
      return
    }
    const audio = audioRef.current
    if (audio && audio.currentTime > RESTART_THRESHOLD) {
      audio.currentTime = 0
      return
    }
    if (currentIndex > 0 || player.repeatMode === 'all') player.previous()
    else if (audio) audio.currentTime = 0
  }

  return (
    <div className={styles.controls}>
      <button
        type="button"
        className={`${styles.iconButton} ${player.shuffle ? styles.active : ''}`}
        aria-label={player.shuffle ? 'Desactivar reproducción aleatoria' : 'Activar reproducción aleatoria'}
        aria-pressed={player.shuffle}
        title="Aleatorio"
        onClick={player.toggleShuffle}
      >
        <Shuffle size={17} aria-hidden="true" />
      </button>
      <button type="button" className={styles.iconButton} aria-label="Canción anterior" disabled={!hasTrack} onClick={handlePrevious}>
        <SkipBack size={20} aria-hidden="true" />
      </button>
      <button type="button" className={styles.playMain} aria-label={player.isPlaying ? 'Pausar' : 'Reproducir'} disabled={!hasTrack} onClick={player.togglePlay}>
        {player.isPlaying ? <Pause size={22} aria-hidden="true" fill="currentColor" /> : <Play className={styles.playIcon} size={22} aria-hidden="true" fill="currentColor" />}
      </button>
      <button type="button" className={styles.iconButton} aria-label="Canción siguiente" disabled={!hasTrack || isLast} onClick={player.next}>
        <SkipForward size={20} aria-hidden="true" />
      </button>
      <button
        type="button"
        className={`${styles.iconButton} ${player.repeatMode !== 'off' ? styles.active : ''}`}
        aria-label={player.repeatMode === 'off' ? 'Activar repetir lista' : player.repeatMode === 'all' ? 'Repetir una canción' : 'Desactivar repetición'}
        aria-pressed={player.repeatMode !== 'off'}
        title={player.repeatMode === 'off' ? 'Repetir: desactivado' : player.repeatMode === 'all' ? 'Repetir lista' : 'Repetir canción'}
        onClick={player.cycleRepeat}
      >
        {player.repeatMode === 'one' ? <Repeat1 size={17} aria-hidden="true" /> : <Repeat size={17} aria-hidden="true" />}
      </button>
    </div>
  )
}
