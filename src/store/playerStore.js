import { create } from 'zustand'

export const usePlayerStore = create((set, get) => ({
  currentTrack: null, isPlaying: false, queue: [], volume: 0.7,
  currentTime: 0, duration: 0, error: '',
  seekHandler: null,
  setSeekHandler: (seekHandler) => set({ seekHandler }),
  seekTo: (value) => get().seekHandler?.(value),
  stop: () => set({ currentTrack: null, isPlaying: false, queue: [], currentTime: 0, duration: 0, error: '' }),
  setCurrentTrack: (track) => set({ currentTrack: track, currentTime: 0, duration: 0, error: '' }),
  playTrack: (track, queue) => set({ currentTrack: track, queue, isPlaying: true, currentTime: 0, duration: 0, error: '' }),
  togglePlay: () => { if (get().currentTrack) set(s => ({ isPlaying: !s.isPlaying, error: '' })) },
  setPlaying: (isPlaying) => set({ isPlaying }),
  setQueue: (queue) => set({ queue }),
  setVolume: (volume) => set({ volume: Math.max(0, Math.min(1, volume)) }),
  setProgress: (currentTime, duration) => set({ currentTime, duration: Number.isFinite(duration) ? duration : 0 }),
  setError: (error) => set({ error, isPlaying: false }),
  next: () => {
    const { queue, currentTrack } = get()
    const index = queue.findIndex(t => t.id === currentTrack?.id)
    if (queue[index + 1]) get().playTrack(queue[index + 1], queue)
    else set({ isPlaying: false })
  },
  previous: () => {
    const { queue, currentTrack } = get()
    const index = queue.findIndex(t => t.id === currentTrack?.id)
    if (index > 0) get().playTrack(queue[index - 1], queue)
  },
}))
