import { useState } from 'react'
import { Link, useOutletContext, useParams, useSearchParams } from 'react-router-dom'
import { ArrowUpRight, Check, ChevronLeft, ChevronRight, X } from 'lucide-react'
import { Button } from '@/shared/ui/button'
import { MarketplaceLogo } from '@/shared/components/MarketplaceLogo'
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogTitle } from '@/shared/ui/dialog'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/shared/ui/tabs'
import { categories, discoveryCategories, formatPrice, lowestPrice, products } from '../data/catalog'
import styles from '../Storefront.module.css'
import detail from './ProductDetail.module.css'
import { ProductReviews, RecentlyViewed } from '../components/ProductExtras'
import { SaveProductButton } from '../components/SaveProductButton'

const colourSwatches = { White: '#fafafa', Black: '#353535', Sand: '#c8b79a', Cloud: '#e4e6e7', Natural: '#ddd1b9', Olive: '#72765a' }

export function ProductDetailPage() {
  const { productId } = useParams()
  const { base } = useOutletContext()
  const [params, setParams] = useSearchParams()
  const [missingLink, setMissingLink] = useState(null)
  const product = products.find(item => item.id === productId)
  const item = product?.variants.find(variant => variant.sku === params.get('sku')) || (!params.has('sku') ? product?.variants[0] : null)
  if (!product || !item) return <main id="main-content" className={styles.unavailable} tabIndex={-1}><h1>{product ? 'This option is unavailable.' : 'Product not found.'}</h1><p>Explore the collection to find another product or option.</p><Button asChild variant="outline"><Link to={product ? `${base}/products/${product.id}` : base}>Back to {product ? 'product' : 'collection'}</Link></Button></main>
  const prices = item.offers.filter(offer => offer.available).map(offer => offer.price)
  const lowest = prices.length ? Math.min(...prices) : null
  const category = [...categories, ...discoveryCategories].find(entry => entry.id === product.category)
  const selectedIndex = product.variants.indexOf(item)
  const related = products.filter(entry => entry.id !== product.id).sort((a, b) => Number(b.category === product.category) - Number(a.category === product.category)).slice(0, 4)
  const imageStyle = variant => product.id === 'wireless-mouse' && variant.colour === 'Black' ? { filter: 'brightness(.25)' } : undefined
  function chooseSku(sku) { const next = new URLSearchParams(params); next.set('sku', sku); setParams(next, { preventScrollReset: true }) }
  return <main id="main-content" className={detail.page} tabIndex={-1}>
    <section className={detail.hero} aria-label="Product overview">
    <div className={detail.heroInner}>
      <nav className={`${styles.breadcrumb} ${detail.breadcrumb}`} aria-label="Breadcrumb"><Link to="/">Home</Link><span>/</span><Link to={`${base}?category=${product.category}`}>{category.name}</Link><span>/</span><span>{product.name}</span></nav>
      <div className={detail.gallery}>
        <div className={detail.imageStage}><img src={product.image} alt={`${product.name} — ${item.colour}`} style={imageStyle(item)} />
          {product.variants.length > 1 && <div className={detail.galleryArrows}>
            <Button variant="ghost" size="icon" aria-label="Previous colour" onClick={() => chooseSku(product.variants[(selectedIndex - 1 + product.variants.length) % product.variants.length].sku)}><ChevronLeft size={22} /></Button>
            <Button variant="ghost" size="icon" aria-label="Next colour" onClick={() => chooseSku(product.variants[(selectedIndex + 1) % product.variants.length].sku)}><ChevronRight size={22} /></Button>
          </div>}
        </div>
        <div className={detail.thumbnails} aria-label="Product colour previews">{product.variants.map(variant => <button key={variant.sku} type="button" aria-label={`Preview ${variant.colour}`} aria-pressed={item.sku === variant.sku} onClick={() => chooseSku(variant.sku)}><img src={product.image} style={imageStyle(variant)} alt="" /><span>{variant.colour}</span></button>)}</div>
      </div>
      <div className={`${styles.detailInfo} ${detail.info}`}>
        <h1>{product.name}</h1>
        <SaveProductButton product={product} />
        <p className={`${styles.detailDescription} ${detail.description}`}>{product.description}</p>
        <p className={detail.price}>{lowest !== null ? <><span>From </span>{formatPrice(lowest)}</> : 'Currently unavailable'}</p>
        <h2 className={detail.optionsHeading}>Options</h2>
        <fieldset className={detail.colourPicker}><legend>Colour: <strong>{item.colour}</strong></legend><div>{product.variants.map(variant => <button type="button" key={variant.sku} aria-label={variant.colour} title={variant.colour} aria-pressed={variant.sku === item.sku} onClick={() => chooseSku(variant.sku)}><span style={{ backgroundColor: colourSwatches[variant.colour] || '#ccc' }} aria-hidden="true" /></button>)}</div></fieldset>
        <p className={styles.sku}>SKU {item.sku}</p>
        <section className={styles.buySection} aria-labelledby="where-to-buy"><h2 id="where-to-buy">Choose where to buy</h2><p className={styles.offerIntro}>Compare offers for your selected colour.</p>
          <div className={styles.offers}>{item.offers.map(offer => <div key={offer.channel} className={styles.offer}>
            <div className={styles.offerTop}><span className={styles.offerName}><MarketplaceLogo marketplace={offer.channel} size={24} decorative />{offer.channel === 'shopee' ? 'Shopee' : 'TikTok Shop'}</span><strong>{formatPrice(offer.price)}</strong></div>
            <div className={styles.offerMeta}><span>{offer.available ? <><Check size={12} aria-hidden="true" />In stock</> : 'Out of stock'}</span>{offer.available && offer.price === lowest && prices.length > 1 && <span className={styles.lowest}>Lowest price</span>}</div>
            {offer.available ? <Button asChild={Boolean(offer.listingUrl)} variant="outline" className={styles.offerButton} onClick={offer.listingUrl ? undefined : () => setMissingLink(offer.channel)}>{offer.listingUrl ? <a href={offer.listingUrl} target="_blank" rel="noopener noreferrer">View on {offer.channel === 'shopee' ? 'Shopee' : 'TikTok Shop'}<ArrowUpRight size={15} aria-hidden="true" /></a> : <>View on {offer.channel === 'shopee' ? 'Shopee' : 'TikTok Shop'}<ArrowUpRight size={15} aria-hidden="true" /></>}</Button> : <Button disabled variant="outline" className={styles.offerButton}>Currently unavailable</Button>}
          </div>)}</div>
        </section>
        <div className={detail.purchaseNote}><p>Product prices only. Shipping and eligible vouchers are confirmed on the marketplace.</p><Link to={base}>Back to the collection</Link></div>
      </div>
    </div>
    </section>
    <Tabs key={product.id} defaultValue="description" orientation="vertical" className={detail.details}>
      <TabsList className={detail.tabList} aria-label="Product information"><TabsTrigger value="description">Description</TabsTrigger><TabsTrigger value="details">Additional information</TabsTrigger><TabsTrigger value="reviews">Reviews</TabsTrigger></TabsList>
      <TabsContent value="description" className={detail.tabContent}><h2>Considered for your everyday.</h2><p>{product.description}</p><p>Explore the {category.name.toLowerCase()} collection and select your preferred colour above. Compare the available offers for the same SKU, then continue to your chosen marketplace to complete your purchase.</p><p className={detail.note}>This is a sample catalog. Product specifications and live availability will be provided by the seller.</p></TabsContent>
      <TabsContent value="details" className={`${styles.productDetails} ${detail.tabContent}`}><h2>Product details</h2><dl><div><dt>Collection</dt><dd>{category.name}</dd></div><div><dt>Selected colour</dt><dd>{item.colour}</dd></div><div><dt>Product reference</dt><dd>{item.sku}</dd></div><div><dt>Available on</dt><dd>{item.offers.map(offer => offer.channel === 'shopee' ? 'Shopee' : 'TikTok Shop').join(' / ')}</dd></div></dl></TabsContent>
      <TabsContent value="reviews" className={detail.tabContent}><ProductReviews key={product.id} productId={product.id} /></TabsContent>
    </Tabs>
    <section className={detail.related} aria-labelledby="related-products"><div className={detail.relatedInner}><div className={detail.relatedHeading}><h2 id="related-products">Related products</h2><Link to={base}>View collection <ArrowUpRight size={14} /></Link></div><div className={detail.relatedGrid}>{related.map(entry => <article key={entry.id}><Link to={`${base}/products/${entry.id}`} className={detail.relatedImage}><img src={entry.image} alt={entry.name} loading="lazy" /></Link><h3><Link to={`${base}/products/${entry.id}`}>{entry.name}</Link></h3><p>{categories.find(group => group.id === entry.category).name}</p><strong>{lowestPrice(entry) !== null ? formatPrice(lowestPrice(entry)) : 'Unavailable'}</strong></article>)}</div></div></section>
    <Dialog open={Boolean(missingLink)} onOpenChange={open => { if (!open) setMissingLink(null) }}><DialogContent showCloseButton={false} className={styles.linkDialog}><div className={styles.dialogHead}><DialogTitle>Product link unavailable</DialogTitle><DialogClose asChild><Button variant="ghost" size="icon" aria-label="Close message"><X size={18} /></Button></DialogClose></div><DialogDescription>This sample offer has no live {missingLink === 'shopee' ? 'Shopee' : 'TikTok Shop'} product link yet. No purchase has been made.</DialogDescription><DialogClose asChild><Button variant="outline">Back to product</Button></DialogClose></DialogContent></Dialog>
    <RecentlyViewed productId={product.id} base={base} />
  </main>
}
