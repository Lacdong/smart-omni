import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowUpRight, Check, MousePointer2 } from 'lucide-react'
import { BrandWordmark } from '@/shared/components/Brand'
import { MarketplaceLogo } from '@/shared/components/MarketplaceLogo'
import { SectionHeading } from '../components/SectionHeading'
import styles from './OfferComparison.module.css'

const colors = [
  { name: 'Black', swatch: '#343434', sku: 'WM-BLK', filter: 'brightness(.23)' },
  { name: 'Sand', swatch: '#c7b59b', sku: 'WM-SND', filter: 'sepia(.4) saturate(.7) brightness(.91)' },
  { name: 'White', swatch: '#f9f9f7', sku: 'WM-WHT', filter: 'none' },
]

export function OfferComparison() {
  const [selectedColor, setSelectedColor] = useState(colors[0])
  return <section className={styles.section} aria-labelledby="offer-title">
    <div className={styles.inner}>
      <div className={styles.copy}>
        <SectionHeading id="offer-title" align="left" eyebrow="STOREFRONT OFFER COMPARISON" title="Help customers choose where to buy." description="Give shoppers a clear comparison of available marketplace offers for the same SKU. They choose the marketplace that fits them." />
        <p className={styles.note}>Same SKU · Current price · Availability · Marketplace choice</p>
        <Link to="/store/everyday-studio" className={styles.storeLink}>Explore the demo store <ArrowUpRight size={16} aria-hidden="true" /></Link>
      </div>
      <div className={styles.preview} aria-label={`Sample offer comparison for Wireless Mouse ${selectedColor.name}, SKU ${selectedColor.sku}`}>
        <div className={styles.previewHeader}><BrandWordmark /><span>THE EVERYDAY EDIT</span><MousePointer2 size={14} aria-hidden="true" /></div>
        <div className={styles.productStage}>
          <div className={styles.productInfo}>
            <p className={styles.eyebrow}>WORKSPACE ESSENTIALS</p>
            <h3>Wireless<br />Mouse</h3>
            <p className={styles.productDescription}>One product.<br />Your choice of marketplace.</p>
            <small>SKU {selectedColor.sku}</small>
          </div>
          <img className={styles.productImage} src="/images/storefront/wireless-mouse.png" alt={`${selectedColor.name} wireless mouse`} style={{ filter: selectedColor.filter }} />
          <div className={styles.options}>
            <fieldset className={styles.colors}>
              <legend>Colour: <strong>{selectedColor.name}</strong></legend>
              <div className={styles.swatches}>
                {colors.map(color => <label className={styles.swatch} key={color.name} style={{ '--swatch-color': color.swatch }}>
                  <input type="radio" name="mouse-colour" value={color.name} checked={selectedColor.name === color.name} onChange={() => setSelectedColor(color)} aria-label={color.name} />
                  <span aria-hidden="true" />
                </label>)}
              </div>
            </fieldset>
            <div className={styles.details}><span>Wireless connection</span><span>Everyday comfort</span><span><Check size={11} aria-hidden="true" /> Available on 2 channels</span></div>
          </div>
        </div>
        <div className={styles.offers}>
          <a className={styles.offer} href="https://shopee.vn/" target="_blank" rel="noreferrer" aria-label="Visit Shopee marketplace">
            <span className={styles.marketplace}><MarketplaceLogo marketplace="shopee" decorative />Shopee<ArrowUpRight size={13} aria-hidden="true" /></span>
            <strong>₫490,000</strong><small>Available</small>
          </a>
          <a className={styles.offer} href="https://www.tiktok.com/shop" target="_blank" rel="noreferrer" aria-label="Visit TikTok Shop marketplace">
            <span className={styles.marketplace}><MarketplaceLogo marketplace="tiktok" decorative />TikTok Shop<ArrowUpRight size={13} aria-hidden="true" /></span>
            <strong>₫450,000</strong><small>Available <span className={styles.lowest}>Lowest price</span></small>
          </a>
        </div>
        <p className={styles.disclaimer}>Illustrative offers · Links open the marketplace, not a live product listing.</p>
      </div>
    </div>
  </section>
}
