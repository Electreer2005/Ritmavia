import { Link } from 'react-router-dom'
import { Play, Headphones, ArrowUpRight, Sparkles, Search, Music2, Radio, Waves } from 'lucide-react'
import styles from './Home.module.css'

const discoveries = [
  { label: 'Pop argentino', query: 'pop argentino hits', icon: Waves },
  { label: 'Indie y alternativo', query: 'indie alternative music', icon: Sparkles },
  { label: 'Electrónica', query: 'electronic music mix', icon: Radio },
  { label: 'Rock nacional', query: 'rock nacional argentino', icon: Music2 },
  { label: 'Para bajar un cambio', query: 'chill music', icon: Headphones },
  { label: 'Lo que suena hoy', query: 'popular music 2026', icon: Play },
]

export default function Home() {
  return (
    <div className={styles.home}>
      <section className={styles.hero} aria-labelledby="home-title">
        <div className={styles.heroGlow} aria-hidden="true" />
        <div className={styles.heroContent}>
          <span className={styles.eyebrow}><span className={styles.liveDot} /> TU MÚSICA, SIN PAUSA</span>
          <h1 className={styles.title} id="home-title">Encontrá el sonido<br /><em>que va con vos.</em></h1>
          <p className={styles.description}>Buscá canciones, descubrí artistas y reproducí sus videos desde un solo lugar.</p>
          <Link className={styles.primary} to="/buscar">
            <Search size={18} aria-hidden="true" /> Explorar música <ArrowUpRight size={17} aria-hidden="true" />
          </Link>
        </div>
        <div className={styles.heroVisual} aria-hidden="true">
          <div className={styles.glassDisc}><div className={styles.discRing}><div className={styles.discCore}><Headphones size={38} /></div></div></div>
          <span className={styles.floatingTag}><span className={styles.equalizer}><i /><i /><i /><i /></span> Tu próximo descubrimiento</span>
          <span className={`${styles.orb} ${styles.orbOne}`} /><span className={`${styles.orb} ${styles.orbTwo}`} />
        </div>
      </section>

      <section className={styles.section} aria-labelledby="discover-title">
        <div className={styles.sectionHeading}>
          <div><span className={styles.sectionLabel}>UN BUEN LUGAR PARA EMPEZAR</span><h2 id="discover-title">¿Qué tenés ganas de escuchar?</h2></div>
          <span className={styles.sectionIcon}><Sparkles size={19} /></span>
        </div>
        <div className={styles.discoveryGrid}>
          {discoveries.map(({ label, query, icon: Icon }, index) => (
            <Link className={styles.discoveryCard} key={label} to={'/buscar?' + new URLSearchParams({ q: query })} style={{ '--delay': index * 65 + 'ms' }}>
              <span className={styles.discoveryIcon}><Icon size={21} strokeWidth={1.7} /></span>
              <span className={styles.discoveryLabel}>{label}</span>
              <ArrowUpRight className={styles.discoveryArrow} size={17} />
            </Link>
          ))}
        </div>
      </section>

      <section className={styles.bottomPanel}>
        <div className={styles.bottomIcon}><Music2 size={24} /></div>
        <div><h2>La próxima canción puede ser tu favorita.</h2><p>Buscá por artista, tema o banda. Los resultados llegan desde YouTube, no de un catálogo de demostración.</p></div>
        <Link to="/buscar" className={styles.textLink}>Encontrar música <ArrowUpRight size={16} /></Link>
      </section>
    </div>
  )
}
