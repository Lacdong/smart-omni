// Illustrative marketing fixtures. They are not API responses or live marketplace data.
export const landingPreviewFixture = {
  products: [
    { name: 'Wireless Mouse', variant: 'Black', sku: 'WM-BLK', type: 'mouse', channels: ['shopee', 'tiktok'], mapping: 'Mapped' },
    { name: 'Studio Headphones', variant: 'Sand', sku: 'SH-SND', type: 'headphones', channels: ['shopee', 'tiktok'], mapping: 'Mapped' },
    { name: 'Mechanical Keyboard', variant: 'Cloud', sku: 'MK-CLD', type: 'keyboard', channels: ['shopee'], mapping: 'Review required' },
    { name: 'Everyday Tote', variant: 'Olive', sku: 'ET-OLV', type: 'tote', channels: ['tiktok'], mapping: 'Mapped' },
  ],
  orders: [
    { id: 'SP-1042', name: 'Wireless Mouse', channel: 'shopee', status: 'To ship', type: 'mouse' },
    { id: 'TK-1041', name: 'Studio Headphones', channel: 'tiktok', status: 'Shipped', type: 'headphones' },
    { id: 'SP-1040', name: 'Mechanical Keyboard', channel: 'shopee', status: 'Completed', type: 'keyboard' },
    { id: 'TK-1039', name: 'Everyday Tote', channel: 'tiktok', status: 'To ship', type: 'tote' },
  ],
  inventory: [
    { name: 'Wireless Mouse', sku: 'WM-BLK', type: 'mouse', quantity: 48, sync: 'Synced' },
    { name: 'Studio Headphones', sku: 'SH-SND', type: 'headphones', quantity: 32, sync: 'Synced' },
    { name: 'Mechanical Keyboard', sku: 'MK-CLD', type: 'keyboard', quantity: 16, sync: 'Pending' },
    { name: 'Everyday Tote', sku: 'ET-OLV', type: 'tote', quantity: 24, sync: 'Synced' },
  ],
}
