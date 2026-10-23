import { useMemo, useSyncExternalStore } from 'react'

export const settingsKey = 'smartomni.store-settings-demo.v1'
export const teamKey = 'smartomni.team-demo.v1'
const changeEvent = 'smartomni:merchant-demo'
export const defaultSettings = {
  profile: { name: 'Everyday Studio', email: '', phone: '', description: 'Considered essentials for your space and your everyday.' },
  appearance: { accent: 'neutral', headline: '', announcement: '', density: 'comfortable' },
  policies: { shipping: '', returns: '', privacy: '' },
}
const accents = ['neutral', 'forest', 'navy']
export const staffPermissions = [{ id: 'orders:read', label: 'View orders' }, { id: 'inventory:read', label: 'View inventory alerts' }]

function raw(key) { try { return localStorage.getItem(key) || '' } catch { return '' } }
function decode(value, fallback) { try { return JSON.parse(value) ?? fallback } catch { return fallback } }
function subscribe(listener) {
  const onStorage = event => { if (!event.key || [settingsKey, teamKey].includes(event.key)) listener() }
  window.addEventListener('storage', onStorage)
  window.addEventListener(changeEvent, listener)
  return () => { window.removeEventListener('storage', onStorage); window.removeEventListener(changeEvent, listener) }
}
function useStored(key, fallback) {
  const value = useSyncExternalStore(subscribe, () => raw(key), () => '')
  return useMemo(() => decode(value, fallback), [value, fallback])
}
const emptyTeam = []
export function useStoreSettings() {
  const stored = useStored(settingsKey, defaultSettings)
  return normalizeSettings(stored)
}
export function useTeam() {
  const stored = useStored(teamKey, emptyTeam)
  return Array.isArray(stored) ? stored : emptyTeam
}
function normalizeSettings(value) {
  const result = {}
  for (const section of Object.keys(defaultSettings)) {
    result[section] = {}
    for (const [field, fallback] of Object.entries(defaultSettings[section])) result[section][field] = typeof value?.[section]?.[field] === 'string' ? value[section][field] : fallback
  }
  if (!accents.includes(result.appearance.accent)) result.appearance.accent = 'neutral'
  if (!['comfortable', 'compact'].includes(result.appearance.density)) result.appearance.density = 'comfortable'
  return result
}
function write(key, value) {
  try { localStorage.setItem(key, JSON.stringify(value)) } catch { throw new Error('Could not save. Allow browser storage and try again.') }
  window.dispatchEvent(new Event(changeEvent))
  window.dispatchEvent(new Event('smartomni:demo-session'))
}
function requireActiveTenant() {
  const platform = decode(raw('smartomni.platform-demo.v1'), {})
  if (platform.tenants?.find(item => item.id === 'demo-tenant')?.status === 'SUSPENDED') throw new Error('This workspace is suspended.')
}
function requireOwner() {
  if (sessionStorage.getItem('smartomni.demo-session') !== 'demo-owner') throw new Error('Only the workspace owner can make this change.')
  requireActiveTenant()
}
export function saveStoreSection(section, values) {
  requireOwner()
  if (!Object.hasOwn(defaultSettings, section)) throw new Error('Unknown settings section.')
  const current = normalizeSettings(decode(raw(settingsKey), defaultSettings))
  const next = normalizeSettings({ ...current, [section]: values })
  for (const field of Object.keys(next[section])) next[section][field] = next[section][field].trim()
  if (section === 'profile' && !next.profile.name) throw new Error('Enter your store name.')
  if (section === 'profile' && next.profile.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(next.profile.email)) throw new Error('Enter a valid contact email.')
  write(settingsKey, next)
}
export function readStaffMembership() {
  const team = decode(raw(teamKey), [])
  return Array.isArray(team) ? team.find(member => member.email === 'staff@smartomni.demo' && member.status !== 'REVOKED') : undefined
}
function readTeam() {
  const value = decode(raw(teamKey), [])
  return Array.isArray(value) ? value : []
}
function cleanPermissions(permissions) { return staffPermissions.filter(item => permissions.includes(item.id)).map(item => item.id) }
export function inviteStaff(email, permissions) {
  requireOwner()
  const normalized = email.trim().toLowerCase()
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalized)) throw new Error('Enter a valid email address.')
  if (['owner@smartomni.demo', 'admin@smartomni.demo'].includes(normalized)) throw new Error('This account cannot be invited as staff.')
  const team = readTeam()
  if (team.some(item => item.email === normalized && item.status !== 'REVOKED')) throw new Error('This email already has a membership or pending invitation.')
  const allowed = cleanPermissions(permissions)
  if (!allowed.length) throw new Error('Select at least one permission.')
  write(teamKey, [...team.filter(item => item.email !== normalized), { id: crypto.randomUUID(), email: normalized, permissions: allowed, status: 'INVITED', invitedAt: new Date().toISOString() }])
}
export function updateStaff(id, changes) {
  requireOwner()
  const team = readTeam()
  const member = team.find(item => item.id === id)
  if (!member) throw new Error('This membership is no longer available.')
  const status = changes.status || member.status
  const transitions = { INVITED: ['INVITED', 'REVOKED'], ACTIVE: ['ACTIVE', 'SUSPENDED', 'REVOKED'], SUSPENDED: ['SUSPENDED', 'ACTIVE', 'REVOKED'] }
  if (!transitions[member.status]?.includes(status)) throw new Error('This membership can no longer be changed. Refresh the page.')
  const permissions = cleanPermissions(changes.permissions || member.permissions)
  if (!permissions.length && status !== 'REVOKED') throw new Error('Select at least one permission.')
  write(teamKey, team.map(item => item.id === id ? { ...item, status, permissions } : item))
}
export function acceptStaffInvitation(id) {
  if (sessionStorage.getItem('smartomni.demo-session') !== 'demo-staff') throw new Error('Sign in as the invited demo staff account.')
  requireActiveTenant()
  const team = readTeam()
  const invitation = team.find(item => item.id === id && item.email === 'staff@smartomni.demo' && item.status === 'INVITED')
  if (!invitation) throw new Error('This invitation is no longer available.')
  write(teamKey, team.map(item => item.id === id ? { ...item, status: 'ACTIVE', acceptedAt: new Date().toISOString() } : item))
}
