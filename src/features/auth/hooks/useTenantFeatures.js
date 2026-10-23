import { useSyncExternalStore } from 'react'
import { defaultFeatures } from '@/features/platform/data/platformFeatures'

const key = 'smartomni.platform-demo.v1'
function subscribe(listener) {
  const storage = event => { if (event.key === key || event.key === null) listener() }
  window.addEventListener('storage', storage)
  window.addEventListener('smartomni:platform-demo', listener)
  return () => { window.removeEventListener('storage', storage); window.removeEventListener('smartomni:platform-demo', listener) }
}
function featureSnapshot(tenantId) {
  let features = defaultFeatures.Pro
  try {
    const state = JSON.parse(localStorage.getItem(key))
    const tenant = state?.tenants?.find(item => item.id === tenantId)
    const plan = state?.plans?.find(item => item.id === tenant?.plan)
    if (plan) features = { ...defaultFeatures[plan.id], ...plan.features }
  } catch { /* Default demo owner uses Pro until a plan is saved. */ }
  return ['inventoryAlerts', 'reportExport', 'activityFeed'].map(key => features[key] !== false ? '1' : '0').join('')
}
export function useTenantFeatures(tenantId) {
  const value = useSyncExternalStore(subscribe, () => featureSnapshot(tenantId), () => '111')
  return { inventoryAlerts: value[0] === '1', reportExport: value[1] === '1', activityFeed: value[2] === '1' }
}
