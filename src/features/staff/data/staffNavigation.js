export const staffScreens = [
  ['products', 'Internal products', ['products:read'], '2.5'], ['imports', 'Marketplace imports', ['products:read'], '2.3, 2.6'],
  ['prices', 'Prices & promotions', ['products:read', 'prices:read'], '2.4, 2.7, 2.10'],
  ['inventory', 'Inventory', ['inventory:read'], '2.8, 2.9, 2.11'], ['mapping', 'SKU & warehouse mapping', ['products:read', 'inventory:read'], '2.12, 2.13, 2.22'],
  ['orders', 'Orders & shipments', ['orders:read'], '2.14–2.19'], ['sync', 'Inventory sync', ['inventory:read'], '2.20, 2.21, 2.23'],
]
export const staffCan = (session, permissions) => permissions.every(permission => session.permissions.includes(permission))
