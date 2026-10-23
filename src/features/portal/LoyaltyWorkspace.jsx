import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Button } from '@/shared/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogTitle } from '@/shared/ui/dialog'
import { loyaltyCustomers, loyaltyTiers } from './data/ownerWorkspace'
import { issueTierVouchers } from './lib/ownerWorkspaceStore'
import { ConfirmAction, DataTable, Feedback, OwnerPanel, SummaryMetrics } from './components/OwnerWorkspaceUI'
import styles from './OwnerWorkspace.module.css'

export default function LoyaltyWorkspace({ screen, state }) {
  const [tier, setTier] = useState('Gold')
  const [query, setQuery] = useState('')
  const [discount, setDiscount] = useState('10')
  const [preview, setPreview] = useState(null)
  const [batch, setBatch] = useState(null)
  const [feedback, setFeedback] = useState(null)
  const recipients = loyaltyCustomers.filter(item => item.tier === tier)
  const filtered = recipients.filter(item => `${item.name} ${item.email}`.toLowerCase().includes(query.trim().toLowerCase()))
  const tierField = <label className={styles.field}>Loyalty tier<select value={tier} onChange={event => setTier(event.target.value)}>{loyaltyTiers.map(item => <option key={item}>{item}</option>)}</select></label>
  return <>
    {screen === 'customers' && <><SummaryMetrics items={loyaltyTiers.map(item => [`${item} customers`, loyaltyCustomers.filter(customer => customer.tier === item).length])} /><OwnerPanel title="Customers by loyalty tier"><div className={styles.filters}>{tierField}<label className={styles.field}>Search customers<input type="search" value={query} onChange={event => setQuery(event.target.value)} placeholder="Name or email" /></label></div>{filtered.length ? <DataTable label="Loyalty customers" headings={['Customer', 'Email', 'Tier', 'Points', 'Voucher opt-in']}>{filtered.map(item => <tr key={item.id}><td>{item.name}</td><td>{item.email}</td><td>{item.tier}</td><td>{item.points}</td><td>{item.acceptsVouchers ? 'Yes' : 'No'}</td></tr>)}</DataTable> : <p>No sample customers match your selection.</p>}<p className={styles.note}>Tier assignments and points are illustrative. No live customer service is connected.</p></OwnerPanel></>}
    {screen === 'vouchers' && <OwnerPanel title="Issue vouchers to a loyalty tier"><p>Choose the recipient tier and percentage. Preview eligible and skipped customers before confirming.</p><form className={styles.form} onSubmit={event => { event.preventDefault(); setPreview({ tier, discount: Number(discount), recipients, eligible: recipients.filter(item => item.acceptsVouchers).length, requestId: crypto.randomUUID() }) }}>{tierField}<label className={styles.field}>Discount percentage<input type="number" min="1" max="100" step="1" required value={discount} onChange={event => setDiscount(event.target.value)} /></label><p>{recipients.length} customers in this tier · {recipients.filter(item => item.acceptsVouchers).length} eligible · {recipients.filter(item => !item.acceptsVouchers).length} skipped (not opted in).</p><div className={styles.actions}><Button type="submit">Preview voucher issuance</Button><Button asChild variant="outline"><Link to="/merchant/voucher-results">View issuance results</Link></Button></div></form></OwnerPanel>}
    {screen === 'voucher-results' && <OwnerPanel title="Voucher issuance results">{state.vouchers.length ? <DataTable label="Voucher issuance results" headings={['Date', 'Tier', 'Discount', 'Issued', 'Skipped', 'Action']}>{state.vouchers.map(item => <tr key={item.id}><td>{new Date(item.at).toLocaleString('en-GB')}</td><td>{item.tier}</td><td>{item.discount}%</td><td>{item.recipients.filter(recipient => recipient.status === 'ISSUED_DEMO').length}</td><td>{item.recipients.filter(recipient => recipient.status === 'SKIPPED').length}</td><td><Button variant="outline" onClick={() => setBatch(item)}>View recipients</Button></td></tr>)}</DataTable> : <p>No vouchers issued yet. Choose a tier on Issue vouchers to create a demo batch.</p>}</OwnerPanel>}
    <Feedback value={feedback} />
    {preview && <ConfirmAction title="Confirm voucher issuance" description={`${preview.discount}% discount for ${preview.tier}. ${preview.eligible} eligible recipients; ${preview.recipients.length - preview.eligible} skipped. Codes are local previews; no email or marketplace voucher is created.`} confirmLabel="Issue demo vouchers" onClose={() => setPreview(null)} onConfirm={() => { const id = issueTierVouchers(preview.tier, preview.discount, preview.eligible, preview.requestId); setFeedback({ message: `Demo batch ${id.slice(0, 8)} created. View issuance results for per-customer outcomes.` }) }}><ul className={styles.list}>{preview.recipients.map(item => <li key={item.id}>{item.name} · {item.acceptsVouchers ? 'Eligible' : 'Skipped: not opted in'}</li>)}</ul></ConfirmAction>}
    <Dialog open={Boolean(batch)} onOpenChange={open => { if (!open) setBatch(null) }}><DialogContent className={styles.dialog}><DialogTitle>Voucher recipients</DialogTitle><DialogDescription>{batch?.tier} · {batch?.discount}% · local issuance only.</DialogDescription>{batch && <ul className={styles.list}>{batch.recipients.map(item => <li key={item.customerId}><strong>{item.name}</strong><p>{item.email}</p><p>{item.code || 'No voucher code'} · {item.status}</p><span className={styles.note}>{item.reason}</span></li>)}</ul>}</DialogContent></Dialog>
  </>
}
