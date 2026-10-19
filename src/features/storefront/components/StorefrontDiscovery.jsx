import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, ChevronLeft, ChevronRight, Zap, Truck, ShoppingBag, Ticket, TrendingUp, Sparkles, CalendarDays, Grid2X2, Shirt, Smartphone, House, Headphones, Briefcase, Footprints, Watch, Dumbbell, Heart, Blocks, Apple, BookOpen, Cat, Car, Gem, Plane, Gamepad2, Ellipsis, Flower2, ShieldCheck, ArrowUpRight } from 'lucide-react'
import { discoveryCategories, products } from '../data/catalog'
import styles from './StorefrontDiscovery.module.css'
import { FlashDeals } from './FlashDeals'

const categoryIcons = [Shirt, Shirt, Flower2, Smartphone, House, Headphones, Briefcase, Footprints, Watch, Dumbbell, Heart, Blocks, Apple, BookOpen, Cat, Car, Gem, Plane, Gamepad2, Ellipsis]
const shortcuts = [['Flash Deals', Zap, '/flash-sale'], ['Shopee', Truck, '?channel=shopee'], ['Marketplaces', ShoppingBag, '#marketplaces'], ['Compare prices', Ticket, '#just-for-you'], ['Top Searches', TrendingUp, '#top-searches'], ['Workspace', Sparkles, '?category=workspace'], ['Everyday finds', CalendarDays, '?category=everyday'], ['Categories', Grid2X2, '#categories']]
const slides = [
  { eyebrow: 'MAKE ROOM FOR BETTER', title: 'Your space.\nYour style.', description: 'Thoughtful essentials for a home that feels like you.', category: 'lighting', cta: 'Shop home & living', image: products[2].image },
  { eyebrow: 'A BETTER EVERYDAY', title: 'Less noise.\nMore you.', description: 'Find your rhythm with considered audio essentials.', category: 'audio', cta: 'Explore audio', image: products[1].image },
  { eyebrow: 'FIND YOUR FOCUS', title: 'Small details.\nBetter days.', description: 'A fresh perspective for your everyday workspace.', category: 'workspace', cta: 'Explore workspace', image: products[0].image },
]
function SectionHeading({ title, subtitle, to }) {
  return <div className={styles.sectionHeading}><h2>{title}</h2>{to ? <a href={to}>See all <ChevronRight size={14} aria-hidden="true" /></a> : <span>{subtitle}</span>}</div>
}
export function StorefrontDiscovery({ base }) {
  const [active, setActive] = useState(0)
  const slide = slides[active]
  const categoryItems = discoveryCategories
  return <>
    <div className={styles.top}>
      <div className={styles.banners}>
        <section className={styles.hero} aria-label="Featured collections" aria-roledescription="carousel">
          <div className={styles.heroCopy}><span className={styles.eyebrow}>{slide.eyebrow}</span><h1>{slide.title}</h1><p>{slide.description}</p><Link className={styles.cta} to={`${base}?category=${slide.category}`}>{slide.cta}<ArrowRight size={17} aria-hidden="true" /></Link></div>
          <div className={styles.art}><span className={styles.circle} /><img src={slide.image} alt="" /><span className={styles.tag}>FRESH FINDS</span></div>
          <button className={`${styles.arrow} ${styles.previous}`} aria-label="Previous collection" onClick={() => setActive((active + slides.length - 1) % slides.length)}><ChevronLeft size={18} /></button>
          <button className={`${styles.arrow} ${styles.next}`} aria-label="Next collection" onClick={() => setActive((active + 1) % slides.length)}><ChevronRight size={18} /></button>
          <div className={styles.dots}>{slides.map((item, index) => <button key={item.title} aria-label={`Show collection ${index + 1}`} aria-pressed={index === active} onClick={() => setActive(index)}><span /></button>)}</div><span className={styles.slideCount}>0{active + 1} / 03</span>
        </section>
        <div className={styles.sideBanners}><Link to={`${base}?channel=shopee`} className={styles.lightBanner}><span className={styles.eyebrow}>MORE WAYS TO FIND YOURS</span><h2>Great finds.<br />Your marketplace.</h2><span>Explore on Shopee <ArrowRight size={14} aria-hidden="true" /></span></Link><Link to={`${base}?channel=tiktok`} className={styles.darkBanner}><span className={styles.eyebrow}>DISCOVER SOMETHING NEW</span><h2>Everyday favourites.<br />A little more you.</h2><span>Explore on TikTok Shop <ArrowRight size={14} aria-hidden="true" /></span><ShoppingBag className={styles.bagArt} size={65} strokeWidth={1} aria-hidden="true" /></Link></div>
      </div>
      <nav className={styles.quick} aria-label="Shopping shortcuts">{shortcuts.map(([label, Icon, to]) => {
        const content = <><span><Icon size={25} strokeWidth={1.4} aria-hidden="true" /></span>{label}</>
        return to.startsWith('#') ? <a key={label} href={to}>{content}</a> : <Link key={label} to={`${base}${to}`}>{content}</Link>
      })}</nav>
    </div>
    <section id="categories" className={styles.panel} aria-label="Shop by category"><SectionHeading title="SHOP BY CATEGORY" subtitle="Find your kind of everyday" /><div className={styles.categories}>{categoryItems.map((category, index) => {
      const Icon = categoryIcons[index]
      return <Link key={category.id} to={`${base}?category=${category.id}`}><span><Icon size={32} strokeWidth={1.25} aria-hidden="true" /></span>{category.name}</Link>
    })}</div></section>
    <FlashDeals base={base} />
    <section id="top-searches" className={styles.panel} aria-label="Top Searches"><SectionHeading title="TOP SEARCHES" to="#just-for-you" /><div className={styles.picks}>{products.slice(0, 6).map((product, index) => <Link key={product.id} to={`${base}?q=${encodeURIComponent(product.name)}`}><div><img src={product.image} alt="" loading="lazy" className={product.imageMode === 'contain' ? styles.contain : ''} /><span>TOP {index + 1}</span></div><h3>{product.name}</h3></Link>)}</div></section>
    <section id="marketplaces" className={styles.panel} aria-label="Shop by marketplace"><SectionHeading title="SHOP BY MARKETPLACE" to="#just-for-you" /><div className={styles.marketplaces}><div className={styles.marketIntro}><span className={styles.eyebrow}>CONSIDERED. CONNECTED.</span><h2>SmartOmni finds.</h2><p>Your favourites.<br />More ways to shop.</p><a href="#just-for-you">Explore the collection <ArrowRight size={15} aria-hidden="true" /></a></div><Link to={`${base}?channel=shopee`}><strong>SHOPEE</strong><span>Find your everyday essentials.</span><small>Explore the collection <ArrowUpRight size={13} aria-hidden="true" /></small></Link><Link to={`${base}?channel=tiktok`}><strong className={styles.serif}>TikTok Shop</strong><span>A fresh way to discover.</span><small>Find something you love <ArrowUpRight size={13} aria-hidden="true" /></small></Link><Link to={`${base}?category=workspace`}><strong>WORK / SPACE</strong><span>Made for the everyday.</span><small>Make room for better <ArrowUpRight size={13} aria-hidden="true" /></small></Link></div></section>
  </>
}
export function StorefrontBenefits() {
  return <div className={styles.benefits}>{[[Truck, 'Your favourites, connected', 'Find offers on Shopee and TikTok Shop'], [ShieldCheck, 'Choose with confidence', 'Compare available prices by colour'], [ShoppingBag, 'A little more discovery', 'Considered essentials for every day']].map(([Icon, title, detail]) => <div key={title}><Icon size={30} strokeWidth={1.3} aria-hidden="true" /><span><strong>{title}</strong><small>{detail}</small></span></div>)}</div>
}
