import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ChevronRight, Flame, Zap } from 'lucide-react'
import { flashDeals, formatPrice, lowestPrice } from '../data/catalog'
import styles from './FlashDeals.module.css'

const duration = (3 * 3600 + 24 * 60 + 18) * 1000
const timerKey = 'smartomni:everyday-studio:demo-deal-end'
// Illustrative promotion fixtures; marketplace prices are not changed.
const promotionSamples = [
  { discount: 44, sold: 1200, progress: 79 },
  { discount: 50, sold: 856, progress: 62 },
  { discount: 40, sold: 2300, progress: 86 },
  { discount: 40, sold: 647, progress: 45 },
  { discount: 50, sold: 1500, progress: 71 },
  { discount: 50, sold: 980, progress: 56 },
]

export function FlashDeals({ base }) {
  const [end] = useState(() => {
    const fallback = Date.now() + duration
    try {
      const saved = Number(sessionStorage.getItem(timerKey))
      if (Number.isFinite(saved) && saved > 0) return saved
      sessionStorage.setItem(timerKey, String(fallback))
    } catch { /* Keep the preview timer working when storage is unavailable. */ }
    return fallback
  })
  const [remaining, setRemaining] = useState(() => Math.max(0, Math.ceil((end - Date.now()) / 1000)))
  useEffect(() => {
    const tick = () => setRemaining(Math.max(0, Math.ceil((end - Date.now()) / 1000)))
    const timer = window.setInterval(tick, 1000)
    const onVisibility = () => { if (!document.hidden) tick() }
    document.addEventListener('visibilitychange', onVisibility)
    return () => { window.clearInterval(timer); document.removeEventListener('visibilitychange', onVisibility) }
  }, [end])
  const time = [Math.floor(remaining / 3600), Math.floor(remaining / 60) % 60, remaining % 60].map(value => String(value).padStart(2, '0'))
  return <section id="flash-deals" className={styles.section} aria-label="Flash Deals" aria-describedby="flash-demo-description">
    <p id="flash-demo-description" className="sr-only">Illustrative promotion prices, sales counts and countdown for this sample catalog.</p>
    <div className={styles.header}>
      <div className={styles.titleGroup}><h2>FLASH <Zap size={23} fill="currentColor" aria-hidden="true" /> DEALS</h2><div className={styles.countdown}><span className={styles.endsIn}>{remaining ? 'ENDS IN' : 'DEALS ENDED'}</span><div className={styles.clock} role="timer" aria-label="Time remaining for sample deals">{time.map((value, index) => <span key={index}>{value}</span>)}</div></div></div>
      <a className={styles.seeAll} href="#just-for-you">See all deals <ChevronRight size={15} aria-hidden="true" /></a>
    </div>
    {remaining > 0 ? <div className={styles.grid}>{flashDeals.map((product, index) => {
      const promotion = promotionSamples[index]
      const price = lowestPrice(product)
      const original = Math.round(price / (1 - promotion.discount / 100) / 1000) * 1000
      return <Link className={styles.card} key={product.id} to={`${base}/products/${product.id}`} aria-label={`View deal for ${product.name}`}>
        <div className={styles.image}><img src={product.image} alt={product.name} loading="lazy" className={product.imageMode === 'contain' ? styles.contain : ''} /><span className={styles.discount}>−{promotion.discount}%</span></div>
        <div className={styles.price}><strong>{formatPrice(price)}</strong><del>{formatPrice(original)}</del></div>
        <div className={styles.progress} role="progressbar" aria-label={`${product.name} sample deal stock sold`} aria-valuenow={promotion.progress} aria-valuemin={0} aria-valuemax={100}><span className={styles.fill} style={{ width: `${promotion.progress}%` }} /><span className={styles.sold}><Flame size={12} aria-hidden="true" />{promotion.progress > 75 ? 'SELLING FAST' : `${promotion.sold.toLocaleString('en-US')} SOLD`}</span></div>
      </Link>
    })}</div> : <div className={styles.expired}>These sample deals have ended. <a href="#just-for-you">Explore the collection <ChevronRight size={14} aria-hidden="true" /></a></div>}
  </section>
}
