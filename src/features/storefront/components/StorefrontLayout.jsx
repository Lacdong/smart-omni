import { StorefrontHeader } from './StorefrontHeader'
import { Link, Outlet, useParams } from 'react-router-dom'
import { ArrowUpRight } from 'lucide-react'
import { Brand } from '@/shared/components/Brand'
import { Button } from '@/shared/ui/button'
import { categories, demoStore } from '../data/catalog'
import styles from '../Storefront.module.css'

export function StorefrontLayout() {
  const { storeSlug } = useParams()
  const base = `/store/${demoStore.slug}`
  if (storeSlug !== demoStore.slug) return <main id="main-content" className={styles.unavailable} tabIndex={-1}><h1>Store not found.</h1><p>This store is unavailable or its address has changed.</p><Button asChild variant="outline"><Link to="/">Back to SmartOmni</Link></Button></main>
  return <div className={styles.store}>
    <StorefrontHeader base={base} />
    <Outlet context={{ base }} />
    <footer className={styles.footer} id="about-store">
      <div className={styles.footerColumns}>
        <section><h2>SMARTOMNI STOREFRONT</h2><p>{demoStore.description}</p><Link to={base}>Explore the collection <ArrowUpRight size={13} aria-hidden="true" /></Link></section>
        <section><h2>THE COLLECTION</h2>{categories.map(category => <Link to={`${base}?category=${category.id}`} key={category.id}>{category.name}</Link>)}</section>
        <section><h2>HOW TO SHOP</h2><p>Discover your favourites here.<br />Choose a colour or option.<br />Compare offers, then buy on your preferred marketplace.</p></section>
        <section><h2>FIND US ON</h2><span>Shopee</span><span>TikTok Shop</span><p className={styles.sampleNote}>Sample catalog. Prices and availability are illustrative.</p></section>
      </div>
      <div className={styles.footerBottom}><span>Powered by <Brand /></span></div>
    </footer>
  </div>
}
