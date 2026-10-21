import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Search as SearchIcon, X } from 'lucide-react'
import { searchAudius } from '../../services/audius'
import TrackList from '../../components/TrackList/TrackList'
import styles from './Search.module.css'

export default function Search() {
  const [params, setParams] = useSearchParams()
  const text = params.get('q') || ''
  const query = text.trim()
  const [result, setResult] = useState({ query: '', tracks: [], error: '', loading: false })

  useEffect(() => {
    if (!query) {
      setResult({ query: '', tracks: [], error: '', loading: false })
      return
    }
    const controller = new AbortController()
    const timer = setTimeout(async () => {
      setResult({ query, tracks: [], error: '', loading: true })
      try {
        const tracks = await searchAudius(query, { signal: controller.signal })
        if (!controller.signal.aborted) setResult({ query, tracks, loading: false, error: '' })
      } catch (error) {
        if (!controller.signal.aborted) setResult({ query, tracks: [], loading: false, error: error.message || 'No pudimos conectar con Audius.' })
      }
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
  const shown = result.query === query ? result.tracks : []

  return <section className={styles.page} aria-labelledby="search-title">
    <header className={styles.hero}>
      <div className={styles.heroContent}>
        <span className={styles.eyebrow}>MÚSICA INDEPENDIENTE · AUDIUS</span>
        <h1 className={styles.title} id="search-title">Buscá tu próximo favorito</h1>
        <p className={styles.description}>Descubrí artistas independientes y reproducí audio directamente en Ritmavia.</p>
        <div className={styles.searchBox}><SearchIcon size={20} aria-hidden="true" /><input aria-label="Buscar música en Audius" placeholder="Canción, artista o banda" type="search" value={text} onChange={e => updateQuery(e.target.value)} />{text && <button className={styles.clear} type="button" aria-label="Limpiar búsqueda" onClick={() => updateQuery('')}><X size={17} aria-hidden="true" /></button>}</div>
      </div>
      <div className={styles.searchArtwork} aria-hidden="true"><SearchIcon size={68} strokeWidth={1.3} /></div>
    </header>
    <div className={styles.sectionHeading}><h2>{query ? 'Resultados de Audius' : '¿Qué querés escuchar?'}</h2>{query && !pending && <span className={styles.resultCount}>{shown.length} canciones</span>}</div>
    <p className={styles.notice}>Catálogo independiente de Audius. La disponibilidad y las condiciones de cada pista dependen de su publicación y licencia.</p>
    {!query ? <div className={styles.suggestions}>{['Tame Impala', 'electronic', 'indie rock', 'lofi', 'house', 'latin'].map(name => <button key={name} type="button" onClick={() => updateQuery(name)}>{name}</button>)}</div>
      : pending ? <p className={styles.apiMessage} role="status">Buscando en Audius…</p>
        : result.error ? <p className={styles.apiMessage} role="alert">{result.error}</p>
          : <div className={styles.panel}><TrackList tracks={shown} emptyMessage="No encontramos canciones para esa búsqueda. Probá otro título, artista o género." /></div>}
    <a className={styles.sourceLink} href="https://audius.co" target="_blank" rel="noreferrer">Catálogo proporcionado por Audius</a>
  </section>
}
