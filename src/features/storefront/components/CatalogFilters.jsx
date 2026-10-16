import { useState } from 'react'
import { Check, Minus, Plus } from 'lucide-react'
import { Button } from '@/shared/ui/button'
import { categories, colourOptions, products } from '../data/catalog'
import styles from '../Storefront.module.css'

export function CatalogFilters({ params, update, clear, idPrefix }) {
  const [expanded, setExpanded] = useState(['workspace', 'audio'])
  const chosenCategory = params.get('category') || 'all'
  const selectedColours = params.getAll('colour')
  const selectedChannel = params.get('channel') || ''
  function toggleColour(colour) {
    update({ colour: selectedColours.includes(colour) ? selectedColours.filter(item => item !== colour) : [...selectedColours, colour] })
  }
  return <div className={styles.filters}>
    <section className={styles.filterSection}><h2 className={styles.sectionTitle}>CATEGORIES</h2>
      <button className={`${styles.filterLink} ${chosenCategory === 'all' ? styles.active : ''}`} onClick={() => update({ category: '' })} aria-pressed={chosenCategory === 'all'}>All products<span>{products.length.toString().padStart(2, '0')}</span></button>
      {categories.map(category => <div className={styles.categoryGroup} key={category.id}>
        <button className={styles.categoryHeading} onClick={() => setExpanded(current => current.includes(category.id) ? current.filter(item => item !== category.id) : [...current, category.id])} aria-expanded={expanded.includes(category.id)} aria-controls={`${idPrefix}-${category.id}`}>
          {category.name}{expanded.includes(category.id) ? <Minus size={12} aria-hidden="true" /> : <Plus size={12} aria-hidden="true" />}
        </button>
        <div id={`${idPrefix}-${category.id}`} className={styles.categoryChildren} hidden={!expanded.includes(category.id)}>
          {[{ id: category.id, name: `All ${category.name.toLowerCase()}` }, ...category.children].map(item => <button className={`${styles.filterLink} ${chosenCategory === item.id ? styles.active : ''}`} key={item.id} onClick={() => update({ category: item.id })} aria-pressed={chosenCategory === item.id}>{item.name}</button>)}
        </div>
      </div>)}
    </section>
    <section className={styles.filterSection}><h2 className={styles.sectionTitle}>SHOP BY</h2><h3 className={styles.filterTitle}>MARKETPLACE</h3>
      {[['', 'All marketplaces'], ['shopee', 'Shopee'], ['tiktok', 'TikTok Shop']].map(([value, label]) => <button key={label} onClick={() => update({ channel: value })} aria-pressed={selectedChannel === value} className={`${styles.filterLink} ${selectedChannel === value ? styles.active : ''}`}>{label}<span>{value ? products.filter(product => product.variants.some(item => item.offers.some(offer => offer.channel === value && offer.available))).length.toString().padStart(2, '0') : products.length.toString().padStart(2, '0')}</span></button>)}
    </section>
    <section className={styles.filterSection}><h3 className={styles.filterTitle}>PRICE RANGE</h3>
      <form key={`${params.get('min')}-${params.get('max')}`} className={styles.priceForm} onSubmit={event => { event.preventDefault(); const data = new FormData(event.currentTarget); update({ min: data.get('min'), max: data.get('max') }) }}>
        <label htmlFor={`${idPrefix}-min`}>From (₫)</label><input id={`${idPrefix}-min`} type="number" name="min" min="0" step="1000" placeholder="0" defaultValue={params.get('min') || ''} />
        <label htmlFor={`${idPrefix}-max`}>To (₫)</label><input id={`${idPrefix}-max`} type="number" name="max" min="0" step="1000" placeholder="No limit" defaultValue={params.get('max') || ''} />
        <Button type="submit" variant="outline">Apply price</Button>
      </form>
    </section>
    <section className={styles.filterSection}><h3 className={styles.filterTitle}>COLOUR OPTIONS</h3>
      {colourOptions.map(colour => <label className={styles.choice} key={colour}><span className={styles.check}><input type="checkbox" checked={selectedColours.includes(colour)} onChange={() => toggleColour(colour)} /><Check size={12} aria-hidden="true" /></span>{colour}</label>)}
    </section>
    <button className={styles.clearFilters} onClick={clear}>Clear all filters</button>
  </div>
}
