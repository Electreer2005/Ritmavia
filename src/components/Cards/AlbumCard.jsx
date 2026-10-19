import { Link } from 'react-router-dom'
import { ArrowUpRight } from 'lucide-react'
import { getArtistById } from '../../data/mockData'
import styles from './AlbumCard.module.css'

export default function AlbumCard({ album }) {
  const artist = getArtistById(album.artistId)
  return (
    <Link
      className={styles.card}
      to={'/album/' + album.id}
      aria-label={'Ver álbum ' + album.title + (artist ? ', de ' + artist.name : '')}
    >
      <div className={styles.cover}>
        <img src={album.cover} alt="" loading="lazy" />
        <span className={styles.openIcon} aria-hidden="true"><ArrowUpRight size={21} /></span>
      </div>
      <div className={styles.info}>
        <strong className={styles.title} title={album.title}>{album.title}</strong>
        <span className={styles.artist} title={artist?.name}>{artist?.name || 'Artista desconocido'}</span>
        <span className={styles.details}>{album.year} · Álbum</span>
      </div>
    </Link>
  )
}
