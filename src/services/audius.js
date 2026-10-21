const API = 'https://api.audius.co/v1'
const APP_NAME = 'Ritmavia'

function normalizeTrack(track) {
  if (!track?.id || !track?.title) return null
  const artwork = track.artwork || {}
  const cover = artwork['480x480'] || artwork['150x150'] || artwork['1000x1000'] || ''
  return {
    id: 'audius:' + track.id,
    source: 'audius',
    sourceId: String(track.id),
    title: track.title,
    artistName: track.user?.name || 'Artista independiente',
    cover,
    thumbnail: cover,
    albumTitle: track.album_title || 'Audius',
    duration: Number(track.duration) || 0,
    audioUrl: API + '/tracks/' + encodeURIComponent(track.id) + '/stream?app_name=' + encodeURIComponent(APP_NAME),
    permalink: track.permalink ? 'https://audius.co' + track.permalink : '',
  }
}

export async function searchAudius(query, { signal, limit = 20 } = {}) {
  const normalized = query.trim()
  if (!normalized) return []
  const url = new URL(API + '/tracks/search')
  url.searchParams.set('query', normalized)
  url.searchParams.set('limit', String(limit))
  url.searchParams.set('app_name', APP_NAME)
  const response = await fetch(url, { signal })
  if (!response.ok) {
    if (response.status === 429) throw new Error('Audius recibió demasiadas búsquedas. Esperá un momento y probá de nuevo.')
    throw new Error('No pudimos consultar el catálogo de Audius. Intentá nuevamente.')
  }
  const payload = await response.json()
  if (payload?.error) throw new Error('Audius no pudo completar la búsqueda.')
  return (payload?.data || []).map(normalizeTrack).filter(Boolean)
}
