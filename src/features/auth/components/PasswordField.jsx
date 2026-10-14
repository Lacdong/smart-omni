import { useState } from 'react'
import { Eye, EyeOff } from 'lucide-react'
import { Button } from '@/shared/ui/button'
import formStyles from './AuthForm.module.css'
import styles from './PasswordField.module.css'

export function PasswordField({ id, value, onChange, onBlur, error, autoComplete = 'new-password', name = 'password', label = 'Password' }) {
  const [visible, setVisible] = useState(false)
  return <div className={formStyles.field}>
    <label htmlFor={id}>{label}</label>
    <div className={styles.control}>
      <input id={id} name={name} type={visible ? 'text' : 'password'} required
        autoComplete={autoComplete} value={value} onChange={onChange} onBlur={onBlur}
        placeholder={name === 'confirmPassword' ? 'Re-enter your password' : 'Enter your password'} className={`${formStyles.input} ${styles.input}`}
        aria-invalid={Boolean(error)} aria-describedby={`${id}-error`} />
      <Button type="button" variant="ghost" size="icon" className={styles.toggle}
        aria-label={`${visible ? 'Hide' : 'Show'} ${name === 'confirmPassword' ? 'confirm password' : 'password'}`} aria-pressed={visible}
        aria-controls={id} onClick={() => setVisible(current => !current)}>
        {visible ? <EyeOff aria-hidden="true" /> : <Eye aria-hidden="true" />}
      </Button>
    </div>
    <p id={`${id}-error`} className={formStyles.error} aria-live="polite">{error || ''}</p>
  </div>
}
