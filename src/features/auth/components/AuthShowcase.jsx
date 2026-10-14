import { Boxes, Package, ShoppingBag, Layers3 } from 'lucide-react'
import { BrandWordmark } from '@/shared/components/Brand'
import { showcaseData } from '../data/showcaseData'
import styles from './AuthShowcase.module.css'

export function AuthShowcase() {
  const { products, order, inventory } = showcaseData
  return <aside className={styles.showcase} aria-labelledby="auth-showcase-title">
    <div className={styles.ambient} aria-hidden="true" />
    <div className={styles.topline}><Layers3 size={16} aria-hidden="true" /><span>THE SMARTOMNI EXPERIENCE</span></div>
    <div className={styles.scene}>
      <div className={styles.orbit} aria-hidden="true" />
      <div className={styles.workspace}>
        <div className={styles.toolbar}><BrandWordmark /><span className={styles.sample}>DEMO PREVIEW</span></div>
        <div className={styles.workspaceBody}>
          <p className={styles.workspaceLabel}>Sample workspace</p>
          <div className={styles.workspaceHeading}><h3>Your catalog, together.</h3><Package size={20} aria-hidden="true" /></div>
          <p className={styles.description}>One view. Across your sales channels.</p>
          <div className={styles.channels}><span>Shopee</span><span>TikTok Shop</span></div>
          <div className={styles.products}>
            {products.map(product => <div className={styles.product} key={product.sku}>
              <span className={styles.productIcon}><Package size={19} aria-hidden="true" /></span>
              <div><strong>{product.name}</strong><small>{product.sku} · {product.variant}</small></div>
              <span className={styles.listings}>{product.channels.length} listings</span>
            </div>)}
          </div>
          <p className={styles.sampleFoot}>Illustrative sample data</p>
        </div>
      </div>
      <div className={styles.orderCard}>
        <span className={styles.cardIcon}><ShoppingBag size={18} aria-hidden="true" /></span>
        <div><small>ORDER PREVIEW</small><strong>{order.id}</strong><p>{order.name}</p></div>
        <span className={styles.status}>{order.status}</span>
      </div>
      <div className={styles.inventoryCard}>
        <span className={styles.cardIcon}><Boxes size={18} aria-hidden="true" /></span>
        <div><small>INVENTORY PREVIEW</small><strong>{inventory.quantity} units available</strong><p>{inventory.sku} · Sample stock</p></div>
      </div>
    </div>
    <div className={styles.copy}>
      <p className={styles.eyebrow}>LESS SWITCHING. MORE CLARITY.</p>
      <h2 id="auth-showcase-title">One workspace for<br />every sales channel.</h2>
      <p>Bring your products, orders, and inventory<br className={styles.desktopBreak} /> into a clearer view.</p>
    </div>
    <p className={styles.caption}>A product preview. No live marketplace connections.</p>
  </aside>
}
