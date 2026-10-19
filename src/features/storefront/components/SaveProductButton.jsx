import { Heart } from 'lucide-react'
import { useSavedProducts } from './useSavedProducts'
import styles from './SaveProductButton.module.css'

export function SaveProductButton({ product, compact = false }) {
  const { savedIds, toggle } = useSavedProducts()
  const saved = savedIds.includes(product.id)
  return <button type="button" className={`${styles.button} ${compact ? styles.compact : ''}`} aria-pressed={saved} aria-label={`${saved ? 'Unsave' : 'Save'} ${product.name}`} title={saved ? 'Remove from saved products' : 'Save product'} onClick={() => toggle(product.id)}><Heart size={compact ? 17 : 18} fill={saved ? 'currentColor' : 'none'} aria-hidden="true" />{!compact && <span>{saved ? 'Saved' : 'Save product'}</span>}</button>
}
