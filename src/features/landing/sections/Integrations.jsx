import { ArrowRight, Store } from 'lucide-react'
import { BrandWordmark } from '@/shared/components/Brand'
import { SectionHeading } from '../components/SectionHeading'
import styles from './Integrations.module.css'

export function Integrations() {
  return <section className={styles.section} id="integrations" aria-labelledby="integrations-title">
    <div className={styles.inner}>
      <SectionHeading id="integrations-title" eyebrow="MARKETPLACE INTEGRATIONS" title="Your shops, connected to one workspace." description="Bring your Shopee and TikTok Shop store information into a clearer operating view." />
      <div className={styles.flow} aria-label="Shopee and TikTok Shop connect to SmartOmni">
        <div className={styles.sources}>
          <div className={styles.shop}><span className={styles.shopee}>S</span><span><strong>Shopee</strong><small>Marketplace shop</small></span></div>
          <div className={styles.shop}><span className={styles.tiktok}>♪</span><span><strong>TikTok Shop</strong><small>Marketplace shop</small></span></div>
        </div>
        <div className={styles.connection}><span /> <ArrowRight size={19} strokeWidth={1.4} aria-hidden="true" /></div>
        <div className={styles.destination}><div><strong><BrandWordmark /></strong><small>Products · Orders · Inventory</small></div></div>
      </div>
      <p className={styles.caption}><Store size={15} aria-hidden="true" /> Preview of supported shop connections. Sample information shown throughout this page.</p>
    </div>
  </section>
}
