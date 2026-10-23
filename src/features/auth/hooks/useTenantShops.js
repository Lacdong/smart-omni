import { useSyncExternalStore } from 'react'

const key = 'smartomni.platform-demo.v1'
function subscribe(listener) {
  const storage = event => { if (event.key === key || event.key === null) listener() }
  window.addEventListener('storage', storage)
  window.addEventListener('smartomni:platform-demo', listener)
  return () => { window.removeEventListener('storage', storage); window.removeEventListener('smartomni:platform-demo', listener) }
}
export function useTenantShops(tenantId) {
  const snapshot = useSyncExternalStore(subscribe, () => {
    try { return JSON.stringify(JSON.parse(localStorage.getItem(key))?.tenants?.find(tenant => tenant.id === tenantId)?.shops || []) } catch { return '[]' }
  }, () => '[]')
  return JSON.parse(snapshot)
}
