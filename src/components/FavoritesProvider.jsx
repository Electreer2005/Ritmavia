import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { FavoritesContext } from '../store/favoritesContext'
import { useAuth } from '../hooks/useAuth'
import { tracks as demoTracks } from '../data/mockData'
import { getYouTubeVideos, hasYouTubeKey } from '../services/youtube'

function readFavorites(key) {
  try {
    const data = key ? JSON.parse(localStorage.getItem(key) || '[]') : []
    return Array.isArray(data) ? data.filter(id => typeof id === 'string') : []
  } catch { return [] }
}
export default function FavoritesProvider({ children }) {
  const { user } = useAuth()
  const key = user ? 'ritmavia-favorites:' + user.id : null
  const navigate = useNavigate()
  const location = useLocation()
  const [state, setState] = useState({ owner: null, favorites: [], error: '' })
  const [catalog, setCatalog] = useState({ signature: '', tracks: [], error: '' })
  const favorites = key && state.owner === key ? state.favorites : readFavorites(key)
  const youtubeIds = favorites.filter(id => /^yt:[\w-]{11}$/.test(id)).map(id => id.slice(3)).join(',')
  const signature = key + ':' + youtubeIds
  useEffect(() => {
    if (!key || !youtubeIds || !hasYouTubeKey) return
    const controller = new AbortController()
    getYouTubeVideos(youtubeIds.split(','), controller.signal).then(tracks => {
      if (!controller.signal.aborted) setCatalog({ signature: key + ':' + youtubeIds, tracks, error: '' })
    }).catch(error => {
      if (!controller.signal.aborted) setCatalog({ signature: key + ':' + youtubeIds, tracks: [], error: error.message })
    })
    return () => controller.abort()
  }, [key, youtubeIds])
  const remoteTracks = catalog.signature === signature ? catalog.tracks : []
  const favoriteTracks = favorites.map(id => {
    const known = demoTracks.find(track => track.id === id) || remoteTracks.find(track => track.id === id)
    if (known) return known
    if (/^yt:[\w-]{11}$/.test(id)) return { id, videoId: id.slice(3), title: 'Video guardado', artistName: 'YouTube', albumTitle: 'YouTube', source: 'youtube' }
    return null
  }).filter(Boolean)
  const saveError = (state.owner === key ? state.error : '') || (catalog.signature === signature ? catalog.error : '')
  function toggleFavorite(id) {
    if (!user) { navigate('/login', { state: { from: location.pathname + location.search } }); return }
    const next = favorites.includes(id) ? favorites.filter(item => item !== id) : [...favorites, id]
    let error = ''
    try { localStorage.setItem(key, JSON.stringify(next)) }
    catch { error = 'Tus favoritos cambiaron en esta sesión, pero no se pudieron guardar en el navegador.' }
    setState({ owner: key, favorites: next, error })
  }
  return <FavoritesContext.Provider value={{ favorites, favoriteTracks, toggleFavorite, saveError }}>{children}</FavoritesContext.Provider>
}
