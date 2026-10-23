import { useState } from 'react'
import { Download, Search } from 'lucide-react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { Button } from '@/shared/ui/button'
import { MarketplaceLogo } from '@/shared/components/MarketplaceLogo'
import { Dialog, DialogContent, DialogDescription, DialogTitle } from '@/shared/ui/dialog'
import { usePlatform } from './hooks/usePlatform'
import { usePlatformFilters } from './hooks/usePlatformFilters'
import { transitionAlert } from './lib/platformStore'
import { exportCsv } from './lib/exportCsv'
import { EmptyResults, PageHeading } from './components/PlatformUI'
import { AlertStatus, Severity } from './components/AlertBadges'
import { alertStatuses, severities } from './data/alertLabels'
import { formatTime } from './lib/format'
import portal from '@/features/portal/PortalPage.module.css'
import styles from './Platform.module.css'

function AlertDetails({ alert, tenant, close }) {
  const [action, setAction] = useState('')
  const [note, setNote] = useState('')
  const [error, setError] = useState('')
  const actionLabels = { acknowledge: 'Acknowledge alert', resolve: 'Resolve in demo', reopen: 'Reopen in demo' }
  function submit(event) {
    event.preventDefault()
    try { transitionAlert(alert.id, action, note); setAction(''); setNote(''); setError('') } catch (failure) { setError(failure.message) }
  }
  return <Dialog open onOpenChange={open => { if (!open) close() }}><DialogContent className={styles.alertModal}><DialogTitle>{alert.title}</DialogTitle><DialogDescription>{alert.description}</DialogDescription><div className={styles.alertBadges}><Severity severity={alert.severity} /><AlertStatus status={alert.status} /><code>{alert.code}</code></div><dl className={styles.alertMetadata}><dt>Workspace</dt><dd>{tenant ? <Link to={`/admin/tenants/${tenant.id}`}>{tenant.name}</Link> : 'Platform-wide'}</dd>{alert.shopName && <><dt>Shop</dt><dd>{alert.shopName}</dd></>}<dt>Service</dt><dd>{alert.service}</dd><dt>First observed</dt><dd>{formatTime(alert.firstSeen)} · GMT+7</dd><dt>Last update</dt><dd>{formatTime(alert.lastSeen)} · GMT+7</dd><dt>Occurrences</dt><dd>{alert.occurrences}</dd></dl><div className={styles.impact}><strong>Suggested next step</strong><p>{alert.recommendation}</p></div>
    {action ? <form onSubmit={submit}><p className={styles.help}>{action === 'resolve' ? 'This simulates recovery of the sample incident. No provider calls, webhook replay or job retry will run.' : action === 'reopen' ? 'This simulates the issue recurring and returns the alert to Open.' : 'Record who is reviewing the alert. Acknowledging does not resolve the issue.'}</p><label className={styles.field}>Action note<textarea required maxLength={500} value={note} onChange={event => { setNote(event.target.value); setError('') }} /></label><p role="alert" className={styles.fieldError}>{error}</p><div className={styles.alertActions}><Button type="button" variant="outline" onClick={() => { setAction(''); setNote(''); setError('') }}>Cancel action</Button><Button type="submit">{actionLabels[action]}</Button></div></form> : <div className={styles.alertActions}>{alert.status === 'OPEN' && <Button variant="outline" onClick={() => setAction('acknowledge')}>Acknowledge alert</Button>}{alert.status !== 'RESOLVED' ? <Button variant="outline" onClick={() => setAction('resolve')}>Resolve in demo</Button> : <Button variant="outline" onClick={() => setAction('reopen')}>Reopen in demo</Button>}</div>}
    <h3 className={styles.smallHeading}>Alert history</h3><div className={styles.alertHistory}>{[...alert.history].reverse().map((entry, index) => <div key={`${entry.at}-${index}`}><strong>{entry.action}</strong><p>{entry.note}</p><span>{entry.actor} · {formatTime(entry.at)}</span></div>)}</div></DialogContent></Dialog>
}

