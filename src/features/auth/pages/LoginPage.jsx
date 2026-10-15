import { ArrowLeft, Boxes, Package, ShoppingBag } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Brand } from '@/shared/components/Brand'
import { AuthForm } from '../components/AuthForm'
import styles from './LoginPage.module.css'

const benefits = [
  { icon: Package, title: 'Your products, together.', copy: 'A clearer home for your catalog and SKUs.' },
  { icon: ShoppingBag, title: 'Every order in view.', copy: 'Keep up with orders across your shops.' },
  { icon: Boxes, title: 'Stock with more clarity.', copy: 'See inventory alongside channel sync status.' },
]

export function LoginPage() {
  return <main id="main-content" className={styles.page} tabIndex={-1}>
    <header className={styles.header}>
      <Brand />
    </header>
    <div className={styles.stack}>
      <aside className={styles.infoCard} aria-labelledby="login-workspace-title">
        <p className={styles.eyebrow}>LESS SWITCHING. MORE CLARITY.</p>
        <h2 id="login-workspace-title">All your shops.<br />One workspace.</h2>
        <p className={styles.description}>Bring your products, orders and inventory into a clearer view.</p>
        <ul className={styles.benefits}>
          {benefits.map(({ icon: Icon, title, copy }) => <li key={title}>
            <Icon size={20} strokeWidth={1.5} aria-hidden="true" />
            <div><strong>{title}</strong><p>{copy}</p></div>
          </li>)}
        </ul>
      </aside>
      <section className={styles.formCard} aria-label="Account access">
        <div className={styles.formBody}><AuthForm secondaryAction={<Link to="/" className={styles.back}><ArrowLeft size={15} aria-hidden="true" />Back to SmartOmni</Link>} /></div>
        <p className={styles.register}>New to SmartOmni? <Link to="/auth/register">Create account</Link></p>
      </section>
    </div>
  </main>
}
