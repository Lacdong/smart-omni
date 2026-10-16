import { useEffect, useRef, useState } from 'react'
import { Link, useOutletContext, useSearchParams } from 'react-router-dom'
import { ArrowUpRight, ChevronDown, Grid2X2, List, SlidersHorizontal, X } from 'lucide-react'
import { DropdownMenu } from 'radix-ui'
import { Button } from '@/shared/ui/button'
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from '@/shared/ui/dialog'
import { CatalogFilters } from '../components/CatalogFilters'
import { CatalogBanner } from '../components/CatalogBanner'
import { RecentlyViewed } from '../components/ProductExtras'
import { categories, formatPrice, lowestPrice, products } from '../data/catalog'
import styles from '../Storefront.module.css'

const sortOptions = [['featured', 'Default sorting'], ['price-asc', 'Price: low to high'], ['price-desc', 'Price: high to low'], ['name', 'Name: A–Z']]
export function CatalogPage() {
  const [params, setParams] = useSearchParams()
  const { base } = useOutletContext()
  const [filterOpen, setFilterOpen] = useState(false)
  const resultsHeading = useRef(null)
  useEffect(() => {
    const desktop = window.matchMedia('(min-width: 801px)')
    const close = event => { if (event.matches) setFilterOpen(false) }
    desktop.addEventListener('change', close)
    return () => desktop.removeEventListener('change', close)
  }, [])
  function update(changes) {
    const next = new URLSearchParams(params)
    for (const [key, value] of Object.entries(changes)) {
      next.delete(key)
      if (Array.isArray(value)) value.forEach(item => next.append(key, item))
      else if (value !== '' && value != null) next.set(key, value)
    }
    setParams(next, { preventScrollReset: true })
  }
  const clear = () => setParams({}, { preventScrollReset: true })
  const category = params.get('category') || 'all'
  const colours = params.getAll('colour')
  const channel = params.get('channel')
  const query = (params.get('q') || '').trim().toLowerCase()
  const min = Math.max(0, Number(params.get('min')) || 0)
  const max = params.has('max') && params.get('max') !== '' ? Number(params.get('max')) : Infinity
  const sort = sortOptions.some(([value]) => value === params.get('sort')) ? params.get('sort') : 'featured'
  const isList = params.get('view') === 'list'
  // Evaluate price, colour and marketplace together on the same available variant/offer.
  const matchingVariants = product => product.variants.filter(item => (!colours.length || colours.includes(item.colour)) && item.offers.some(offer => offer.available && (!channel || offer.channel === channel) && offer.price >= min && offer.price <= max))
  const filtered = products.filter(product => (category === 'all' || product.category === category || product.subcategory === category) && (!query || product.name.toLowerCase().includes(query)) && matchingVariants(product).length)
  const displayedPrice = product => Math.min(...matchingVariants(product).flatMap(item => item.offers.filter(offer => offer.available && (!channel || offer.channel === channel) && offer.price >= min && offer.price <= max).map(offer => offer.price)))
  if (sort === 'price-asc') filtered.sort((a, b) => displayedPrice(a) - displayedPrice(b))
  if (sort === 'price-desc') filtered.sort((a, b) => displayedPrice(b) - displayedPrice(a))
  if (sort === 'name') filtered.sort((a, b) => a.name.localeCompare(b.name))
  const selectedCategory = categories.flatMap(item => [item, ...item.children]).find(item => item.id === category)
  const hasFilters = category !== 'all' || colours.length > 0 || channel || params.has('min') || params.has('max') || query
  const resultSummary = filtered.length ? `Showing 1–${filtered.length} of ${filtered.length} results` : '0 results'
  return <main id="main-content" className={styles.main} tabIndex={-1}>
    <nav className={styles.breadcrumb} aria-label="Breadcrumb"><Link to="/">Home</Link><span>/</span><span>{selectedCategory?.name || 'All products'}</span></nav>
    <div className={styles.catalogLayout}>
      <aside className={styles.sidebar} aria-label="Catalog filters"><CatalogFilters params={params} update={update} clear={clear} idPrefix="desktop" /></aside>
      <div className={styles.catalogContent}>
        <CatalogBanner />
        <div className={styles.catalogToolbar}>
          <div className={styles.toolbarControls}>
            <Dialog open={filterOpen} onOpenChange={setFilterOpen}><DialogTrigger asChild><Button variant="outline" className={`${styles.toolbarButton} ${styles.mobileFilters}`}><SlidersHorizontal size={15} aria-hidden="true" />Filters</Button></DialogTrigger>
              <DialogContent className={styles.filterDialog} showCloseButton={false}>
                <div className={styles.dialogHead}><DialogTitle>Filter products</DialogTitle><DialogClose asChild><Button variant="ghost" size="icon" aria-label="Close filters"><X size={18} /></Button></DialogClose></div>
                <DialogDescription className="sr-only">Choose categories, price, marketplace and colours.</DialogDescription>
                <div className={styles.filterScroll}><CatalogFilters params={params} update={update} clear={clear} idPrefix="mobile" /></div>
                <DialogClose asChild><Button className={styles.showResults}>Show {filtered.length} results</Button></DialogClose>
              </DialogContent>
            </Dialog>
            <div className={styles.viewModes} aria-label="Product view"><Button variant="ghost" size="icon" aria-label="List view" aria-pressed={isList} onClick={() => update({ view: 'list' })}><List size={17} /></Button><Button variant="ghost" size="icon" aria-label="Grid view" aria-pressed={!isList} onClick={() => update({ view: '' })}><Grid2X2 size={16} /></Button></div>
            <DropdownMenu.Root><DropdownMenu.Trigger asChild><Button variant="outline" className={styles.toolbarButton} aria-label="Sort products">{sortOptions.find(([value]) => value === sort)[1]}<ChevronDown size={13} aria-hidden="true" /></Button></DropdownMenu.Trigger>
              <DropdownMenu.Portal><DropdownMenu.Content className={styles.sortMenu} align="start" sideOffset={8}>{sortOptions.map(([value, label]) => <DropdownMenu.Item className={styles.sortOption} key={value} onSelect={() => update({ sort: value === 'featured' ? '' : value })} aria-current={sort === value ? 'true' : undefined}>{label}</DropdownMenu.Item>)}</DropdownMenu.Content></DropdownMenu.Portal>
            </DropdownMenu.Root>
          </div>
          <p className={styles.resultCount} role="status" ref={resultsHeading}>{resultSummary}</p>
        </div>
        {hasFilters && <div className={styles.activeFilters}><span>{query ? `Search: “${params.get('q')}”` : selectedCategory?.name || 'Filtered collection'}{colours.length ? ` · ${colours.join(', ')}` : ''}{channel ? ` · ${channel === 'shopee' ? 'Shopee' : 'TikTok Shop'}` : ''}{params.has('min') || params.has('max') ? ` · ${formatPrice(min)} – ${Number.isFinite(max) ? formatPrice(max) : 'No limit'}` : ''}</span><button onClick={clear}>Clear filters <X size={13} aria-hidden="true" /></button></div>}
        <section className={`${styles.productGrid} ${isList ? styles.listView : ''}`} aria-label="Products">
          {filtered.map(product => {
            const item = matchingVariants(product)[0]
            const productUrl = `${base}/products/${product.id}?sku=${item.sku}`
            const channels = [...new Set(item.offers.filter(offer => offer.available && (!channel || offer.channel === channel)).map(offer => offer.channel))]
            return <article className={styles.productCard} key={product.id}>
              <Link className={styles.productImageLink} to={productUrl} aria-label={`View ${product.name}`}><img src={product.image} alt={product.name} loading="lazy" decoding="async" className={product.imageMode === 'contain' ? styles.contain : ''} />{product.badge && <span className={styles.productBadge}>{product.badge}</span>}<span className={styles.viewProduct}>View product <ArrowUpRight size={16} aria-hidden="true" /></span></Link>
              <div className={styles.productCopy}><h2><Link to={productUrl}>{product.name}</Link></h2><p className={styles.cardPrice}><span>From </span>{formatPrice(displayedPrice(product) ?? lowestPrice(product))}</p><p className={styles.cardChannels}>{channels.map(value => value === 'shopee' ? 'Shopee' : 'TikTok Shop').join(' / ')}</p>{isList && <p className={styles.listDescription}>{product.description}</p>}</div>
            </article>
          })}
          {!filtered.length && <div className={styles.empty}><p>No products match your selection.</p><span>Try a different category or a wider price range.</span><Button variant="outline" onClick={clear}>Clear filters</Button></div>}
        </section>
        <div className={styles.catalogBottom}><span>{hasFilters ? 'Your selected collection' : 'The complete collection'}</span><span>{resultSummary}</span></div>
      </div>
    </div>
    <RecentlyViewed base={base} contained />
  </main>
}
