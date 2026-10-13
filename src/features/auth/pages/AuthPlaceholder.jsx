import { ArrowLeft, ArrowUpRight, LockKeyhole, UserRoundPlus } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Brand } from '@/shared/components/Brand'
import { Button } from '@/shared/ui/button'
import styles from './AuthPlaceholder.module.css'

export function AuthPlaceholder({ mode }) {
  const isLogin = mode === 'login'
  const Icon = isLogin ? LockKeyhole : UserRoundPlus
  return <main id="main-content" className={styles.page} tabIndex={-1}>
    <Brand />
    <div className={styles.card}>
      <div className={styles.icon}><Icon size={24} aria-hidden="true" /></div>
      <p className={styles.eyebrow}>COMING NEXT</p>
      <h1>{isLogin ? 'Welcome back.' : 'Your next chapter starts here.'}</h1>
      <p>{isLogin
        ? 'Sign in is not available in this preview yet. Explore SmartOmni while we prepare your workspace.'
        : 'Account registration is not available in this preview yet. Get to know the workspace built for your store.'}</p>
      <Button asChild className={styles.back}><Link to="/"><ArrowLeft aria-hidden="true" />Back to SmartOmni</Link></Button>
      <Link className={styles.other} to={isLogin ? '/auth/register' : '/auth/login'}>
        {isLogin ? 'View registration page' : 'View sign-in page'}<ArrowUpRight size={16} aria-hidden="true" />
      </Link>
    </div>
    <p className={styles.caption}>Products. Orders. Inventory. One workspace.</p>
  </main>
}
