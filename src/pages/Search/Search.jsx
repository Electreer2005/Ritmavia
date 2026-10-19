import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Search as SearchIcon, X } from 'lucide-react'
import { searchYouTube, hasYouTubeKey } from '../../services/youtube'
import TrackList from '../../components/TrackList/TrackList'
import styles from './Search.module.css'

export default function Search() {
  const [params, setParams] = useSearchParams()
  const text = params.get('q') || ''
  const query = text.trim()
  const [result, setResult] = useState({ query: '', tracks: [], error: '', loading: false })
  useEffect(() => {
    if (!query || !hasYouTubeKey) return
    const controller = new AbortController()
    const timer = setTimeout(async () => {
      setResult({ query, tracks: [], error: '', loading: true })
      try {
        const data = await searchYouTube(query, { signal: controller.signal })
        if (!controller.signal.aborted) setResult({ query, tracks: data.tracks, loading: false, error: '' })
      } catch (error) {
        if (!controller.signal.aborted) setResult({ query, tracks: [], loading: false, error: error.message || 'No pudimos conectar con YouTube.' })
      }
    }, 700)
    return () => { clearTimeout(timer); controller.abort() }
  }, [query])
  function updateQuery(value) {
    const next = new URLSearchParams(params)
    if (value) next.set('q', value)
    else next.delete('q')
    setParams(next, { replace: true })
  }
  const pending = Boolean(query && hasYouTubeKey && (result.query !== query || result.loading))
  const shown = result.query === query ? result.tracks : []
  return <section className={styles.page} aria-labelledby="search-title">
    <header className={styles.hero}>
      <div className={styles.heroContent}>
        <span className={styles.eyebrow}>MÚSICA EN YOUTUBE</span>
        <h1 className={styles.title} id="search-title">Buscá tu próximo favorito</h1>
        <p className={styles.description}>Canciones y artistas conocidos, con el video siempre a la vista.</p>
        <div className={styles.searchBox}><SearchIcon size={20} aria-hidden="true" /><input aria-label="Buscar música en YouTube" placeholder="Canción, artista o banda" type="search" value={text} onChange={e => updateQuery(e.target.value)} />{text && <button className={styles.clear} type="button" aria-label="Limpiar búsqueda" onClick={() => updateQuery('')}><X size={17} aria-hidden="true" /></button>}</div>
      </div>
      <div className={styles.searchArtwork} aria-hidden="true"><SearchIcon size={68} strokeWidth={1.3} /></div>
    </header>
    <div className={styles.sectionHeading}><h2>{query ? 'Resultados de YouTube' : '¿Qué querés escuchar?'}</h2>{query && !pending && <span className={styles.resultCount}>{shown.length} videos</span>}</div>
    <p className={styles.notice}>Contenido de YouTube. La disponibilidad depende de cada video y su región.</p>
    {!hasYouTubeKey ? <p className={styles.apiMessage} role="status">Falta conectar la búsqueda: completá VITE_YOUTUBE_API_KEY en .env.local y reiniciá Vite.</p>
      : !query ? <div className={styles.suggestions}>{['Tame Impala', 'Daft Punk', 'Gorillaz', 'The Weeknd', 'Soda Stereo', 'Duki'].map(name => <button key={name} type="button" onClick={() => updateQuery(name)}>{name}</button>)}</div>
        : pending ? <p className={styles.apiMessage} role="status">Buscando en YouTube…</p>
          : result.error ? <p className={styles.apiMessage} role="alert">{result.error}</p>
            : <div className={styles.panel}><TrackList tracks={shown} emptyMessage="No encontramos videos para esa búsqueda. Probá otro título o artista." /></div>}
    <a className={styles.sourceLink} href="https://www.youtube.com" target="_blank" rel="noreferrer">Resultados proporcionados por YouTube</a>
  </section>
}
