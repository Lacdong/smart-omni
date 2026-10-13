import { ArrowUpRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { cn } from '@/shared/lib/utils'
import styles from './TrialButton.module.css'

export function TrialButton({ compact = false, className, onClick }) {
  return <Link to="/auth/register" onClick={onClick} className={cn(styles.button, compact && styles.compact, className)}>
    <span className={styles.inner}>Try Free Trial<ArrowUpRight size={16} aria-hidden="true" /></span>
  </Link>
}

export function AuthActions({ className }) {
  return <div className={cn(styles.actions, className)}>
    <TrialButton />
    <Link className={styles.signIn} to="/auth/login">Sign in<ArrowUpRight size={15} aria-hidden="true" /></Link>
  </div>
}
