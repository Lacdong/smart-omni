import { useId, useState } from 'react'
import { Info } from 'lucide-react'
import { Button } from '@/shared/ui/button'
import { PasswordField } from './PasswordField'
import { validateField } from '../lib/validation'
import styles from './AuthForm.module.css'

export function AuthForm({ secondaryAction }) {
  const id = useId()
  const [values, setValues] = useState({ email: '', password: '' })
  const [errors, setErrors] = useState({})
  const [touched, setTouched] = useState({})
  const [submitted, setSubmitted] = useState(false)
  const [notice, setNotice] = useState('')

  function change(event) {
    const { name, value } = event.target
    setValues(current => ({ ...current, [name]: value }))
    setNotice('')
    if (touched[name] || submitted) setErrors(current => ({ ...current, [name]: validateField(name, value) }))
  }

  function blur(event) {
    const { name, value } = event.target
    setTouched(current => ({ ...current, [name]: true }))
    setErrors(current => ({ ...current, [name]: validateField(name, value) }))
  }

  function submit(event) {
    event.preventDefault()
    const nextErrors = Object.fromEntries(Object.entries(values).map(([name, value]) => [name, validateField(name, value)]))
    setSubmitted(true)
    setErrors(nextErrors)
    setNotice('')
    const invalidField = Object.keys(nextErrors).find(name => nextErrors[name])
    if (invalidField) {
      event.currentTarget.elements.namedItem(invalidField)?.focus()
      return
    }
    setNotice('Sign-in is not connected yet. You have not been signed in. Your credentials have not been sent or saved.')
  }

  return <div className={styles.container}>
    <div className={styles.intro}>
      <p className={styles.eyebrow}>YOUR WORKSPACE, TOGETHER</p>
      <h1>Welcome back.</h1>
      <p className={styles.subtitle}>Sign in to your SmartOmni workspace.</p>
    </div>
    <form noValidate onSubmit={submit} aria-label="Sign in">
      <div className={styles.field}>
        <label htmlFor={`${id}-email`}>Email address</label>
        <input id={`${id}-email`} name="email" type="email" required autoComplete="email"
          autoCapitalize="none" spellCheck={false} value={values.email} onChange={change} onBlur={blur}
          placeholder="you@example.com" className={styles.input}
          aria-invalid={Boolean(errors.email)} aria-describedby={`${id}-email-error`} />
        <p id={`${id}-email-error`} className={styles.error} aria-live="polite">{errors.email || ''}</p>
      </div>
      <PasswordField id={`${id}-password`} value={values.password} onChange={change} onBlur={blur}
        error={errors.password} autoComplete="current-password" />
      <div className={styles.actions}>{secondaryAction}<Button type="submit" className={styles.submit}>Sign in</Button></div>
      <div className={styles.notice} role="status" aria-live="polite" aria-atomic="true">
        {notice && <div className={styles.noticeContent}><Info size={18} aria-hidden="true" /><p>{notice}</p></div>}
      </div>
    </form>
  </div>
}
