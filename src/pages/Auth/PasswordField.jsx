import { useId, useState } from 'react'
import { Eye, EyeOff } from 'lucide-react'
import styles from './Auth.module.css'
export default function PasswordField({ label = 'Contraseña', value, onChange, autoComplete = 'current-password', minLength = 8 }) {
  const [visible, setVisible] = useState(false)
  const id = useId()
  return <div className={styles.field}><label htmlFor={id}>{label}</label><div className={styles.password}>
    <input id={id} type={visible ? 'text' : 'password'} value={value} onChange={onChange} required minLength={minLength} maxLength={128} autoComplete={autoComplete} />
    <button type="button" aria-label={visible ? 'Ocultar contraseña' : 'Mostrar contraseña'} aria-pressed={visible} onClick={() => setVisible(!visible)}>{visible ? <EyeOff size={19} /> : <Eye size={19} />}</button>
  </div></div>
}
