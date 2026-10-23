// Illustrative tenant-local fixtures. No payment, customer or marketplace service is connected.
export const ownerWorkspaceKey = 'smartomni.owner-workspace-demo.v1'
export const snapshotDate = '2026-10-23'
export const billingInvoices = [
  { id: 'INV-DEMO-1003', date: '2026-10-01', period: 'October 2026', plan: 'Pro', amount: 590000, status: 'PAID' },
  { id: 'INV-DEMO-1002', date: '2026-09-01', period: 'September 2026', plan: 'Pro', amount: 590000, status: 'PAID' },
  { id: 'INV-DEMO-1001', date: '2026-08-01', period: 'August 2026', plan: 'Pro', amount: 590000, status: 'FAILED' },
]
export const paymentHistory = billingInvoices.map(invoice => ({ id: `PAY-${invoice.id}`, invoiceId: invoice.id, date: invoice.date, amount: invoice.amount, status: invoice.status === 'PAID' ? 'SUCCEEDED' : 'FAILED', method: 'Demo card •••• 4242' }))
export const loyaltyTiers = ['Bronze', 'Silver', 'Gold']
export const loyaltyCustomers = [
  { id: 'customer-1', name: 'Minh Anh', email: 'minhanh@example.com', tier: 'Gold', points: 1250, acceptsVouchers: true },
  { id: 'customer-2', name: 'Quang Nguyen', email: 'quang@example.com', tier: 'Gold', points: 1080, acceptsVouchers: true },
  { id: 'customer-3', name: 'Thanh Ha', email: 'thanhha@example.com', tier: 'Silver', points: 720, acceptsVouchers: true },
  { id: 'customer-4', name: 'Bao Tran', email: 'bao@example.com', tier: 'Silver', points: 610, acceptsVouchers: false },
  { id: 'customer-5', name: 'Linh Pham', email: 'linh@example.com', tier: 'Bronze', points: 280, acceptsVouchers: true },
  { id: 'customer-6', name: 'Mai Nguyen', email: 'mai@example.com', tier: 'Bronze', points: 120, acceptsVouchers: false },
]
export const sampleShops = [
  { id: 'shopee-main', platform: 'shopee', name: 'Everyday Studio Official', status: 'Connected' },
  { id: 'tiktok-main', platform: 'tiktok', name: 'Everyday Studio', status: 'Needs attention' },
]
export const sampleShopAlerts = [{ id: 'shop-001', kind: 'shop', tenantId: 'demo-tenant', title: 'TikTok Shop authorization expired', platform: 'tiktok', shopName: 'Everyday Studio', status: 'OPEN', code: 'TOKEN_EXPIRED', severity: 'CRITICAL', lastSeen: '2026-10-23T03:45:00Z', description: 'The sample authorization expired. Sync is paused until authorization is renewed.', history: [{ at: '2026-10-23T02:15:00Z', action: 'Alert opened', note: 'Demo authorization expired.' }] }]
export const demandHistory = [
  { sku: 'TOTE-NAT-01', name: 'Everyday tote · Natural', available: 3, dailyUnits: [2, 3, 2, 4, 3, 2, 5] },
  { sku: 'MUG-SND-02', name: 'Ceramic mug · Sand', available: 5, dailyUnits: [1, 2, 1, 3, 2, 1, 2] },
  { sku: 'CSH-OLV-01', name: 'Linen cushion cover · Olive', available: 0, dailyUnits: [0, 1, 1, 0, 2, 1, 1] },
]
export const sampleCosts = [
  { id: 'cost-seed-1', date: '2026-10-20', category: 'Cost of goods', amount: 16000000, description: 'Illustrative product costs for the sample reporting period' },
  { id: 'cost-seed-2', date: '2026-10-21', category: 'Marketplace fees', amount: 2900000, description: 'Illustrative marketplace fees' },
  { id: 'cost-seed-3', date: '2026-10-22', category: 'Advertising', amount: 1500000, description: 'Illustrative advertising costs' },
]
export const costCategories = ['Cost of goods', 'Marketplace fees', 'Advertising', 'Shipping', 'Rent', 'Payroll', 'Other']
