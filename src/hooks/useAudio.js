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
    if (!track || track.videoId) { audio.pause(); audio.removeAttribute('src'); return }
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
  return audioRef
}
