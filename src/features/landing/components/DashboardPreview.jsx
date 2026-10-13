import { Headphones, Keyboard, LayoutDashboard, Mouse, Package, ShoppingBag, Boxes } from 'lucide-react'
import { BrandWordmark } from '@/shared/components/Brand'
import { cn } from '@/shared/lib/utils'
import { landingPreview } from '@/services/adapters/landingPreview'
import styles from './DashboardPreview.module.css'

const icons = { mouse: Mouse, headphones: Headphones, keyboard: Keyboard, tote: ShoppingBag }
const { inventory, orders, products } = landingPreview
const menu = [
  { id: 'products', label: 'Products', icon: Package },
  { id: 'orders', label: 'Orders', icon: LayoutDashboard },
  { id: 'inventory', label: 'Inventory', icon: Boxes },
]

function ProductThumb({ type }) {
  const Icon = icons[type] || Package
  return <span className={cn(styles.thumb, styles[type])}><Icon size={22} strokeWidth={1.45} aria-hidden="true" /></span>
}

function Channel({ channel, short = false }) {
  const isShopee = channel === 'shopee'
  return <span className={cn(styles.channel, isShopee ? styles.shopee : styles.tiktok)}>
    <span className={styles.channelMark} aria-hidden="true">{isShopee ? 'S' : '♪'}</span>
    {!short && <span>{isShopee ? 'Shopee' : 'TikTok Shop'}</span>}
  </span>
}

function ProductRows() {
  return <div className={styles.rows}>
    <div className={styles.columns}><span>PRODUCT / SKU</span><span>CHANNEL LISTINGS</span><span>MAPPING</span></div>
    {products.map(product => <div className={styles.row} key={product.sku}>
      <div className={styles.productCell}><ProductThumb type={product.type} /><div><strong>{product.name}</strong><small>{product.variant} · {product.sku}</small></div></div>
      <div className={styles.channelCell}>{product.channels.map(channel => <Channel key={channel} channel={channel} short />)}</div>
      <span className={cn(styles.status, product.mapping === 'Mapped' ? styles.ready : styles.review)}><i />{product.mapping}</span>
    </div>)}
  </div>
}

function OrderRows() {
  return <div className={styles.rows}>
    <div className={styles.columns}><span>ORDER / PRODUCT</span><span>MARKETPLACE</span><span>STATUS</span></div>
    {orders.map(order => <div className={styles.row} key={order.id}>
      <div className={styles.productCell}><ProductThumb type={order.type} /><div><strong>{order.id}</strong><small>{order.name}</small></div></div>
      <div className={styles.channelCell}><Channel channel={order.channel} /></div>
      <span className={cn(styles.status, order.status === 'Completed' ? styles.ready : styles.neutral)}><i />{order.status}</span>
    </div>)}
  </div>
}

function InventoryRows() {
  return <div className={styles.rows}>
    <div className={styles.columns}><span>PRODUCT / SKU</span><span>AVAILABLE</span><span>SYNC STATUS</span></div>
    {inventory.map(item => <div className={styles.row} key={item.sku}>
      <div className={styles.productCell}><ProductThumb type={item.type} /><div><strong>{item.name}</strong><small>{item.sku}</small></div></div>
      <strong className={styles.quantity}>{item.quantity}</strong>
      <span className={cn(styles.status, item.sync === 'Synced' ? styles.ready : styles.review)}><i />{item.sync}</span>
    </div>)}
  </div>
}

export function DashboardPreview({ mode = 'products', className }) {
  const title = mode === 'products' ? 'Products' : mode === 'orders' ? 'Orders' : 'Inventory'
  return <div className={cn(styles.dashboard, className)} aria-label={`${title} dashboard demo preview`}>
    <div className={styles.sidebar}>
      <div className={styles.sidebarBrand}><BrandWordmark /></div>
      <p className={styles.sidebarLabel}>WORKSPACE</p>
      <div className={styles.sidebarMenu} aria-hidden="true">
        {menu.map(({ id, label, icon: Icon }) => <span key={id} className={cn(styles.sidebarItem, mode === id && styles.sidebarActive)}><Icon size={15} strokeWidth={1.8} />{label}</span>)}
      </div>
      <div className={styles.sidebarBottom}><span className={styles.avatar}>S</span><span>Sample workspace<small>Demo preview</small></span></div>
    </div>
    <div className={styles.main}>
      <div className={styles.toolbar}><span>Sample workspace <span className={styles.crumb}>/ {title}</span></span><span className={styles.demoBadge}>DEMO PREVIEW</span></div>
      <div className={styles.content}>
        <div className={styles.titleRow}><div><h3>{title}</h3><p>{mode === 'products' ? 'A clear view of your catalog and marketplace listings.' : mode === 'orders' ? 'Orders from connected shops, together.' : 'Stock information across your connected shops.'}</p></div><span className={styles.count}>{mode === 'products' ? '4 products' : mode === 'orders' ? '4 orders' : '4 SKUs'}</span></div>
        <div className={styles.table}>{mode === 'products' ? <ProductRows /> : mode === 'orders' ? <OrderRows /> : <InventoryRows />}</div>
        <div className={styles.tableFoot}>Illustrative sample data</div>
      </div>
    </div>
  </div>
}
