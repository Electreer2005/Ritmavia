import { Play, Pause, SkipBack, SkipForward } from 'lucide-react'
import { usePlayerStore } from '../../store/playerStore'
import styles from './Controls.module.css'

const RESTART_THRESHOLD = 3 // segundos

export default function Controls({ audioRef }) {
  const player = usePlayerStore()

  const hasTrack = Boolean(player.currentTrack)
  const currentIndex = hasTrack
    ? player.queue.findIndex((t) => t.id === player.currentTrack.id)
    : -1
  const isLast = currentIndex === -1 || currentIndex >= player.queue.length - 1

  const handlePrevious = () => {
    if (player.currentTrack?.videoId && player.currentTime > RESTART_THRESHOLD) {
      player.seekTo(0)
      return
    }
    const audio = audioRef.current
    // Si ya pasaron 3s, reinicia la canción. Si no, va a la anterior.
    if (audio && audio.currentTime > RESTART_THRESHOLD) {
      audio.currentTime = 0
      return
    }
    if (currentIndex > 0) player.previous()
    else if (audio) audio.currentTime = 0
  }

  return (
    <div className={styles.controls}>
      <button
        type="button"
        className={styles.iconButton}
        aria-label="Canción anterior"
        disabled={!hasTrack}
        onClick={handlePrevious}
      >
        <SkipBack size={20} aria-hidden="true" />
      </button>

      <button
        type="button"
        className={styles.playMain}
        aria-label={player.isPlaying ? 'Pausar' : 'Reproducir'}
        disabled={!hasTrack}
        onClick={player.togglePlay}
      >
        {player.isPlaying ? (
          <Pause size={22} aria-hidden="true" fill="currentColor" />
        ) : (
          <Play className={styles.playIcon} size={22} aria-hidden="true" fill="currentColor" />
        )}
      </button>

      <button
        type="button"
        className={styles.iconButton}
        aria-label="Canción siguiente"
        disabled={!hasTrack || isLast}
        onClick={player.next}
      >
        <SkipForward size={20} aria-hidden="true" />
      </button>
    </div>
  )
}