import { Link } from 'react-router-dom'
import { cn } from '@/shared/lib/utils'
import styles from './Brand.module.css'

export function BrandWordmark() {
  return <span className={styles.wordmark}>SmartOmni</span>
}

export function Brand({ className, linked = true }) {
  const contents = <BrandWordmark />
  return linked
    ? <Link className={cn(styles.brand, className)} to="/" aria-label="SmartOmni home">{contents}</Link>
    : <span className={cn(styles.brand, className)}>{contents}</span>
}
