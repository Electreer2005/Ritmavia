import { Music2, Volume2 } from 'lucide-react'
import { getAlbumById, getArtistById } from '../../data/mockData'
import { usePlayerStore } from '../../store/playerStore'
import { useAudio } from '../../hooks/useAudio'
import Controls from './Controls'
import ProgressBar from './ProgressBar'
import styles from './Player.module.css'

export default function Player() {
  const player = usePlayerStore()
  const audioRef = useAudio()
  const currentAlbum = getAlbumById(player.currentTrack?.albumId)
  const cover = player.currentTrack?.cover || currentAlbum?.cover
  const currentArtist = getArtistById(player.currentTrack?.artistId)

  return (
    <section className={styles.player} aria-label="Reproductor">
      <audio ref={audioRef} preload="metadata" />

      {/* ====== INFO DE LA CANCIÓN ====== */}
      <div className={styles.nowPlaying}>
        <div className={styles.cover}>
          {cover ? (
            <img src={cover} alt="" />
          ) : (
            <div className={styles.placeholder}>
              <Music2 size={22} aria-hidden="true" />
            </div>
          )}
        </div>

        <div className={styles.meta}>
          <strong className={styles.title}>
            {player.currentTrack?.title || 'Elegí una canción'}
          </strong>
          <span className={styles.artist}>
            {player.currentTrack?.artistName || currentArtist?.name || 'Todo listo para escuchar'}
          </span>
        </div>
      </div>

      {/* ====== CONTROLES + PROGRESO ====== */}
      <div className={styles.transport}>
        <Controls audioRef={audioRef} />
        <ProgressBar audioRef={audioRef} />

        {player.error && (
          <p className={styles.error} role="alert">
            {player.error}
          </p>
        )}
      </div>

      {/* ====== VOLUMEN ====== */}
      <label className={styles.volume}>
        <Volume2 size={19} aria-hidden="true" />
        <input
          className={styles.volumeInput}
          style={{ "--volume-progress": `${Math.round(player.volume * 100)}%` }}
          aria-label="Volumen"
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={player.volume}
          onChange={(event) => player.setVolume(Number(event.target.value))}
        />
      </label>
    </section>
  )
}