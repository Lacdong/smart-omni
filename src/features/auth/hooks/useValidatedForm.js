import { useState } from 'react'
import { validateField } from '../lib/validation'

export function useValidatedForm(initialValues) {
  const [values, setValues] = useState(initialValues)
  const [errors, setErrors] = useState({})
  const [touched, setTouched] = useState({})
  const [submitted, setSubmitted] = useState(false)
  function change(event) {
    const { name, value } = event.target
    const next = { ...values, [name]: value }
    setValues(next)
    setErrors(current => {
      const updated = { ...current }
      if (touched[name] || submitted) updated[name] = validateField(name, value, next)
      if (name === 'password' && (touched.confirmPassword || submitted) && 'confirmPassword' in next) updated.confirmPassword = validateField('confirmPassword', next.confirmPassword, next)
      return updated
    })
  }
  function blur(event) {
    const { name, value } = event.target
    setTouched(current => ({ ...current, [name]: true }))
    setErrors(current => ({ ...current, [name]: validateField(name, value, values) }))
  }
  function check(event) {
    event.preventDefault()
    const nextErrors = Object.fromEntries(Object.entries(values).map(([name, value]) => [name, validateField(name, value, values)]))
    setSubmitted(true)
    setErrors(nextErrors)
    const invalid = Object.keys(nextErrors).find(name => nextErrors[name])
    if (invalid) event.currentTarget.elements.namedItem(invalid)?.focus()
    return !invalid
  }
  function clearCredentials() { setValues(current => ({ ...current, password: '', confirmPassword: '' })) }
  return { values, errors, change, blur, check, clearCredentials }
}
