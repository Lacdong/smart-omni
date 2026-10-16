import { useRef, useState } from 'react'
import { Link, Outlet, useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { ArrowUpRight, Search, X } from 'lucide-react'
import { Brand } from '@/shared/components/Brand'
import { Button } from '@/shared/ui/button'
import { categories, demoStore } from '../data/catalog'
import styles from '../Storefront.module.css'

export function StorefrontLayout() {
  const { storeSlug } = useParams()
  const [params] = useSearchParams()
  const [searchOpen, setSearchOpen] = useState(false)
  const searchTrigger = useRef(null)
  const navigate = useNavigate()
  const base = `/store/${demoStore.slug}`
  if (storeSlug !== demoStore.slug) return <main id="main-content" className={styles.unavailable} tabIndex={-1}><h1>Store not found.</h1><p>This store is unavailable or its address has changed.</p><Button asChild variant="outline"><Link to="/">Back to SmartOmni</Link></Button></main>
  function search(event) {
    event.preventDefault()
    const value = new FormData(event.currentTarget).get('q').trim()
    navigate(value ? `${base}?q=${encodeURIComponent(value)}` : base)
    setSearchOpen(false)
    searchTrigger.current?.focus()
  }
  return <div className={styles.store}>
    <header className={styles.header}>
      <Link to={base} className={styles.storeBrand} aria-label="SmartOmni Storefront home"><span>SMARTOMNI</span><small>STOREFRONT</small></Link>
      <div className={styles.rightNav}><span>THOUGHTFUL ESSENTIALS</span>
        <Button ref={searchTrigger} variant="ghost" size="icon" className={styles.iconButton} aria-label={searchOpen ? 'Close search' : 'Search this store'} aria-expanded={searchOpen} aria-controls="store-header-search" onClick={() => setSearchOpen(!searchOpen)}>{searchOpen ? <X size={18} /> : <Search size={18} />}</Button>
      </div>
      {searchOpen && <form id="store-header-search" role="search" aria-label="Search this store" onSubmit={search} className={styles.headerSearch} onKeyDown={event => { if (event.key === 'Escape') { setSearchOpen(false); searchTrigger.current?.focus() } }}>
        <Search size={19} aria-hidden="true" />
        <input name="q" type="search" aria-label="Search products" defaultValue={params.get('q') || ''} placeholder="Search the collection…" autoComplete="off" autoFocus />
        <Button type="submit" variant="ghost" size="icon" aria-label="Search"><ArrowUpRight size={20} /></Button>
      </form>}
    </header>
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
