import { useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import styles from './RootLayout.module.css'

const titles = {
  '/': 'SmartOmni — One workspace for every sales channel',
  '/auth/login': 'Sign in — SmartOmni',
  '/auth/register': 'Create your account — SmartOmni',
}

export function RootLayout() {
  const { pathname } = useLocation()

  useEffect(() => {
    document.title = titles[pathname] || 'Page not found — SmartOmni'
    window.scrollTo({ top: 0, behavior: 'instant' })
  }, [pathname])

  return <><a className={styles.skipLink} href="#main-content">Skip to content</a><Outlet /></>
}
