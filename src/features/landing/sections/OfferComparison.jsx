import { Mouse } from 'lucide-react'
import { SectionHeading } from '../components/SectionHeading'
import styles from './OfferComparison.module.css'

export function OfferComparison() {
  return <section className={styles.section} aria-labelledby="offer-title">
    <div className={styles.inner}>
      <div className={styles.copy}><SectionHeading id="offer-title" align="left" eyebrow="STOREFRONT OFFER COMPARISON" title="Help customers choose where to buy." description="Give shoppers a clear comparison of available marketplace offers for the same SKU. They choose the marketplace that fits them." /><p className={styles.note}>Same SKU · Current price · Availability · Marketplace choice</p></div>
      <div className={styles.preview} aria-label="Sample offer comparison for Wireless Mouse Black, SKU WM-BLK">
        <span className={styles.previewLabel}>ILLUSTRATIVE STOREFRONT PREVIEW</span>
        <div className={styles.product}><span className={styles.productImage}><Mouse size={46} strokeWidth={1.2} aria-hidden="true" /></span><span><strong>Wireless Mouse</strong><small>Black · SKU WM-BLK</small></span></div>
        <div className={styles.offers}>
          <div className={styles.offer}><span className={styles.shopee}>S</span><div><strong>Shopee</strong><small>Available</small></div><div className={styles.price}><strong>₫490,000</strong></div></div>
          <div className={styles.offer}><span className={styles.tiktok}>♪</span><div><strong>TikTok Shop</strong><small>Available</small></div><div className={styles.price}><strong>₫450,000</strong><span className={styles.lowest}>Lowest price</span></div></div>
        </div>
        <p className={styles.disclaimer}>Customers select an offer, then continue on the marketplace.</p>
      </div>
    </div>
  </section>
}
