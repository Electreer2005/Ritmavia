import { create } from 'zustand'

export const usePlayerStore = create((set, get) => ({
  currentTrack: null,
  isPlaying: false,
  queue: [],
  volume: 0.7,
  currentTime: 0,
  duration: 0,
  error: '',
  shuffle: false,
  repeatMode: 'off',
  seekHandler: null,

  setSeekHandler: (seekHandler) => set({ seekHandler }),
  seekTo: (value) => get().seekHandler?.(value),
  stop: () => set({ currentTrack: null, isPlaying: false, queue: [], currentTime: 0, duration: 0, error: '' }),
  setCurrentTrack: (track) => set({ currentTrack: track, currentTime: 0, duration: 0, error: '' }),
  playTrack: (track, queue) => set((state) => ({
    currentTrack: track,
    queue: Array.isArray(queue) && queue.length ? queue : (state.queue.length ? state.queue : [track]),
    isPlaying: true,
    currentTime: 0,
    duration: 0,
    error: '',
  })),
  togglePlay: () => { if (get().currentTrack) set(s => ({ isPlaying: !s.isPlaying, error: '' })) },
  setPlaying: (isPlaying) => set({ isPlaying }),
  setQueue: (queue) => set({ queue: Array.isArray(queue) ? queue : [] }),
  setVolume: (volume) => set({ volume: Math.max(0, Math.min(1, volume)) }),
  setProgress: (currentTime, duration) => set({ currentTime, duration: Number.isFinite(duration) ? duration : 0 }),
  setError: (error) => set({ error, isPlaying: false }),
  toggleShuffle: () => set(state => ({ shuffle: !state.shuffle })),
  cycleRepeat: () => set(state => ({
    repeatMode: state.repeatMode === 'off' ? 'all' : state.repeatMode === 'all' ? 'one' : 'off',
  })),
  next: (ended = false) => {
    const { queue, currentTrack, shuffle, repeatMode } = get()
    if (!currentTrack) return
    if (ended && repeatMode === 'one') {
      get().playTrack(currentTrack, queue)
      return
    }
    const index = queue.findIndex(t => t.id === currentTrack.id)
    if (shuffle && queue.length > 1) {
      const choices = queue.filter(t => t.id !== currentTrack.id)
      const nextTrack = choices[Math.floor(Math.random() * choices.length)]
      if (nextTrack) get().playTrack(nextTrack, queue)
      return
    }
    if (queue[index + 1]) {
      get().playTrack(queue[index + 1], queue)
      return
    }
    if (repeatMode === 'all' && queue.length) {
      get().playTrack(queue[0], queue)
      return
    }
    set({ isPlaying: false })
  },
  previous: () => {
    const { queue, currentTrack } = get()
    const index = queue.findIndex(t => t.id === currentTrack?.id)
    if (index > 0) get().playTrack(queue[index - 1], queue)
    else if (index === 0 && get().repeatMode === 'all' && queue.length) get().playTrack(queue[queue.length - 1], queue)
  },
}))
