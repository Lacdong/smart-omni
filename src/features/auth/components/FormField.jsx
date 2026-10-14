import { useId } from 'react'
import styles from './AuthForm.module.css'

export function FormField({ name, label, value, onChange, onBlur, error, hint, type = 'text', autoComplete, placeholder }) {
  const id = useId()
  return <div className={styles.field}>
    <label htmlFor={id}>{label}</label>
    <input id={id} name={name} type={type} required className={styles.input}
      value={value} onChange={onChange} onBlur={onBlur} autoComplete={autoComplete}
      autoCapitalize={name === 'email' || name === 'targetDomain' ? 'none' : undefined}
      spellCheck={name === 'email' || name === 'targetDomain' ? false : undefined}
      placeholder={placeholder} aria-invalid={Boolean(error)} aria-describedby={`${id}-error${hint ? ` ${id}-hint` : ''}`} />
    {hint && <p id={`${id}-hint`} className={styles.hint}>{hint}</p>}
    <p id={`${id}-error`} className={styles.error} aria-live="polite">{error || ''}</p>
  </div>
}
