import { Link } from 'react-router-dom'
import { Play, Headphones, ArrowUpRight } from 'lucide-react'
import { albums, artists, tracks } from '../../data/mockData'
import AlbumCard from '../../components/Cards/AlbumCard'
import TrackList from '../../components/TrackList/TrackList'
import CatalogNotice from '../../components/CatalogNotice'
import styles from './Home.module.css'

export default function Home() {

  return (
    <div className={styles.home}>
      <section className={styles.hero} aria-labelledby="home-title">
        <div className={styles.heroContent}>
          <span className={styles.eyebrow}>DALE PLAY A TU DÍA</span>
          <h1 className={styles.title} id="home-title">
            Encontrá tu<br /><em>próximo favorito.</em>
          </h1>
          <p className={styles.description}>Un espacio para descubrir, escuchar y volver a empezar.</p>
          <Link className={styles.primary} to="/buscar">
            <Play size={18} fill="currentColor" aria-hidden="true" />
            Buscar en YouTube
          </Link>
        </div>

        <div className={styles.heroVisual} aria-hidden="true">
          <div className={styles.orbit} />
          <div className={styles.record}>
            <div className={styles.recordCenter}><Headphones size={44} /></div>
          </div>
          <span className={styles.visualCaption}>TU MÚSICA, A TU RITMO.</span>
        </div>
      </section>

      <section className={styles.section} aria-labelledby="albums-title">
        <div className={styles.sectionHeading}>
          <div><span className={styles.sectionLabel}>DESCUBRÍ ALGO NUEVO</span><h2 id="albums-title">Álbumes para explorar</h2></div>
          <span className={styles.selection}>SELECCIÓN DEL DÍA</span>
        </div>
        <div className={styles.albumGrid}>
          {albums.map(album => <AlbumCard album={album} key={album.id} />)}
        </div>
      </section>

      <section className={styles.section} aria-labelledby="artists-title">
        <div className={styles.sectionHeading}>
          <div><span className={styles.sectionLabel}>ENCONTRÁ TU SONIDO</span><h2 id="artists-title">Artistas del catálogo</h2></div>
          <Link className={styles.exploreLink} to="/buscar">Explorar <ArrowUpRight size={16} aria-hidden="true" /></Link>
        </div>
        <div className={styles.artistList}>
          {artists.map(artist => (
            <Link className={styles.artistCard} key={artist.id} to={'/buscar?' + new URLSearchParams({ q: artist.name })}>
              <span className={styles.artistImage}><img src={artist.image} alt="" loading="lazy" /></span>
              <span className={styles.artistName}>{artist.name}</span>
              <span className={styles.artistType}>Artista</span>
            </Link>
          ))}
        </div>
      </section>

      <section className={styles.section} aria-labelledby="tracks-title">
        <div className={styles.sectionHeading}>
          <div><span className={styles.sectionLabel}>UN PLAY Y ARRANCAMOS</span><h2 id="tracks-title">Dale una escucha</h2></div>
          <span className={styles.trackCount}>{tracks.length} canciones</span>
        </div>
        <div className={styles.notice}><CatalogNotice /></div>
        <div className={styles.trackPanel}><TrackList tracks={tracks} /></div>
      </section>
    </div>
  )
}
