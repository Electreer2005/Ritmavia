import { Link } from 'react-router-dom'
import { Music2 } from 'lucide-react'
import styles from './NotFound.module.css'

export default function NotFound() {
  return (
    <section className={styles.NotFound} aria-labelledby="notfound-title">
      <div className={styles.badge} aria-hidden="true">
        <Music2 size={32} />
      </div>

      <p className={styles.code}>404</p>
      <h1 id="notfound-title" className={styles.title}>
        Esta página no existe
      </h1>
      <p className={styles.subtitle}>
        Puede que el enlace esté roto o que la página se haya movido.
      </p>

      <Link className={styles.button} to="/">
        Volver al inicio
      </Link>
    </section>
  )
}