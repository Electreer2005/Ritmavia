import { useEffect, useRef } from 'react'
import { X, ExternalLink } from 'lucide-react'
import { usePlayerStore } from '../../store/playerStore'
import { loadYouTubePlayer } from '../../services/youtubePlayer'
import styles from './VideoPlayer.module.css'

function ActiveVideo({ videoId }) {
  const hostRef = useRef(null)
  const panelRef = useRef(null)
  const track = usePlayerStore(s => s.currentTrack)
  useEffect(() => {
    let disposed = false
    let player
    let ready = false
    let timer
    let wasPlaying = false
    let activeVideo = videoId
    const host = hostRef.current
    const target = document.createElement('div')
    host.appendChild(target)
    const state = () => usePlayerStore.getState()
    const sync = () => {
      if (!ready || disposed) return
      const store = state()
      if (!store.currentTrack?.videoId) return
      const id = store.currentTrack.videoId
      if (id !== activeVideo) {
        activeVideo = id
        store.isPlaying ? player.loadVideoById(id) : player.cueVideoById(id)
      } else {
        const currentState = player.getPlayerState()
        if (store.isPlaying && currentState !== 1 && currentState !== 3 && !document.hidden) player.playVideo()
        if (!store.isPlaying && currentState === 1) player.pauseVideo()
      }
      player.setVolume(store.volume * 100)
    }
    const unsubscribe = usePlayerStore.subscribe((next, previous) => {
      if (next.isPlaying !== previous.isPlaying || next.currentTrack !== previous.currentTrack || next.volume !== previous.volume) sync()
    })
    const visibility = () => {
      if (document.hidden && ready) { player.pauseVideo(); state().setPlaying(false) }
    }
    document.addEventListener('visibilitychange', visibility)
    const observer = typeof IntersectionObserver === 'undefined' ? null : new IntersectionObserver(entries => {
      if (!entries[0]?.isIntersecting && ready) { player.pauseVideo(); state().setPlaying(false) }
    })
    if (panelRef.current) observer?.observe(panelRef.current)
    loadYouTubePlayer().then(YT => {
      if (disposed) return
      activeVideo = state().currentTrack?.videoId || videoId
      player = new YT.Player(target, {
        width: '100%', height: '100%', videoId: activeVideo,
        playerVars: { origin: window.location.origin, playsinline: 1, controls: 1, autoplay: 0 },
        events: {
          onReady: () => {
            if (disposed) return
            ready = true
            state().setSeekHandler(value => { player.seekTo(value, true); state().setProgress(value, player.getDuration()) })
            sync()
            timer = setInterval(() => {
              if (disposed || !ready) return
              state().setProgress(player.getCurrentTime(), player.getDuration())
            }, 500)
          },
          onStateChange: event => {
            if (disposed) return
            if (event.data === 1) {
              wasPlaying = true
              if (document.hidden) { player.pauseVideo(); state().setPlaying(false); return }
              if (!state().isPlaying) state().setPlaying(true)
            }
            if (event.data === 2 && state().isPlaying) state().setPlaying(false)
            if (event.data === 0 && wasPlaying) { wasPlaying = false; state().next() }
          },
          onAutoplayBlocked: () => { if (!disposed) state().setError('Tocá el botón de reproducción dentro del video para comenzar.') },
          onError: event => {
            if (disposed) return
            const message = [101, 150].includes(event.data) ? 'Este video no permite reproducirse fuera de YouTube. Elegí otro resultado.' : event.data === 153 ? 'YouTube no pudo verificar el sitio. Abrí Ritmavia desde localhost o tu dominio, no desde un archivo.' : 'Este video no está disponible. Elegí otro resultado.'
            state().setError(message)
          },
        },
      })
    }).catch(error => { if (!disposed) state().setError(error.message) })
    return () => {
      disposed = true
      unsubscribe()
      clearInterval(timer)
      observer?.disconnect()
      document.removeEventListener('visibilitychange', visibility)
      state().setSeekHandler(null)
      if (player?.destroy) player.destroy()
      host.replaceChildren()
    }
    // El iframe se conserva al cambiar de canción; la suscripción carga el próximo video.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return <section ref={panelRef} className={styles.panel} aria-label="Video de YouTube en reproducción">
    <header className={styles.header}><a href={'https://www.youtube.com/watch?v=' + track.videoId} target="_blank" rel="noreferrer">YouTube <ExternalLink size={13} aria-hidden="true" /></a><button type="button" aria-label="Cerrar y detener video" onClick={() => usePlayerStore.getState().stop()}><X size={18} aria-hidden="true" /></button></header>
    <div ref={hostRef} className={styles.viewport} />
    <p className={styles.caption} title={track.title}>{track.title}</p>
  </section>
}
export default function VideoPlayer() {
  const videoId = usePlayerStore(s => s.currentTrack?.videoId)
  return videoId ? <ActiveVideo videoId={videoId} /> : null
}
