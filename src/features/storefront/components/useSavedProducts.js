import { useSyncExternalStore } from 'react'
import { products } from '../data/catalog'

const storageKey = 'smartomni:everyday-studio:saved-products'
const eventName = 'smartomni:saved-products-changed'
let fallback = '[]'
function snapshot() { try { return localStorage.getItem(storageKey) || fallback } catch { return fallback } }
function subscribe(callback) {
  window.addEventListener('storage', callback)
  window.addEventListener(eventName, callback)
  return () => { window.removeEventListener('storage', callback); window.removeEventListener(eventName, callback) }
}
function parse(value) {
  try { const ids = JSON.parse(value); return Array.isArray(ids) ? [...new Set(ids.filter(id => products.some(product => product.id === id)))] : [] } catch { return [] }
}
export function useSavedProducts() {
  const value = useSyncExternalStore(subscribe, snapshot, () => '[]')
  const savedIds = parse(value)
  function toggle(id) {
    const current = parse(snapshot())
    fallback = JSON.stringify(current.includes(id) ? current.filter(item => item !== id) : [id, ...current])
    try { localStorage.setItem(storageKey, fallback) } catch { /* Keep saved items for the current session if storage is unavailable. */ }
    window.dispatchEvent(new Event(eventName))
  }
  return { savedIds, toggle }
}
