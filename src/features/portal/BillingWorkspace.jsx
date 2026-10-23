import { useState } from 'react'
import { Button } from '@/shared/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogTitle } from '@/shared/ui/dialog'
import { billingInvoices, paymentHistory } from './data/ownerWorkspace'
import { changeOwnerPlan, effectivePlan, ownerConnections, planLimits, requestRefund } from './lib/ownerWorkspaceStore'
import { ConfirmAction, DataTable, Feedback, OwnerPanel, SummaryMetrics } from './components/OwnerWorkspaceUI'
import { money } from './data/ownerDashboard'
import styles from './OwnerWorkspace.module.css'

export default function BillingWorkspace({ screen, state, tenant, platform }) {
  const [plan, setPlan] = useState(null)
  const [invoice, setInvoice] = useState(null)
  const [refundInvoice, setRefundInvoice] = useState(null)
  const [reason, setReason] = useState('')
  const [feedback, setFeedback] = useState(null)
  const [status, setStatus] = useState('ALL')
  const current = effectivePlan(state, tenant)
  const connections = ownerConnections(state, tenant, platform).length
  const invoices = billingInvoices.filter(item => status === 'ALL' || item.status === status)
  return <>
    {screen === 'subscription' && <><SummaryMetrics items={[["Current demo plan", current], ['Connected shops', connections], ['Billing mode', 'Demo only']]} /><OwnerPanel title="Subscription plans"><p>Plan limits are illustrative and follow the saved platform configuration. Pricing and billing rules are not finalized.</p><div className={styles.grid}>{['Free', 'Pro'].map(id => {
      const limits = planLimits(platform, id)
      return <article key={id} className={styles.plan}><h3>{id}{id === current ? ' · Current plan' : ''}</h3><ul><li>{limits.skuLimit} sample SKUs</li><li>{limits.shopLimit} shop connections</li><li>{limits.staffLimit} sample staff limit</li></ul><p className={styles.note}>Staff-limit enforcement is not connected to Team yet.</p><Button variant="outline" disabled={id === current} onClick={() => setPlan(id)}>Switch to {id} in demo</Button></article>
    })}</div></OwnerPanel></>}
    {screen === 'invoices' && <><OwnerPanel title="Subscription invoices"><div className={styles.filters}><label className={styles.field}>Invoice status<select value={status} onChange={event => setStatus(event.target.value)}><option value="ALL">All statuses</option><option value="PAID">Paid</option><option value="FAILED">Failed</option></select></label></div><DataTable label="Subscription invoices" headings={['Invoice', 'Period', 'Amount', 'Status', 'Actions']}>{invoices.map(item => <tr key={item.id}><td>{item.id}</td><td>{item.period}</td><td>{money(item.amount)}</td><td><span className={styles.status}>{item.status}</span></td><td><div className={styles.actions}><Button variant="outline" onClick={() => setInvoice(item)}>View invoice</Button>{item.status === 'PAID' && <Button variant="outline" disabled={state.refunds.some(refund => refund.invoiceId === item.id)} onClick={() => { setRefundInvoice(item); setReason('') }}>{state.refunds.some(refund => refund.invoiceId === item.id) ? 'Refund requested' : 'Request refund'}</Button>}</div></td></tr>)}</DataTable><p className={styles.note}>Illustrative historical invoices; not tax invoices or proof of a real payment.</p></OwnerPanel>
      {state.refunds.length > 0 && <OwnerPanel title="Refund requests"><DataTable label="Refund requests" headings={['Invoice', 'Requested amount', 'Status', 'Reason']}>{state.refunds.map(item => <tr key={item.id}><td>{item.invoiceId}</td><td>{money(item.amount)}</td><td>{item.status}</td><td>{item.reason}</td></tr>)}</DataTable><p>No refund is approved or paid by this demo. Eligibility must be reviewed by the billing service.</p></OwnerPanel>}</>}
    {screen === 'payments' && <OwnerPanel title="Payment history"><DataTable label="Payment history" headings={['Date', 'Invoice', 'Amount', 'Method', 'Result']}>{paymentHistory.map(item => <tr key={item.id}><td>{item.date}</td><td>{item.invoiceId}</td><td>{money(item.amount)}</td><td>{item.method}</td><td><span className={styles.status}>{item.status}</span></td></tr>)}</DataTable><p>Failed attempts are not counted as paid. Refund requests remain pending and do not create payment transactions.</p></OwnerPanel>}
    <Feedback value={feedback} />
    {plan && <ConfirmAction title={`Switch to ${plan}?`} description="Apply this plan immediately to the local demo. No charge, refund or proration is calculated. Existing data will be retained." confirmLabel="Apply demo plan" onClose={() => setPlan(null)} onConfirm={() => { changeOwnerPlan(plan); setFeedback({ message: `${plan} applied in demo. No payment was processed.` }) }}>{connections > planLimits(platform, plan).shopLimit && <p className={styles.error}>Your existing {connections} shops exceed this plan’s demo limit. They are retained; new connections will be blocked until usage is below the limit.</p>}</ConfirmAction>}
    {refundInvoice && <ConfirmAction title="Request subscription refund" description={`Submit ${refundInvoice.id} (${money(refundInvoice.amount)}) for review in this demo. No money will be returned.`} confirmLabel="Submit demo request" onClose={() => setRefundInvoice(null)} onConfirm={() => { requestRefund(refundInvoice.id, reason); setFeedback({ message: 'Demo refund request saved for review.' }) }}><label className={styles.field}>Refund reason<textarea value={reason} maxLength={1000} onChange={event => setReason(event.target.value)} /></label></ConfirmAction>}
    <Dialog open={Boolean(invoice)} onOpenChange={open => { if (!open) setInvoice(null) }}><DialogContent className={styles.dialog}><DialogTitle>{invoice?.id}</DialogTitle><DialogDescription>Sample subscription invoice · not a tax invoice.</DialogDescription>{invoice && <dl className={styles.details}>{[['Plan', invoice.plan], ['Period', invoice.period], ['Issue date', invoice.date], ['Amount', money(invoice.amount)], ['Status', invoice.status]].map(([label, value]) => <div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}</dl>}</DialogContent></Dialog>
  </>
}
