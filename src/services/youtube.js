const API = 'https://www.googleapis.com/youtube/v3/'
export const hasYouTubeKey = Boolean(import.meta.env.VITE_YOUTUBE_API_KEY)
export function decodeTitle(text) {
  const node = document.createElement('textarea')
  node.innerHTML = text || ''
  return node.value
}
export function normalizeVideo(item) {
  const videoId = typeof item.id === 'string' ? item.id : item.id?.videoId
  if (!/^[\w-]{11}$/.test(videoId || '')) return null
  return {
    id: 'yt:' + videoId, videoId, source: 'youtube',
    title: decodeTitle(item.snippet?.title || 'Video de YouTube'),
    artistName: decodeTitle(item.snippet?.channelTitle || 'YouTube'),
    cover: item.snippet?.thumbnails?.medium?.url || item.snippet?.thumbnails?.default?.url || '',
    albumTitle: 'YouTube',
  }
}
async function request(resource, params, signal) {
  if (!hasYouTubeKey) throw new Error('Falta la clave de YouTube. Completá VITE_YOUTUBE_API_KEY en .env.local y reiniciá Vite.')
  const url = new URL(API + resource)
  Object.entries({ ...params, key: import.meta.env.VITE_YOUTUBE_API_KEY }).forEach(([key, value]) => url.searchParams.set(key, value))
  const response = await fetch(url, { signal })
  const data = await response.json()
  if (!response.ok) {
    const reason = data.error?.errors?.[0]?.reason
    if (['quotaExceeded', 'dailyLimitExceeded'].includes(reason)) throw new Error('Se alcanzó la cuota de búsquedas de YouTube. Intentá más tarde.')
    if (response.status === 403) throw new Error('YouTube rechazó la consulta. Revisá la API habilitada, la clave y sus restricciones de sitios.')
    throw new Error('No pudimos consultar YouTube. Intentá nuevamente.')
  }
  return data
}
export async function searchYouTube(query, { signal, pageToken = '' } = {}) {
  const data = await request('search', {
    part: 'snippet', q: query, type: 'video', videoCategoryId: '10',
    videoEmbeddable: 'true', videoSyndicated: 'true', maxResults: '15',
    regionCode: 'AR', relevanceLanguage: 'es', ...(pageToken ? { pageToken } : {}),
  }, signal)
  return { tracks: (data.items || []).map(normalizeVideo).filter(Boolean), nextPageToken: data.nextPageToken || '' }
}
export async function getYouTubeVideos(ids, signal) {
  const clean = [...new Set(ids)].filter(id => /^[\w-]{11}$/.test(id))
  const result = []
  for (let index = 0; index < clean.length; index += 50) {
    const data = await request('videos', { part: 'snippet', id: clean.slice(index, index + 50).join(',') }, signal)
    result.push(...(data.items || []).map(normalizeVideo).filter(Boolean))
  }
  return result
}
