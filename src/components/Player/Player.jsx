import { useState } from 'react'
import { ListMusic, Music2, Volume2, X, Trash2, Play } from 'lucide-react'
import { usePlayerStore } from '../../store/playerStore'
import { useAudio } from '../../hooks/useAudio'
import Controls from './Controls'
import ProgressBar from './ProgressBar'
import styles from './Player.module.css'

export default function Player() {
  const player = usePlayerStore()
  const audioRef = useAudio()
  const [queueOpen, setQueueOpen] = useState(false)
  const cover = player.currentTrack?.cover || player.currentTrack?.thumbnail
  const queue = player.queue || []
  const currentIndex = queue.findIndex(track => track.id === player.currentTrack?.id)

  return (
    <section className={styles.player} aria-label="Reproductor">
      <audio ref={audioRef} preload="metadata" />

      {queueOpen && (
        <aside className={styles.queuePanel} aria-label="Cola de reproducción">
          <div className={styles.queueHeader}>
            <div><strong>Cola de reproducción</strong><span>{queue.length} {queue.length === 1 ? 'canción' : 'canciones'}</span></div>
            <button type="button" className={styles.queueClose} aria-label="Cerrar cola" onClick={() => setQueueOpen(false)}><X size={18} /></button>
          </div>
          {player.currentTrack && (
            <div className={styles.queueCurrent}>
              <span className={styles.queueEyebrow}>SONANDO AHORA</span>
              <div className={styles.queueTrack}>
                <div className={styles.queueCover}>{cover ? <img src={cover} alt="" /> : <Music2 size={18} />}</div>
                <div className={styles.queueMeta}><strong>{player.currentTrack.title}</strong><span>{player.currentTrack.artistName || player.currentTrack.artist || player.currentTrack.channelTitle || 'Música'}</span></div>
                <span className={styles.queuePlaying}><span /><span /><span /></span>
              </div>
            </div>
          )}
          <div className={styles.queueNextHeader}><strong>A continuación</strong>{queue.length > 0 && <button type="button" onClick={() => player.setQueue(player.currentTrack ? [player.currentTrack] : [])} title="Limpiar próximos temas">Limpiar cola</button>}</div>
          <div className={styles.queueList}>
            {queue.filter(track => track.id !== player.currentTrack?.id).length ? queue.map((track, index) => {
              if (track.id === player.currentTrack?.id) return null
              const image = track.cover || track.thumbnail
              return <button type="button" key={track.id} className={styles.queueItem} onClick={() => { player.playTrack(track, queue); setQueueOpen(false) }}>
                <span className={styles.queuePosition}>{String(index + 1).padStart(2, '0')}</span>
                <span className={styles.queueCover}>{image ? <img src={image} alt="" loading="lazy" /> : <Music2 size={18} />}</span>
                <span className={styles.queueMeta}><strong>{track.title}</strong><span>{track.artistName || track.artist || track.channelTitle || 'Música'}</span></span>
                <Play size={16} aria-hidden="true" />
              </button>
            }) : <p className={styles.queueEmpty}>{player.currentTrack ? 'No hay más canciones en la cola.' : 'Reproducí una canción para empezar tu cola.'}</p>}
          </div>
          {currentIndex >= 0 && <div className={styles.queueFooter}>Tema {currentIndex + 1} de {queue.length}</div>}
        </aside>
      )}

      <div className={styles.nowPlaying}>
        <div className={styles.cover}>
          {cover ? <img src={cover} alt="" /> : <div className={styles.placeholder}><Music2 size={22} aria-hidden="true" /></div>}
        </div>
        <div className={styles.meta}>
          <strong className={styles.title}>{player.currentTrack?.title || 'Elegí una canción'}</strong>
          <span className={styles.artist}>{player.currentTrack?.artistName || player.currentTrack?.artist || 'Todo listo para escuchar'}</span>
        </div>
      </div>

      <div className={styles.transport}>
        <Controls audioRef={audioRef} />
        <ProgressBar audioRef={audioRef} />
        {player.error && <p className={styles.error} role="alert">{player.error}</p>}
      </div>

      <div className={styles.rightControls}>
        <button type="button" className={`${styles.queueToggle} ${queueOpen ? styles.queueToggleActive : ''}`} aria-label="Mostrar cola de reproducción" aria-pressed={queueOpen} title="Cola de reproducción" onClick={() => setQueueOpen(open => !open)}>
          <ListMusic size={20} aria-hidden="true" />
          {queue.length > 0 && <span className={styles.queueCount}>{queue.length}</span>}
        </button>
        <label className={styles.volume}>
          <Volume2 size={19} aria-hidden="true" />
          <input className={styles.volumeInput} style={{ "--volume-progress": `${Math.round(player.volume * 100)}%` }} aria-label="Volumen" type="range" min="0" max="1" step="0.01" value={player.volume} onChange={event => player.setVolume(Number(event.target.value))} />
        </label>
      </div>
    </section>
  )
}
