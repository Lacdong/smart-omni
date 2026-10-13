import { Boxes, LockKeyhole, Package, ShoppingCart } from 'lucide-react'
import { SectionHeading } from '../components/SectionHeading'
import styles from './Features.module.css'

const features = [
  { title: 'Catalog & SKU', copy: 'Keep your products, variants and marketplace listings together.', icon: Package, sample: <><span className={styles.sampleLabel}>PRODUCT / SKU</span><div className={styles.sampleLine}><span className={styles.sampleDot} />Wireless Mouse · WM-BLK <small>Mapped</small></div><div className={styles.sampleLine}><span className={styles.sampleDot} />Studio Headphones · SH-SND <small>Mapped</small></div></> },
  { title: 'Orders', copy: 'Find orders across connected shops in one operational view.', icon: ShoppingCart, sample: <><span className={styles.sampleLabel}>RECENT ORDERS</span><div className={styles.sampleLine}><b>SP-1042</b> Wireless Mouse <small>To ship</small></div><div className={styles.sampleLine}><b>TK-1041</b> Studio Headphones <small>Shipped</small></div></> },
  { title: 'Inventory', copy: 'See product quantities with their marketplace sync status.', icon: Boxes, sample: <><span className={styles.sampleLabel}>STOCK VIEW</span><div className={styles.sampleLine}>Wireless Mouse <span className={styles.bar}><i /></span><small>48 available</small></div><div className={styles.sampleLine}>Studio Headphones <span className={styles.bar}><i /></span><small>32 available</small></div></> },
  { title: 'Staff & Permissions', copy: 'Invite your team into the workspace with assigned access.', icon: LockKeyhole, sample: <><span className={styles.sampleLabel}>TEAM ACCESS</span><div className={styles.sampleLine}><span className={styles.avatar}>O</span> Workspace owner <small>Owner</small></div><div className={styles.sampleLine}><span className={styles.avatar}>S</span> Team member <small>Staff</small></div></> },
]

export function Features() {
  return <section className={styles.section} id="features" aria-labelledby="features-title">
    <div className={styles.inner}>
      <SectionHeading id="features-title" eyebrow="CORE CAPABILITIES" title="The essentials, in one place." description="A focused workspace for the products, people and operations behind your sales channels." />
      <div className={styles.grid}>
        {features.map(({ title, copy, icon: Icon, sample }) => <article className={styles.card} key={title}>
          <div className={styles.cardTop}><span className={styles.icon}><Icon size={21} strokeWidth={1.6} aria-hidden="true" /></span><span className={styles.number}>0{features.findIndex(feature => feature.title === title) + 1}</span></div>
          <h3>{title}</h3><p>{copy}</p>
          <div className={styles.preview} aria-label={`Illustrative ${title} preview`}>{sample}</div>
        </article>)}
      </div>
    </div>
  </section>
}
