import { getDemoSession } from '@/features/auth/lib/demoSession'
import { initialAudit, initialPlans, initialTenants } from '../data/platformFixtures'

const key = 'smartomni.platform-demo.v1'
const listeners = new Set()
const seed = () => ({ tenants: structuredClone(initialTenants), plans: structuredClone(initialPlans), audit: structuredClone(initialAudit) })
function readState() {
  try {
    const stored = JSON.parse(localStorage.getItem(key))
    if (stored && Array.isArray(stored.tenants) && stored.tenants.length === initialTenants.length && stored.tenants.every(item => initialTenants.some(tenant => tenant.id === item.id) && ['ACTIVE', 'SUSPENDED', 'ONBOARDING'].includes(item.status)) && Array.isArray(stored.plans) && stored.plans.length === 2 && stored.plans.every(plan => ['Free', 'Pro'].includes(plan.id) && [plan.skuLimit, plan.shopLimit, plan.staffLimit].every(value => Number.isSafeInteger(value) && value > 0)) && Array.isArray(stored.audit)) return stored
  } catch { /* Missing, invalid or inaccessible storage uses the fixtures. */ }
  return seed()
}
let state = readState()

export const getPlatformSnapshot = () => state
export function subscribePlatform(listener) { listeners.add(listener); return () => listeners.delete(listener) }
window.addEventListener('storage', event => {
  if (event.key === key || event.key === null) { state = readState(); listeners.forEach(listener => listener()) }
})

function commit(next) {
  const session = getDemoSession()
  if (session?.role !== 'SUPER_ADMIN') throw new Error('Super Admin access is required.')
  try { localStorage.setItem(key, JSON.stringify(next)) } catch { throw new Error('Browser storage is unavailable. Your change was not saved.') }
  state = next
  listeners.forEach(listener => listener())
  window.dispatchEvent(new Event('smartomni:platform-demo'))
}
function auditEntry(action, target, reason, tenantId) {
  return { id: crypto.randomUUID(), at: new Date().toISOString(), actor: getDemoSession()?.name || 'Super Admin', action, target, reason, ...(tenantId ? { tenantId } : {}) }
}
export function changeTenantStatus(id, reason) {
  const tenant = state.tenants.find(item => item.id === id)
  if (!tenant || !['ACTIVE', 'SUSPENDED'].includes(tenant.status)) throw new Error('Only active or suspended tenants can change access.')
  if (!reason.trim()) throw new Error('Enter a reason for this change.')
  const status = tenant.status === 'ACTIVE' ? 'SUSPENDED' : 'ACTIVE'
  const nextTenant = { ...tenant, status, suspensionReason: status === 'SUSPENDED' ? reason.trim() : null }
  commit({ ...state, tenants: state.tenants.map(item => item.id === id ? nextTenant : item), audit: [auditEntry(status === 'SUSPENDED' ? 'Tenant suspended' : 'Tenant reactivated', tenant.name, reason.trim(), id), ...state.audit] })
}
export function updatePlan(id, draft, reason) {
  const plan = state.plans.find(item => item.id === id)
  if (!plan) throw new Error('Plan not found.')
  if (!reason.trim()) throw new Error('Enter a reason for this change.')
  if (![draft.skuLimit, draft.shopLimit, draft.staffLimit].every(value => Number.isSafeInteger(value) && value > 0 && value <= 1000000)) throw new Error('Enter whole-number limits between 1 and 1,000,000.')
  if (id === 'Free' && draft.shopLimit !== 1) throw new Error('Free is limited to one shop connection.')
  const nextPlan = { ...plan, description: draft.description.trim(), skuLimit: draft.skuLimit, shopLimit: draft.shopLimit, staffLimit: draft.staffLimit }
  if (!nextPlan.description) throw new Error('Enter a plan description.')
  if (JSON.stringify(nextPlan) === JSON.stringify(plan)) throw new Error('No changes to save.')
  const changes = ['skuLimit', 'shopLimit', 'staffLimit'].filter(field => plan[field] !== nextPlan[field]).map(field => `${field}: ${plan[field]} → ${nextPlan[field]}`).join('; ')
  commit({ ...state, plans: state.plans.map(item => item.id === id ? nextPlan : item), audit: [auditEntry('Plan updated', id, `${reason.trim()}${changes ? ` · ${changes}` : ' · Description updated'}`), ...state.audit] })
}
export function usageIssues(tenant, plan) {
  return [[tenant.skus, plan.skuLimit, 'SKUs'], [tenant.shops.length, plan.shopLimit, 'shops'], [tenant.staff, plan.staffLimit, 'staff']].filter(([used, limit]) => used > limit).map(([used, limit, label]) => `${used} / ${limit} ${label}`)
}
