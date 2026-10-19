import { Link, useParams } from 'react-router-dom'
import { Play } from 'lucide-react'
import { getAlbumById, getArtistById, getTracksByAlbum } from '../../data/mockData'
import { usePlayerStore } from '../../store/playerStore'
import TrackList from '../../components/TrackList/TrackList'
import CatalogNotice from '../../components/CatalogNotice'
export default function Album() {
  const { albumId } = useParams()
  const album = getAlbumById(albumId)
  const playTrack = usePlayerStore(s => s.playTrack)
  if (!album) return <section><h1>Álbum no encontrado</h1><Link className="text-button" to="/">Volver al inicio</Link></section>
  const tracks = getTracksByAlbum(album.id)
  return <section>
    <div className="album-heading"><img src={album.cover} alt={'Portada de ejemplo de ' + album.title} /><div><span className="eyebrow">ÁLBUM</span><h1>{album.title}</h1><p className="muted">{getArtistById(album.artistId)?.name} · {album.year} · {tracks.length} canciones</p><button className="primary" disabled={!tracks.length} onClick={() => playTrack(tracks[0], tracks)}><Play size={18} fill="currentColor" />Reproducir álbum</button></div></div>
    <CatalogNotice /><TrackList tracks={tracks} />
  </section>
}