export default function AlertsPage({ kind }) {
  const { alerts, tenants } = usePlatform()
  const { params, filter, clear } = usePlatformFilters()
  const { alertId } = useParams()
  const navigate = useNavigate()
  const [notice, setNotice] = useState('')
  const root = kind === 'shop' ? '/admin/shop-alerts' : '/admin/operations'
  const title = kind === 'shop' ? 'Shop connection alerts' : 'Operational alerts'
  const items = alerts.filter(alert => alert.kind === kind)
  const query = params.get('q') || ''
  const status = params.get('status') || 'all'
  const severity = params.get('severity') || 'all'
  const platform = params.get('platform') || 'all'
  const result = items.filter(alert => `${alert.title} ${alert.code} ${alert.service} ${alert.shopName || ''} ${tenants.find(tenant => tenant.id === alert.tenantId)?.name || 'Platform-wide'}`.toLowerCase().includes(query.trim().toLowerCase()) && (status === 'all' || alert.status === status) && (severity === 'all' || alert.severity === severity) && (platform === 'all' || alert.platform === platform)).sort((a, b) => b.lastSeen.localeCompare(a.lastSeen))
  const selected = items.find(alert => alert.id === alertId)
  const search = params.toString() ? `?${params}` : ''
  function download() {
    exportCsv(`smartomni-${kind}-alerts-demo.csv`, [['ID', 'Title', 'Code', 'Workspace', 'Severity', 'Status', 'Last update (UTC)'], ...result.map(alert => [alert.id, alert.title, alert.code, tenants.find(tenant => tenant.id === alert.tenantId)?.name || 'Platform-wide', alert.severity, alert.status, alert.lastSeen])])
    setNotice(`Exported ${result.length} demo alerts.`)
  }
  if (alertId && !selected) return <><PageHeading title="Alert not found" description="This alert is not available in this demo category." /><Link className={styles.backLink} to={root}>Back to alerts</Link></>
  return <><PageHeading title={title} description={kind === 'shop' ? 'Review authorization, connectivity and marketplace API issues across workspaces.' : 'Review sample webhook, sync-job, worker and service incidents.'} action={<Button variant="outline" className={portal.outline} onClick={download}><Download size={16} aria-hidden="true" />Export alerts</Button>} />
    <div className={`${portal.stats} ${styles.overviewStats}`}>{[['Open', items.filter(item => item.status === 'OPEN').length], ['Acknowledged', items.filter(item => item.status === 'ACKNOWLEDGED').length], ['Resolved', items.filter(item => item.status === 'RESOLVED').length], ['Active critical', items.filter(item => item.severity === 'CRITICAL' && item.status !== 'RESOLVED').length]].map(([label, count]) => <div key={label}><span className={portal.statLabel}>{label}</span><strong>{count}</strong></div>)}</div>
    <div className={`${styles.toolbar} ${styles.alertFilters}`}><label className={styles.search}><Search size={17} aria-hidden="true" /><span className="sr-only">Search alerts</span><input value={query} onChange={event => filter('q', event.target.value)} placeholder="Search alert, tenant or code" /></label><label>Status<select aria-label="Alert status" value={status} onChange={event => filter('status', event.target.value)}><option value="all">All statuses</option>{Object.entries(alertStatuses).map(([value, label]) => <option value={value} key={value}>{label}</option>)}</select></label><label>Severity<select aria-label="Severity" value={severity} onChange={event => filter('severity', event.target.value)}><option value="all">All severities</option>{Object.entries(severities).map(([value, label]) => <option value={value} key={value}>{label}</option>)}</select></label>{kind === 'shop' && <label>Platform<select aria-label="Marketplace" value={platform} onChange={event => filter('platform', event.target.value)}><option value="all">All platforms</option><option value="shopee">Shopee</option><option value="tiktok">TikTok Shop</option></select></label>}</div><p className={styles.notice} role="status">{notice}</p>
    <section className={portal.panel} aria-label={title}><div className={styles.alertRows}>{result.map(alert => <article key={alert.id}><div className={styles.alertRowTitle}>{alert.platform && <MarketplaceLogo marketplace={alert.platform} size={28} decorative />}<div><Link to={`${root}/${alert.id}${search}`} className={styles.nameLink}>{alert.title}</Link><p><span>{tenants.find(tenant => tenant.id === alert.tenantId)?.name || 'Platform-wide'}</span><span>{alert.shopName && alert.shopName !== tenants.find(tenant => tenant.id === alert.tenantId)?.name ? alert.shopName : alert.service}</span></p></div><div className={styles.alertBadges}><Severity severity={alert.severity} /><AlertStatus status={alert.status} /></div></div><div className={styles.alertRowMeta}><code>{alert.code}</code><span>{alert.occurrences} occurrences</span><span>Updated {formatTime(alert.lastSeen)}</span></div></article>)}</div>{!result.length && <EmptyResults label="No alerts match these filters." onClear={clear} />}</section><p className={styles.demoNote}>Sample incidents · GMT+7. Acknowledgment and recovery are local simulations; no external system is changed.</p>
    {selected && <AlertDetails key={selected.id} alert={selected} tenant={tenants.find(tenant => tenant.id === selected.tenantId)} close={() => navigate(`${root}${search}`)} />}
  </>
}


