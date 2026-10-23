import { demoAccounts, demoPassword } from '../data/demoAccounts'

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
  if (!account || password !== demoPassword) return { error: 'Demo email or password is incorrect. Check your credentials and try again.' }
  try {
    // Keep only a fixture identifier, never the password or a real authentication token.
    sessionStorage.setItem(storageKey, account.id)
    window.dispatchEvent(new Event(changeEvent))
    return { account }
  } catch { return { error: 'Session storage is unavailable. Allow browser storage to use demo sign-in.' } }
}

export function signOutDemo() {
  try { sessionStorage.removeItem(storageKey) } catch { /* Already inaccessible. */ }
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

