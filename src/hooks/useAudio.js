import { useEffect, useRef } from 'react'
import { usePlayerStore } from '../store/playerStore'

export function useAudio() {
  const audioRef = useRef(null)
  const track = usePlayerStore(s => s.currentTrack)
  const playing = usePlayerStore(s => s.isPlaying)
  const volume = usePlayerStore(s => s.volume)

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return
    const update = () => usePlayerStore.getState().setProgress(audio.currentTime, audio.duration)
    const ended = () => usePlayerStore.getState().next()
    const failed = () => usePlayerStore.getState().setError('No se pudo cargar el audio. Revisá tu conexión o probá otra pista.')
    audio.addEventListener('timeupdate', update)
    audio.addEventListener('loadedmetadata', update)
    audio.addEventListener('durationchange', update)
    audio.addEventListener('ended', ended)
    audio.addEventListener('error', failed)
    return () => {
      audio.pause()
      audio.removeEventListener('timeupdate', update)
      audio.removeEventListener('loadedmetadata', update)
      audio.removeEventListener('durationchange', update)
      audio.removeEventListener('ended', ended)
      audio.removeEventListener('error', failed)
    }
  }, [])

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return
    let cancelled = false
    if (!track || track.videoId || !track.audioUrl) {
      audio.pause()
      audio.removeAttribute('src')
      return
    }
    if (audio.getAttribute('src') !== track.audioUrl) {
      audio.src = track.audioUrl
      audio.load()
    }
    if (playing) {
      audio.play().catch(error => {
        if (!cancelled && error.name !== 'AbortError') {
          usePlayerStore.getState().setError('No se pudo iniciar el audio. Probá pulsar reproducir nuevamente.')
        }
      })
    } else audio.pause()
    return () => { cancelled = true }
  }, [track, playing])

  useEffect(() => { if (audioRef.current) audioRef.current.volume = volume }, [volume])

  useEffect(() => {
    if (!('mediaSession' in navigator)) return
    const session = navigator.mediaSession
    const activeTrack = track && !track.videoId ? track : null

    if (activeTrack && 'MediaMetadata' in window) {
      session.metadata = new window.MediaMetadata({
        title: activeTrack.title || 'Ritmavia',
        artist: activeTrack.artistName || 'Artista independiente',
        album: activeTrack.albumTitle || 'Ritmavia',
        artwork: activeTrack.cover ? [
          { src: activeTrack.cover, sizes: '96x96' },
          { src: activeTrack.cover, sizes: '256x256' },
          { src: activeTrack.cover, sizes: '512x512' },
        ] : [],
      })
    } else {
      session.metadata = null
    }

    const handlers = {
      play: () => usePlayerStore.getState().setPlaying(true),
      pause: () => usePlayerStore.getState().setPlaying(false),
      previoustrack: () => {
        const state = usePlayerStore.getState()
        if (state.currentTime > 3) {
          if (audioRef.current) audioRef.current.currentTime = 0
          return
        }
        state.previous()
      },
      nexttrack: () => usePlayerStore.getState().next(),
      seekbackward: (details) => {
        const audio = audioRef.current
        if (audio) audio.currentTime = Math.max(0, audio.currentTime - (details.seekOffset || 10))
      },
      seekforward: (details) => {
        const audio = audioRef.current
        if (audio) audio.currentTime = Math.min(audio.duration || Infinity, audio.currentTime + (details.seekOffset || 10))
      },
      seekto: (details) => {
        if (audioRef.current && Number.isFinite(details.seekTime)) audioRef.current.currentTime = details.seekTime
      },
    }

    Object.entries(handlers).forEach(([action, handler]) => {
      try { session.setActionHandler(action, handler) } catch { /* Acción no compatible con este navegador. */ }
    })

    return () => {
      Object.keys(handlers).forEach(action => {
        try { session.setActionHandler(action, null) } catch { /* Acción no compatible con este navegador. */ }
      })
    }
  }, [track])

  useEffect(() => {
    if (!('mediaSession' in navigator)) return
    try { navigator.mediaSession.playbackState = playing ? 'playing' : 'paused' } catch { /* No disponible en todos los navegadores. */ }
  }, [playing])

  return audioRef
}
