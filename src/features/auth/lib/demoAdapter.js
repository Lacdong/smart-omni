import { marketplaces } from '../data/onboardingContent'

// Synchronous, deterministic UI fixtures. This adapter never calls a provider or API.
export function previewShop(marketplace) {
  const provider = marketplaces.find(item => item.key === marketplace)
  if (!provider) return null
  return { demoKey: `demo-${provider.key}`, marketplace: provider.key, name: `Sample ${provider.name} shop`, source: 'demo', status: 'AWAITING_CONFIRMATION' }
}

export function previewImport(outcome) {
  const fixtures = {
    COMPLETED: { status: 'COMPLETED', succeeded: 12, needsAttention: 0 },
    PARTIAL: { status: 'PARTIAL', succeeded: 8, needsAttention: 4 },
    FAILED: { status: 'FAILED', succeeded: 0, needsAttention: 12 },
  }
  return fixtures[outcome] ? { ...fixtures[outcome], source: 'demo' } : null
}
