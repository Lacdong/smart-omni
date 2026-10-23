import { useSyncExternalStore } from 'react'
import { getOwnerState, ownerConnections } from '@/features/portal/lib/ownerWorkspaceStore'

const key = 'smartomni.platform-demo.v1'
function subscribe(listener) {
  const storage = event => { if (event.key === key || event.key === 'smartomni.owner-workspace-demo.v1' || event.key === null) listener() }
  window.addEventListener('storage', storage)
  window.addEventListener('smartomni:platform-demo', listener)
  window.addEventListener('smartomni:owner-workspace', listener)
  return () => { window.removeEventListener('storage', storage); window.removeEventListener('smartomni:platform-demo', listener); window.removeEventListener('smartomni:owner-workspace', listener) }
}
export function useTenantShops(tenantId) {
  const snapshot = useSyncExternalStore(subscribe, () => {
    try { const platform = JSON.parse(localStorage.getItem(key)) || {}; return tenantId === 'demo-tenant' ? JSON.stringify(ownerConnections(getOwnerState(), platform.tenants?.find(tenant => tenant.id === tenantId), platform)) : '[]' } catch { return '[]' }
  }, () => '[]')
  return JSON.parse(snapshot)
}
