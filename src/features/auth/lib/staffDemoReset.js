import { demoAccounts, demoPassword } from '../data/demoAccounts'

// Deliberately memory-only: refreshing the app restores the published fixture password.
const challenges = new Map()
const overrides = new Map()
export function demoCredentialFor(accountId) { return overrides.get(accountId) || demoPassword }
export function requestStaffDemoReset(email) {
  const account = demoAccounts.find(item => item.role === 'TENANT_STAFF' && item.email === email.trim().toLowerCase())
  const token = crypto.randomUUID()
  challenges.set(token, { accountId: account?.id || null, expiresAt: Date.now() + 10 * 60 * 1000 })
  return token
}
export function resetStaffDemoPassword(token, password, confirmation) {
  const challenge = challenges.get(token)
  if (!challenge?.accountId || challenge.expiresAt < Date.now()) throw new Error('This demo reset link is invalid, expired or was lost after reloading. Request a new link.')
  if (!password || password !== confirmation) throw new Error('Enter a new password and a matching confirmation.')
  overrides.set(challenge.accountId, password)
  challenges.delete(token)
  return challenge.accountId
}
