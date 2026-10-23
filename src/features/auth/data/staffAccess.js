export const staffPermissions = [
  { id: 'orders:read', label: 'View orders' }, { id: 'inventory:read', label: 'View inventory alerts' },
  { id: 'products:read', label: 'View products and import results' }, { id: 'products:edit', label: 'Edit internal product details' },
  { id: 'products:import', label: 'Import marketplace products' }, { id: 'prices:read', label: 'View prices, history and discrepancies' },
  { id: 'inventory:adjust', label: 'Adjust inventory' }, { id: 'inventory:receive', label: 'Record incoming stock' },
  { id: 'mapping:write', label: 'Manage SKU and warehouse mapping' }, { id: 'inventory:sync', label: 'Sync inventory and retry errors' },
  { id: 'shipments:arrange', label: 'Arrange shipments' }, { id: 'labels:print', label: 'Download and print labels' }, { id: 'orders:cancel', label: 'Cancel orders' },
]
export const assignedStaffEmail = 'staff.active@smartomni.demo'
export const assignedStaffMember = {
  id: 'assigned-staff-member', email: assignedStaffEmail, fullName: 'Sam Nguyen', phone: '', jobTitle: 'Store operations', notes: 'Assigned demo staff for the Everyday Studio workspace.',
  tenantId: 'demo-tenant', tenantDomain: 'everyday-studio', permissions: staffPermissions.map(item => item.id), status: 'ACTIVE', invitedAt: '2026-10-22T03:00:00.000Z', acceptedAt: '2026-10-22T03:15:00.000Z', updatedAt: '2026-10-22T03:15:00.000Z',
}
