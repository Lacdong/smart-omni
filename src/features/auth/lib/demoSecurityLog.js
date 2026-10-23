const key = 'smartomni.security-demo.v1'
const eventName = 'smartomni:security-demo'
function read() {
  try { const value = JSON.parse(localStorage.getItem(key)); return Array.isArray(value) ? value : [] } catch { return [] }
}
let snapshot = read()
const listeners = new Set()
export const getDemoSecurityEvents = () => snapshot
export function subscribeDemoSecurity(listener) { listeners.add(listener); return () => listeners.delete(listener) }
window.addEventListener('storage', event => { if (event.key === key || event.key === null) { snapshot = read(); listeners.forEach(listener => listener()) } })

// Record fixed event descriptions only; never accept passwords or arbitrary login input.
export function recordDemoSecurityEvent({ type, severity = 'INFO', actor, result, message, resource }) {
  const events = read()
  const previous = events[0]
  if (type === 'ACCESS_DENIED' && previous?.type === type && previous?.actor === actor && previous?.resource === resource && Date.now() - Date.parse(previous.at) < 1000) return
  const event = { id: crypto.randomUUID(), at: new Date().toISOString(), type, severity, actor, result, message, resource, source: 'Local demo' }
  try {
    const next = [event, ...events].slice(0, 300)
    localStorage.setItem(key, JSON.stringify(next))
    snapshot = next
    listeners.forEach(listener => listener())
    window.dispatchEvent(new Event(eventName))
  } catch { /* Authentication must remain usable if optional demo logging is unavailable. */ }
}
