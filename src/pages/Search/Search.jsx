import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Search as SearchIcon, X, Music2, Video } from 'lucide-react'
import { searchAudius } from '../../services/audius'
import { searchYouTube, hasYouTubeKey } from '../../services/youtube'
import TrackList from '../../components/TrackList/TrackList'
import styles from './Search.module.css'

const emptyResult = { query: '', audius: [], youtube: [], error: '', loading: false }

export default function Search() {
  const [params, setParams] = useSearchParams()
  const text = params.get('q') || ''
  const query = text.trim()
  const [result, setResult] = useState(emptyResult)

  useEffect(() => {
    if (!query) {
      setResult(emptyResult)
      return
    }

    const controller = new AbortController()
    const timer = setTimeout(async () => {
      setResult({ ...emptyResult, query, loading: true })
      const [audiusResult, youtubeResult] = await Promise.allSettled([
        searchAudius(query, { signal: controller.signal }),
        hasYouTubeKey
          ? searchYouTube(query, { signal: controller.signal }).then(data => data.tracks)
          : Promise.resolve([]),
      ])
      if (controller.signal.aborted) return

      const audius = audiusResult.status === 'fulfilled' ? audiusResult.value : []
      const youtube = youtubeResult.status === 'fulfilled' ? youtubeResult.value : []
      const errors = []
      if (audiusResult.status === 'rejected') errors.push(audiusResult.reason?.message || 'No pudimos consultar Audius.')
      if (hasYouTubeKey && youtubeResult.status === 'rejected') errors.push(youtubeResult.reason?.message || 'No pudimos consultar YouTube.')
      if (!hasYouTubeKey) errors.push('Para sumar videos musicales de YouTube, configurá VITE_YOUTUBE_API_KEY en .env.local.')
      setResult({ query, audius, youtube, loading: false, error: errors.join(' ') })
    }, 450)

    return () => { clearTimeout(timer); controller.abort() }
  }, [query])

  function updateQuery(value) {
    const next = new URLSearchParams(params)
    if (value) next.set('q', value)
    else next.delete('q')
    setParams(next, { replace: true })
  }

  const pending = Boolean(query && (result.query !== query || result.loading))
  const audiusTracks = result.query === query ? result.audius : []
  const youtubeTracks = result.query === query ? result.youtube : []
  const combinedTracks = [...audiusTracks, ...youtubeTracks]

  return <section className={styles.page} aria-labelledby="search-title">
    <header className={styles.hero}>
      <div className={styles.heroContent}>
        <span className={styles.eyebrow}>MÚSICA INDEPENDIENTE + VIDEOS MUSICALES</span>
        <h1 className={styles.title} id="search-title">Buscá tu próximo favorito</h1>
        <p className={styles.description}>Descubrí artistas independientes en Audius y encontrá videos musicales en YouTube, todo desde una búsqueda.</p>
        <div className={styles.searchBox}><SearchIcon size={20} aria-hidden="true" /><input aria-label="Buscar música" placeholder="Canción, artista o banda" type="search" value={text} onChange={e => updateQuery(e.target.value)} />{text && <button className={styles.clear} type="button" aria-label="Limpiar búsqueda" onClick={() => updateQuery('')}><X size={17} aria-hidden="true" /></button>}</div>
      </div>
      <div className={styles.searchArtwork} aria-hidden="true"><SearchIcon size={68} strokeWidth={1.3} /></div>
    </header>
    <div className={styles.sectionHeading}><h2>{query ? 'Resultados combinados' : '¿Qué querés escuchar?'}</h2>{query && !pending && <span className={styles.resultCount}>{combinedTracks.length} resultados</span>}</div>
    <p className={styles.notice}>Audius ofrece streams de audio independiente. YouTube ofrece videos y no garantiza reproducción en segundo plano. Cada servicio y pista tiene sus propias condiciones.</p>
    {!query ? <div className={styles.suggestions}>{['Soda Stereo', 'Duki', 'Tame Impala', 'indie rock', 'lofi', 'electronic'].map(name => <button key={name} type="button" onClick={() => updateQuery(name)}>{name}</button>)}</div>
      : pending ? <p className={styles.apiMessage} role="status">Buscando en Audius y YouTube…</p>
        : <>
          {result.error && <p className={styles.apiMessage} role="status">{result.error}</p>}
          {audiusTracks.length > 0 && <section className={styles.panel} aria-labelledby="audius-results-title">
            <div className={styles.sectionHeading}><h2 id="audius-results-title"><Music2 size={18} aria-hidden="true" /> Audio independiente · Audius</h2><span className={styles.resultCount}>{audiusTracks.length}</span></div>
            <TrackList tracks={audiusTracks} queue={combinedTracks} emptyMessage="No hay canciones de Audius para esta búsqueda." />
          </section>}
          {youtubeTracks.length > 0 && <section className={styles.panel} aria-labelledby="youtube-results-title">
            <div className={styles.sectionHeading}><h2 id="youtube-results-title"><Video size={18} aria-hidden="true" /> Videos musicales · YouTube</h2><span className={styles.resultCount}>{youtubeTracks.length}</span></div>
            <TrackList tracks={youtubeTracks} queue={combinedTracks} emptyMessage="No hay videos de YouTube para esta búsqueda." />
          </section>}
          {!combinedTracks.length && !result.error && <div className={styles.panel}><TrackList tracks={[]} emptyMessage="No encontramos resultados. Probá con otro título o artista." /></div>}
        </>}
    <a className={styles.sourceLink} href="https://audius.co" target="_blank" rel="noreferrer">Audius</a>
    {' · '}
    <a className={styles.sourceLink} href="https://www.youtube.com" target="_blank" rel="noreferrer">YouTube</a>
  </section>
}
