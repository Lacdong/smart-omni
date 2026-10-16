import { useCallback, useEffect, useMemo, useState, useSyncExternalStore } from 'react'
import { Link } from 'react-router-dom'
import { Clock3, MessageSquare, Star } from 'lucide-react'
import { Button } from '@/shared/ui/button'
import { demoStore, formatPrice, lowestPrice, products } from '../data/catalog'
import detail from '../pages/ProductDetail.module.css'

const storageEvent = 'smartomni-store-storage'
function subscribe(listener) {
  window.addEventListener('storage', listener)
  window.addEventListener(storageEvent, listener)
  return () => { window.removeEventListener('storage', listener); window.removeEventListener(storageEvent, listener) }
}
function useStoredList(key) {
  const getSnapshot = useCallback(() => { try { return localStorage.getItem(key) || '[]' } catch { return '[]' } }, [key])
  const snapshot = useSyncExternalStore(subscribe, getSnapshot, () => '[]')
  const entries = useMemo(() => { try { const value = JSON.parse(snapshot); return Array.isArray(value) ? value : [] } catch { return [] } }, [snapshot])
  const save = useCallback(value => {
    try { localStorage.setItem(key, JSON.stringify(value)); window.dispatchEvent(new Event(storageEvent)); return true } catch { return false }
  }, [key])
  return [entries, save]
}

export function ProductReviews({ productId }) {
  const [stored, save] = useStoredList(`smartomni:${demoStore.slug}:reviews:${productId}`)
  const [status, setStatus] = useState('')
  const [formOpen, setFormOpen] = useState(false)
  const reviews = stored.filter(entry => entry && typeof entry.name === 'string' && typeof entry.text === 'string' && Number.isInteger(entry.rating) && entry.rating >= 1 && entry.rating <= 5).slice(0, 50)
  const average = reviews.length ? reviews.reduce((sum, entry) => sum + entry.rating, 0) / reviews.length : 0
  function submit(event) {
    event.preventDefault()
    const form = event.currentTarget
    const values = new FormData(form)
    const name = String(values.get('name') || '').trim()
    const text = String(values.get('review') || '').trim()
    if (name.length < 2 || text.length < 10) { setStatus('Please enter a name and a review of at least 10 characters.'); return }
    if (save([{ name, text, rating: Number(values.get('rating')), createdAt: new Date().toISOString() }, ...reviews].slice(0, 50))) {
      form.reset()
      setStatus('Your review has been saved on this device.')
    } else setStatus('Your browser could not save this review. Please allow browser storage and try again.')
  }
  return <div className={detail.reviews}>
    <div className={detail.reviewSummary}><strong>{reviews.length ? average.toFixed(1) : '—'}<small> / 5</small></strong><div><div className={detail.stars} aria-label={reviews.length ? `${average.toFixed(1)} out of 5 stars` : 'No ratings yet'}>{[1, 2, 3, 4, 5].map(value => <Star key={value} size={16} fill={value <= Math.round(average) ? 'currentColor' : 'none'} aria-hidden="true" />)}</div><p>{reviews.length} {reviews.length === 1 ? 'review' : 'reviews'} on this device</p></div></div>
    <p className={detail.note}>Demo reviews are saved only in this browser and are not published to the store or marketplaces.</p>
    {reviews.length ? <div className={detail.reviewList}>{reviews.map((review, index) => <article key={`${review.createdAt}-${index}`}><header><strong>{review.name}</strong><span aria-label={`${review.rating} out of 5 stars`}>{review.rating} <Star size={12} fill="currentColor" aria-hidden="true" /></span></header><p>{review.text}</p></article>)}</div> : <div className={detail.reviewEmpty}><MessageSquare size={22} aria-hidden="true" /><div><h2>No reviews yet</h2><p>Share your thoughts about this product.</p></div></div>}
    <Button type="button" variant="outline" className={detail.reviewToggle} aria-expanded={formOpen} aria-controls="product-review-form" onClick={() => setFormOpen(!formOpen)}>{formOpen ? 'Collapse review form' : 'Write a review'}</Button>
    {formOpen && <form id="product-review-form" className={detail.reviewForm} onSubmit={submit}>
      <h2>Write a review</h2>
      <fieldset><legend>Your rating</legend><div className={detail.ratingChoices}>{[1, 2, 3, 4, 5].map(value => <label key={value}><input type="radio" name="rating" value={value} required aria-label={`${value} ${value === 1 ? 'star' : 'stars'}`} /><span>{value} <Star size={13} aria-hidden="true" /></span></label>)}</div></fieldset>
      <label htmlFor="review-name">Your name</label><input id="review-name" name="name" required minLength={2} maxLength={60} autoComplete="name" placeholder="Name" />
      <label htmlFor="review-text">Your review</label><textarea id="review-text" name="review" required minLength={10} maxLength={2000} rows={4} placeholder="What did you think of this product?" />
      <Button type="submit">Post</Button><p role="status">{status}</p>
    </form>}
  </div>
}

export function RecentlyViewed({ productId, base, contained = false }) {
  const [stored, save] = useStoredList(`smartomni:${demoStore.slug}:recently-viewed`)
  const ids = useMemo(() => [...new Set(stored.filter(id => products.some(product => product.id === id)))].slice(0, 12), [stored])
  useEffect(() => {
    if (productId && ids[0] !== productId) save([productId, ...ids.filter(id => id !== productId)].slice(0, 12))
  }, [productId, ids, save])
  const recent = ids.filter(id => id !== productId).slice(0, 4).map(id => products.find(product => product.id === id))
  return <section className={`${detail.recentlyViewed} ${contained ? detail.recentContained : ''}`} aria-labelledby="recently-viewed"><div className={detail.relatedInner}>
    <div className={detail.relatedHeading}><h2 id="recently-viewed">Recently viewed</h2><span>On this device</span></div>
    {recent.length ? <div className={detail.relatedGrid}>{recent.map(product => <article key={product.id}><Link to={`${base}/products/${product.id}`} className={detail.relatedImage}><img src={product.image} alt={product.name} loading="lazy" /></Link><h3><Link to={`${base}/products/${product.id}`}>{product.name}</Link></h3><strong>{lowestPrice(product) !== null ? formatPrice(lowestPrice(product)) : 'Unavailable'}</strong></article>)}</div> : <div className={detail.recentEmpty}><Clock3 size={20} aria-hidden="true" /><p>The products you explore will appear here.</p><Link to={base}>Explore the collection</Link></div>}
  </div></section>
}
