import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Button } from '@/shared/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogTitle } from '@/shared/ui/dialog'
import styles from '../OwnerWorkspace.module.css'

export function OwnerTabs({ items, selected }) {
  return <nav className={styles.tabs} aria-label="Section pages">{items.map(([id, label]) => <Link key={id} to={`/merchant/${id}`} aria-current={selected === id ? 'page' : undefined}>{label}</Link>)}</nav>
}
export function Feedback({ value }) {
  return value ? <p role={value.error ? 'alert' : 'status'} className={value.error ? styles.error : styles.feedback}>{value.message}</p> : null
}
export function OwnerPanel({ title, children }) { return <section className={styles.panel}><h2>{title}</h2>{children}</section> }
export function SummaryMetrics({ items }) { return <dl className={styles.metrics}>{items.map(([label, value]) => <div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}</dl> }
export function DataTable({ headings, children, label }) { return <div className={styles.tableScroll} tabIndex={0} aria-label={label}><table><thead><tr>{headings.map(heading => <th key={heading} scope="col">{heading}</th>)}</tr></thead><tbody>{children}</tbody></table></div> }
export function ConfirmAction({ title, description, onConfirm, onClose, children, confirmLabel = 'Confirm in demo', danger = false }) {
  const [feedback, setFeedback] = useState(null)
  function confirm() {
    try { onConfirm(); onClose() } catch (error) { setFeedback({ error: true, message: error.message }) }
  }
  return <Dialog open onOpenChange={open => { if (!open) onClose() }}><DialogContent className={styles.dialog}><DialogTitle>{title}</DialogTitle><DialogDescription>{description}</DialogDescription>{children}<Feedback value={feedback} /><div className={styles.actions}><Button variant="secondary" onClick={onClose}>Cancel</Button><Button variant={danger ? 'outline' : 'default'} className={danger ? styles.danger : undefined} onClick={confirm}>{confirmLabel}</Button></div></DialogContent></Dialog>
}
