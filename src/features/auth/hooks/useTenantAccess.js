import { useSyncExternalStore } from 'react'

const key = 'smartomni.platform-demo.v1'
const eventName = 'smartomni:platform-demo'
function subscribe(listener) {
  function storage(event) { if (event.key === key || event.key === null) listener() }
  window.addEventListener('storage', storage)
  window.addEventListener(eventName, listener)
  return () => { window.removeEventListener('storage', storage); window.removeEventListener(eventName, listener) }
}
// Read only the current tenant's access flag. Merchant routes never import admin fixtures.
export function useTenantAccess(tenantId) {
  return useSyncExternalStore(subscribe, () => {
    if (!tenantId) return null
    try { return JSON.parse(localStorage.getItem(key))?.tenants?.find(tenant => tenant.id === tenantId)?.status || 'ACTIVE' } catch { return 'ACTIVE' }
  }, () => 'ACTIVE')
}
