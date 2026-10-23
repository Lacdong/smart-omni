// Lightweight journal writer so auth/settings never import business fixtures.
export function recordOwnerSettingActivity(action) {
  try {
    if (sessionStorage.getItem('smartomni.demo-session') !== 'demo-owner') return
    const key = 'smartomni.owner-workspace-demo.v1'
    const state = JSON.parse(localStorage.getItem(key)) || {}
    const audit = { id: crypto.randomUUID(), at: new Date().toISOString(), actor: 'Tenant Owner demo', action, detail: 'Settings or team updated in this browser.', tenantId: 'demo-tenant', source: 'Local demo' }
    localStorage.setItem(key, JSON.stringify({ ...state, audit: [audit, ...(Array.isArray(state.audit) ? state.audit : [])].slice(0, 200) }))
    window.dispatchEvent(new Event('smartomni:owner-workspace'))
  } catch { /* A secondary journal failure must not misreport a completed save. */ }
}
