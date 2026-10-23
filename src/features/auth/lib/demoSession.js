import { demoAccounts, demoPassword } from '../data/demoAccounts'
import { recordDemoSecurityEvent } from './demoSecurityLog'

const storageKey = 'smartomni.demo-session'
const changeEvent = 'smartomni:demo-session'

export function getDemoSession() {
  try {
    const id = sessionStorage.getItem(storageKey)
    return demoAccounts.find(account => account.id === id) ?? null
  } catch { return null }
}

export function signInDemo(email, password) {
  const account = demoAccounts.find(item => item.email === email.trim().toLowerCase())
  if (!account || password !== demoPassword) {
    recordDemoSecurityEvent({ type: 'LOGIN_FAILURE', severity: 'WARNING', actor: account ? `${account.roleLabel} demo` : 'Unknown demo account', result: 'Rejected', message: 'Credentials did not match a demo account.', resource: '/auth/login' })
    return { error: 'Demo email or password is incorrect. Check your credentials and try again.' }
  }
  try {
    // Keep only a fixture identifier, never the password or a real authentication token.
    sessionStorage.setItem(storageKey, account.id)
    window.dispatchEvent(new Event(changeEvent))
    recordDemoSecurityEvent({ type: 'LOGIN_SUCCESS', actor: `${account.roleLabel} demo`, result: 'Allowed', message: 'Demo session started.', resource: '/auth/login' })
    return { account }
  } catch { return { error: 'Session storage is unavailable. Allow browser storage to use demo sign-in.' } }
}

export function signOutDemo() {
  const account = getDemoSession()
  try { sessionStorage.removeItem(storageKey) } catch { /* Already inaccessible. */ }
  if (account) recordDemoSecurityEvent({ type: 'LOGOUT', actor: `${account.roleLabel} demo`, result: 'Completed', message: 'Demo session ended.', resource: '/auth/login' })
  window.dispatchEvent(new Event(changeEvent))
}

export function subscribeDemoSession(listener) {
  window.addEventListener(changeEvent, listener)
  window.addEventListener('storage', listener)
  return () => {
    window.removeEventListener(changeEvent, listener)
    window.removeEventListener('storage', listener)
  }
}

