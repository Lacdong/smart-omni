import { Layers3 } from 'lucide-react'
import { BrandWordmark } from '@/shared/components/Brand'
import { MarketplaceLogo } from '@/shared/components/MarketplaceLogo'
import { SectionHeading } from '../components/SectionHeading'
import styles from './Integrations.module.css'

export function Integrations() {
  return <section className={styles.section} id="integrations" aria-labelledby="integrations-title">
    <div className={styles.inner}>
      <div className={styles.intro}>
        <SectionHeading id="integrations-title" align="left" eyebrow="MARKETPLACE INTEGRATIONS" title="Your shops, connected to one workspace." description="Bring your Shopee and TikTok Shop store information into a clearer operating view." />
        <p className={styles.note}>Products, orders and inventory.<br />One connected view of your shops.</p>
      </div>
      <div className={styles.diagram} role="img" aria-label="Two marketplaces, Shopee and TikTok Shop, connected to one SmartOmni workspace">
        <svg className={styles.orbits} viewBox="0 0 360 360" fill="none" aria-hidden="true">
          <circle cx="180" cy="180" r="155" stroke="#dedede" strokeWidth=".8" strokeDasharray="370 604" transform="rotate(92 180 180)" />
          <circle cx="180" cy="180" r="128" stroke="#999" strokeWidth=".8" strokeDasharray="575 230" transform="rotate(-88 180 180)" />
          <circle cx="180" cy="180" r="108" stroke="#e1e1e1" strokeWidth="1" />
          <circle cx="180" cy="25" r="2" fill="#999" />
          <circle cx="56" cy="87" r="5" fill="#171717" />
          <circle cx="44" cy="108" r="9" fill="#e2e2e2" />
          <circle cx="335" cy="151" r="4" fill="#171717" />
          <circle cx="79" cy="180" r="4" fill="#c8c8c8" />
          <circle cx="230" cy="298" r="7" fill="#171717" />
          <circle cx="253" cy="286" r="4" fill="#171717" />
          <circle cx="180" cy="335" r="2" fill="#b7b7b7" />
          <path d="M62 282h11v11H62z" fill="#171717" />
        </svg>
        <div className={styles.core}>
          <strong>2</strong>
          <span>marketplaces</span>
          <div className={styles.hubName}><BrandWordmark /></div>
        </div>
      </div>
      <div className={styles.connections}>
        <article className={styles.connection}>
          <MarketplaceLogo marketplace="shopee" size={48} decorative />
          <div><h3>Shopee</h3><p>Keep your shop’s products and orders connected to your workspace.</p></div>
        </article>
        <article className={styles.connection}>
          <MarketplaceLogo marketplace="tiktok" size={48} decorative />
          <div><h3>TikTok Shop</h3><p>Bring your TikTok Shop catalog and sales information into the same view.</p></div>
        </article>
        <article className={styles.connection}>
          <span className={styles.workspaceIcon}><Layers3 size={24} strokeWidth={1.5} aria-hidden="true" /></span>
          <div><h3>One clearer workspace</h3><p>Products, orders and inventory, organized together across your shops.</p></div>
        </article>
      </div>
    </div>
    <p className={styles.caption}>Preview of supported shop connections. Sample information shown throughout this page.</p>
  </section>
}
