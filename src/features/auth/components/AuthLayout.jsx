import { ArrowLeft } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Brand } from '@/shared/components/Brand'
import { AuthShowcase } from './AuthShowcase'
import styles from './AuthLayout.module.css'

export function AuthLayout({ children }) {
  return <main id="main-content" className={styles.layout} tabIndex={-1}>
    <section className={styles.panel} aria-label="Account access">
      <header className={styles.header}><Brand /></header>
      <div className={styles.formArea}>{children}</div>
      <footer className={styles.footer}>
        <Link to="/"><ArrowLeft size={16} aria-hidden="true" />Back to SmartOmni</Link>
        <span>Products. Orders. Inventory.</span>
      </footer>
    </section>
    <AuthShowcase />
  </main>
}
