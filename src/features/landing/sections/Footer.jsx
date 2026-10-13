import { Link } from 'react-router-dom'
import { Brand } from '@/shared/components/Brand'
import { navigation } from '../data/content'
import styles from './Footer.module.css'

export function Footer() {
  return <footer className={styles.footer}><div className={styles.inner}>
    <div className={styles.brand}><Brand /><p>A clearer workspace for merchants selling across Shopee and TikTok Shop.</p></div>
    <nav className={styles.links} aria-label="Footer navigation">{navigation.map(({ label, href }) => <a href={href} key={href}>{label}</a>)}</nav>
    <div className={styles.actions}><Link to="/auth/login">Sign in</Link><Link to="/auth/register">Try Free Trial</Link></div>
  </div><div className={styles.bottom}><span>© {new Date().getFullYear()} SmartOmni</span><span>Built for multi-channel merchants.</span></div></footer>
}
