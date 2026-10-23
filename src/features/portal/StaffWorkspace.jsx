import { useTenantFeatures } from '@/features/auth/hooks/useTenantFeatures'
import { money, orders, stockAlerts } from './data/ownerDashboard'
import styles from './StoreSettings.module.css'

export default function StaffWorkspace({ session }) {
  const features = useTenantFeatures(session.tenantId)
  const canReadOrders = session.permissions.includes('orders:read')
  const canReadInventory = session.permissions.includes('inventory:read') && features.inventoryAlerts
  return <div className={styles.page}><div className={styles.heading}><div><h1>Your workspace</h1><p>Read-only sample data for the permissions granted by your owner.</p></div></div>
    {canReadOrders && <section className={styles.panel}><h2>Recent orders</h2><ul className={styles.members}>{orders.map(order => <li key={order.id} className={styles.member}><strong>{order.id} · {order.customer}</strong><span>{order.product}</span><span>{order.status} · {money(order.total)}</span></li>)}</ul></section>}
    {canReadInventory && <section className={styles.panel}><h2>Inventory alerts</h2><ul className={styles.members}>{stockAlerts.map(item => <li key={item.sku} className={styles.member}><strong>{item.name}</strong><span>{item.sku} · {item.available} available · threshold {item.threshold}</span></li>)}</ul></section>}
    {!canReadOrders && !canReadInventory && <section className={styles.panel}><h2>No enabled views</h2><p>Your permissions or plan currently do not include these views. Ask your owner to review your access.</p></section>}
  </div>
}
