export const orders = [
  { id: 'SO-1048', customer: 'Minh Anh', channel: 'Shopee', product: 'Everyday tote · Natural', total: 349000, status: 'To pack', time: '10:42' },
  { id: 'SO-1047', customer: 'Quang Nguyen', channel: 'TikTok Shop', product: 'Ceramic mug · Sand × 2', total: 458000, status: 'To pack', time: '10:36' },
  { id: 'SO-1046', customer: 'Thanh Ha', channel: 'Shopee', product: 'Linen cushion cover · Olive', total: 289000, status: 'Shipping', time: '10:24' },
  { id: 'SO-1045', customer: 'Bao Tran', channel: 'TikTok Shop', product: 'Everyday tote · Charcoal', total: 349000, status: 'Delivered', time: '10:18' },
  { id: 'SO-1044', customer: 'Linh Pham', channel: 'Shopee', product: 'Desk organizer · Walnut', total: 595000, status: 'Cancelled', time: '09:57' },
]
export const stockAlerts = [
  { name: 'Everyday tote · Natural', sku: 'TOTE-NAT-01', available: 3, threshold: 10 },
  { name: 'Ceramic mug · Sand', sku: 'MUG-SND-02', available: 5, threshold: 10 },
  { name: 'Linen cushion cover · Olive', sku: 'CSH-OLV-01', available: 0, threshold: 5 },
  { name: 'Everyday tote · Charcoal', sku: 'TOTE-CHR-02', available: 2, threshold: 10 },
  { name: 'Desk organizer · Walnut', sku: 'ORG-WAL-01', available: 4, threshold: 8 },
  { name: 'Ceramic mug · Cloud', sku: 'MUG-CLD-03', available: 0, threshold: 10 },
]
export const channels = [
  { name: 'Shopee', shop: 'Everyday Studio Official', orders: 96, state: 'Connected', synced: '10:40' },
  { name: 'TikTok Shop', shop: 'Everyday Studio', orders: 68, state: 'Needs attention', synced: '09:15' },
]
export const weeklyOrders = [18, 24, 15, 28, 32, 21, 26]
export const weeklySales = [5800000, 7200000, 4500000, 8400000, 9600000, 6300000, 7800000]
export const activity = [
  { initials: 'AM', person: 'Alex Morgan', action: 'updated stock for', target: 'Everyday tote · Natural', section: 'inventory', time: '10:40' },
  { initials: 'SY', person: 'Channel sync', action: 'imported order', target: 'SO-1048 from Shopee', section: 'orders', time: '10:42' },
  { initials: 'SY', person: 'Channel sync', action: 'reported a connection issue with', target: 'TikTok Shop', section: 'channels', time: '09:15' },
]
export const money = value => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND', maximumFractionDigits: 0 }).format(value)
