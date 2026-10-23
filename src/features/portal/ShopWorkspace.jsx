import { useState } from 'react'
import { Button } from '@/shared/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogTitle } from '@/shared/ui/dialog'
import { authorizeOwnerShop, ownerConnectionAlerts, ownerConnections } from './lib/ownerWorkspaceStore'
import { ConfirmAction, DataTable, Feedback, OwnerPanel } from './components/OwnerWorkspaceUI'
import styles from './OwnerWorkspace.module.css'

export default function ShopWorkspace({ screen, state, tenant, platform }) {
  const [marketplace, setMarketplace] = useState('shopee')
  const [name, setName] = useState('')
  const [preview, setPreview] = useState(null)
  const [feedback, setFeedback] = useState(null)
  const [alert, setAlert] = useState(null)
  const [status, setStatus] = useState('ALL')
  const shops = ownerConnections(state, tenant, platform)
  const alerts = ownerConnectionAlerts(state, platform).filter(item => status === 'ALL' || item.status === status)
  return <>
    {screen === 'shops' ? <><OwnerPanel title="Authorize a shop"><p>Preview the shop identity, then confirm the local connection. No credentials are collected and no provider authorization is performed.</p><form className={styles.form} onSubmit={event => { event.preventDefault(); setPreview({ platform: marketplace, name, reauthorize: false }) }}><label className={styles.field}>Marketplace<select value={marketplace} onChange={event => setMarketplace(event.target.value)}><option value="shopee">Shopee</option><option value="tiktok">TikTok Shop</option></select></label><label className={styles.field}>Shop name<input required maxLength={100} value={name} onChange={event => setName(event.target.value)} /></label><div className={styles.actions}><Button type="submit">Preview demo authorization</Button></div></form></OwnerPanel><OwnerPanel title="Connected shops"><DataTable label="Connected shops" headings={['Shop', 'Marketplace', 'Status', 'Action']}>{shops.map(shop => <tr key={`${shop.platform}-${shop.name}`}><td>{shop.name}</td><td>{shop.platform === 'shopee' ? 'Shopee' : 'TikTok Shop'}</td><td><span className={styles.status}>{shop.status}</span></td><td><Button variant="outline" onClick={() => setPreview({ ...shop, reauthorize: true })}>Reauthorize in demo</Button></td></tr>)}</DataTable></OwnerPanel></>
      : <OwnerPanel title="Shop connection alerts"><label className={styles.field}>Connection alert status<select value={status} onChange={event => setStatus(event.target.value)}><option value="ALL">All statuses</option><option value="OPEN">Open</option><option value="ACKNOWLEDGED">Acknowledged</option><option value="RESOLVED">Resolved</option></select></label>{alerts.length ? <DataTable label="Shop connection alerts" headings={['Alert', 'Shop', 'Severity', 'Status', 'Action']}>{alerts.map(item => <tr key={item.id}><td>{item.title}</td><td>{item.shopName}</td><td>{item.severity}</td><td>{item.status}</td><td><Button variant="outline" onClick={() => setAlert(item)}>View alert</Button></td></tr>)}</DataTable> : <p>No alerts match this status.</p>}</OwnerPanel>}
    <Feedback value={feedback} />
    {preview && <ConfirmAction title={preview.reauthorize ? 'Reauthorize connected shop' : 'Confirm shop connection'} description={`${preview.name} · ${preview.platform}. This is a local authorization preview; shop ownership and provider permissions are not verified.`} confirmLabel="Confirm in demo" onClose={() => setPreview(null)} onConfirm={() => { authorizeOwnerShop(preview.platform, preview.name, preview.reauthorize); setName(''); setFeedback({ message: preview.reauthorize ? 'Shop reauthorized in the local demo.' : 'Demo shop connection saved.' }) }} />}
    <Dialog open={Boolean(alert)} onOpenChange={open => { if (!open) setAlert(null) }}><DialogContent className={styles.dialog}><DialogTitle>{alert?.title}</DialogTitle><DialogDescription>{alert?.description}</DialogDescription>{alert && <><p className={styles.note}>{alert.code} · {alert.status} · {alert.shopName}</p><ul className={styles.list}>{alert.history.map((item, index) => <li key={index}><strong>{item.action}</strong><p>{item.note}</p><span className={styles.note}>{new Date(item.at).toLocaleString('en-GB')}</span></li>)}</ul><p>Review Shop connections to renew authorization in the demo. Real recovery requires provider verification.</p></>}</DialogContent></Dialog>
  </>
}
