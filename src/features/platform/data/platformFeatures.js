export const planFeatures = [
  { id: 'inventoryAlerts', label: 'Inventory alerts', description: 'Show low-stock alerts and inventory shortcuts on the merchant dashboard.' },
  { id: 'reportExport', label: 'Report export', description: 'Allow merchants to download dashboard reports as CSV.' },
  { id: 'activityFeed', label: 'Workspace activity', description: 'Show the recent activity feed on the merchant dashboard.' },
]
export const defaultFeatures = {
  Free: { inventoryAlerts: true, reportExport: false, activityFeed: false },
  Pro: { inventoryAlerts: true, reportExport: true, activityFeed: true },
}
