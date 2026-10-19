import { usePlayerStore } from '../../store/playerStore'
import styles from './ProgressBar.module.css'

/**
 * Formatea segundos a `m:ss` o `h:mm:ss` si supera la hora.
 */
function formatTime(seconds) {
  const value = Number.isFinite(seconds) ? Math.max(0, Math.floor(seconds)) : 0
  const h = Math.floor(value / 3600)
  const m = Math.floor((value % 3600) / 60)
  const s = value % 60

  if (h > 0) {
    return `${h}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
  }
  return `${m}:${String(s).padStart(2, '0')}`
}

export default function ProgressBar({ audioRef }) {
  const player = usePlayerStore()

  const duration = Number.isFinite(player.duration) ? Math.max(0, player.duration) : 0
  const currentTime = Number.isFinite(player.currentTime) ? Math.max(0, Math.min(player.currentTime, duration)) : 0
  const progress = duration > 0 ? (currentTime / duration) * 100 : 0
  const disabled = !duration

  const handleChange = (event) => {
    if (!duration) return
    if (player.currentTrack?.videoId) {
      player.seekTo(Number(event.target.value))
      return
    }
    const audio = audioRef.current
    if (!audio) return
    const value = Math.max(0, Math.min(Number(event.target.value), duration))
    if (!Number.isFinite(value)) return
    audio.currentTime = value
    player.setProgress(value, duration)
  }

  return (
    <div className={styles.progress}>
      <span className={styles.time} aria-hidden="true">
        {formatTime(currentTime)}
      </span>

      <input
        className={styles.slider}
        style={{ '--progress': `${progress}%` }}
        aria-label="Progreso de reproducción"
        aria-valuemin={0}
        aria-valuemax={duration || 1}
        aria-valuenow={currentTime}
        aria-valuetext={`${formatTime(currentTime)} de ${formatTime(duration)}`}
        type="range"
        min="0"
        max={duration || 1}
        step="0.1"
        value={currentTime}
        disabled={disabled}
        onChange={handleChange}
      />

      <span className={styles.time} aria-hidden="true">
        {formatTime(duration)}
      </span>
    </div>
  )
}