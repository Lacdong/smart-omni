import { Info } from 'lucide-react'
import styles from './PrototypeNotice.module.css'

export function PrototypeNotice({ children }) {
  return <div className={styles.notice}><Info size={18} aria-hidden="true" />
    <div><strong>UI preview / Demo mode</strong><p>{children}</p></div>
  </div>
}
