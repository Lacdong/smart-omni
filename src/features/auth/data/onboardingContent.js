export const OWNER_BASE = '/auth/register/owner'
export const ownerSteps = [
  { path: OWNER_BASE, label: 'Basic information' },
  { path: `${OWNER_BASE}/plan`, label: 'Select your plan' },
  { path: `${OWNER_BASE}/channels`, label: 'Sales channels' },
  { path: `${OWNER_BASE}/import`, label: 'Initial import' },
  { path: `${OWNER_BASE}/welcome`, label: 'Welcome' },
]

export const marketplaces = [
  { key: 'shopee', name: 'Shopee', mark: 'S', description: 'Preview bringing your Shopee shop into your workspace.' },
  { key: 'tiktok', name: 'TikTok Shop', mark: '♪', description: 'Preview bringing your TikTok Shop catalog together.' },
]

export const importStates = {
  NOT_STARTED: { label: 'Not started', description: 'Review your confirmed demo shops, then start the synchronization preview.' },
  IN_PROGRESS: { label: 'In progress', description: 'The demo is paused at an in-progress state. Choose a scenario to see its outcome.' },
  COMPLETED: { label: 'Completed · demo', description: 'The simulated import is complete. No real marketplace products were imported.' },
  PARTIAL: { label: 'Partially completed · demo', description: 'Some sample records succeeded, while others need attention. The overall import is incomplete.' },
  FAILED: { label: 'Failed · demo', description: 'This simulated attempt failed. No sample records were imported in this attempt.' },
}
