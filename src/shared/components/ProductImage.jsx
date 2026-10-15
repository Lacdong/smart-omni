import { cn } from '@/shared/lib/utils'
import styles from './ProductImage.module.css'

const images = {
  mouse: '/images/product/mouse.png',
  headphones: '/images/product/headphone.png',
  keyboard: '/images/product/keyboard.png',
  tote: '/images/product/tote.png',
}

export function ProductImage({ type, className, alt = '' }) {
  return <img src={images[type]} alt={alt} className={cn(styles.image, styles[type], className)} loading="lazy" decoding="async" />
}
