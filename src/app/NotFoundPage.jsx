import { Link } from 'react-router-dom'
import { Brand } from '@/shared/components/Brand'
import { Button } from '@/shared/ui/button'
import styles from './NotFoundPage.module.css'

export function NotFoundPage() {
  return <main id="main-content" className={styles.page} tabIndex={-1}>
    <Brand />
    <div className={styles.card}>
      <p className={styles.eyebrow}>404</p>
      <h1>This page is off the map.</h1>
      <p>Let’s get you back to SmartOmni.</p>
      <Button asChild className={styles.back}><Link to="/">Back to SmartOmni</Link></Button>
    </div>
  </main>
}
