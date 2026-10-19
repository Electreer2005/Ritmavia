import { Link, useParams } from 'react-router-dom'
import { Search, Music2 } from 'lucide-react'

export default function Album() {
  const { albumId } = useParams()
  return (
    <section className="glass-empty" aria-labelledby="album-title">
      <span className="glass-empty-icon"><Music2 size={30} /></span>
      <span className="eyebrow">RITMAVIA · DESCUBRÍ MÚSICA</span>
      <h1 id="album-title">Este álbum ya no forma parte de la demo</h1>
      <p>Quitamos los álbumes y canciones de ejemplo. Buscá música real y reproducí los videos disponibles en YouTube.</p>
      <Link className="text-button" to={'/buscar?q=' + encodeURIComponent(albumId || '')}><Search size={17} /> Buscar música</Link>
    </section>
  )
}
