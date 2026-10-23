import { useState } from 'react'
import { Switch } from 'radix-ui'
import { Button } from '@/shared/ui/button'
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogTitle } from '@/shared/ui/dialog'
import { planFeatures } from './data/platformFeatures'
import { updatePlanFeatures } from './lib/platformStore'
import styles from './Platform.module.css'

export default function PlanFeatureEditor({ plan, tenantCount, onClose, onSaved }) {
  const [features, setFeatures] = useState({ ...plan.features })
  const [reason, setReason] = useState('')
  const [error, setError] = useState('')
  const changes = planFeatures.filter(feature => plan.features[feature.id] !== features[feature.id])
  function save(event) {
    event.preventDefault()
    try { updatePlanFeatures(plan.id, features, reason); onSaved(`${plan.id} features updated for ${tenantCount} demo tenants.`); onClose() } catch (failure) { setError(failure.message) }
  }
  return <Dialog open onOpenChange={open => { if (!open) onClose() }}><DialogContent className={styles.modal} onInteractOutside={event => event.preventDefault()}><form onSubmit={save}><DialogTitle>Configure {plan.id} features</DialogTitle><DialogDescription className={styles.modalDescription}>Feature availability updates the merchant dashboard for every tenant on this plan.</DialogDescription><div className={styles.featureList}>{planFeatures.map(feature => <div key={feature.id}><div><label htmlFor={`feature-${feature.id}`}>{feature.label}</label><p>{feature.description}</p></div><Switch.Root id={`feature-${feature.id}`} checked={features[feature.id]} onCheckedChange={checked => setFeatures(current => ({ ...current, [feature.id]: checked }))} className={styles.featureSwitch}><Switch.Thumb className={styles.featureThumb} /></Switch.Root></div>)}</div><div className={styles.impact}><strong>{tenantCount} tenants affected · {changes.length} feature changes</strong>{changes.length > 0 && <ul>{changes.map(feature => <li key={feature.id}>{feature.label}: {features[feature.id] ? 'enable' : 'disable'}</li>)}</ul>}</div><label className={styles.field}>Reason<textarea required maxLength={500} value={reason} onChange={event => setReason(event.target.value)} /></label><p className={styles.fieldError} role="alert">{error}</p><DialogFooter><DialogClose asChild><Button type="button" variant="outline">Cancel</Button></DialogClose><Button type="submit">Save features</Button></DialogFooter></form></DialogContent></Dialog>
}
