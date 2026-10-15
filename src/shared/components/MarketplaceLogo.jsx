import { cn } from '@/shared/lib/utils'
import styles from './MarketplaceLogo.module.css'

const marketplaces = {
  shopee: { name: 'Shopee', src: '/images/logo/logo-shopee.png' },
  tiktok: { name: 'TikTok Shop', src: '/images/logo/tiktok-shop-logo.png' },
}

export function MarketplaceLogo({ marketplace, size = 20, decorative = false, className }) {
  const logo = marketplaces[marketplace]
  if (!logo) return null
  return <span className={cn(styles.logo, className)} style={{ width: size, height: size }} aria-hidden={decorative || undefined}>
    <img src={logo.src} alt={decorative ? '' : logo.name} width={size} height={size} decoding="async" />
  </span>
}
