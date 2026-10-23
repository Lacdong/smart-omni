import { useState, useSyncExternalStore } from 'react'
import { Download, Search } from 'lucide-react'
import { Button } from '@/shared/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogTitle } from '@/shared/ui/dialog'
import { getDemoSecurityEvents, subscribeDemoSecurity } from '@/features/auth/lib/demoSecurityLog'
import { initialSecurityEvents } from './data/alertFixtures'
import { usePlatformFilters } from './hooks/usePlatformFilters'
import { exportCsv } from './lib/exportCsv'
import { EmptyResults, PageHeading } from './components/PlatformUI'
import { Severity } from './components/AlertBadges'
import { severities } from './data/alertLabels'
import { formatTime } from './lib/format'
import portal from '@/features/portal/PortalPage.module.css'
import styles from './Platform.module.css'

const types = { LOGIN_SUCCESS: 'Successful sign-in', LOGIN_FAILURE: 'Failed sign-in', LOGOUT: 'Sign-out', ACCESS_DENIED: 'Access denied', ENTITLEMENTS_CHANGED: 'Plan feature change', TENANT_ACCESS_CHANGED: 'Tenant access change', PLAN_LIMITS_CHANGED: 'Plan definition change' }
export default function SecurityLog() {
  const localEvents = useSyncExternalStore(subscribeDemoSecurity, getDemoSecurityEvents, getDemoSecurityEvents)
  const events = [...localEvents, ...initialSecurityEvents].sort((a, b) => b.at.localeCompare(a.at))
  const { params, filter, clear } = usePlatformFilters()
  const [selected, setSelected] = useState(null)
  const [notice, setNotice] = useState('')
  const query = params.get('q') || ''
  const type = params.get('type') || 'all'
  const severity = params.get('severity') || 'all'
  const result = events.filter(event => `${event.actor} ${event.type} ${types[event.type]} ${event.message} ${event.resource}`.toLowerCase().includes(query.trim().toLowerCase()) && (type === 'all' || type === event.type) && (severity === 'all' || severity === event.severity))
  function download() { exportCsv('smartomni-security-events-demo.csv', [['Time (UTC)', 'Type', 'Severity', 'Actor', 'Result', 'Resource', 'Message', 'Source'], ...result.map(event => [event.at, event.type, event.severity, event.actor, event.result, event.resource, event.message, event.source])]); setNotice(`Exported ${result.length} demo security events.`) }
  return <><PageHeading title="Security logs" description="Inspect demo authentication, access-denial and entitlement-change events." action={<Button variant="outline" className={portal.outline} onClick={download}><Download size={16} aria-hidden="true" />Export security log</Button>} /><div className={styles.toolbar}><label className={styles.search}><Search size={17} aria-hidden="true" /><span className="sr-only">Search security events</span><input value={query} onChange={event => filter('q', event.target.value)} placeholder="Search actor, event or resource" /></label><label>Event<select aria-label="Security event" value={type} onChange={event => filter('type', event.target.value)}><option value="all">All events</option>{Object.entries(types).map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></label><label>Severity<select aria-label="Severity" value={severity} onChange={event => filter('severity', event.target.value)}><option value="all">All severities</option>{Object.entries(severities).map(([value, label]) => <option value={value} key={value}>{label}</option>)}</select></label></div><p className={styles.notice} role="status">{notice}</p><section className={portal.panel} aria-label="Security events"><div className={styles.logList}>{result.map(event => <article key={event.id}><div><button className={styles.eventButton} onClick={() => setSelected(event)}>{types[event.type] || event.type}</button><Severity severity={event.severity} /></div><p>{event.actor} · {event.result} · {formatTime(event.at)}</p><span className={styles.help}>{event.source} · {event.resource}</span></article>)}</div>{!result.length && <EmptyResults label="No security events match these filters." onClear={clear} />}</section><p className={styles.demoNote}>Sample fixtures plus local demo session events. Passwords, arbitrary login input and IP addresses are not recorded. This browser history is not a server security audit.</p>
    <Dialog open={Boolean(selected)} onOpenChange={open => { if (!open) setSelected(null) }}><DialogContent className={styles.modal}><DialogTitle>{types[selected?.type] || 'Security event'}</DialogTitle><DialogDescription>{selected?.message}</DialogDescription>{selected && <dl className={styles.alertMetadata}><dt>Event ID</dt><dd>{selected.id}</dd><dt>Time</dt><dd>{formatTime(selected.at)} · GMT+7</dd><dt>Actor</dt><dd>{selected.actor}</dd><dt>Result</dt><dd>{selected.result}</dd><dt>Resource</dt><dd>{selected.resource}</dd><dt>Source</dt><dd>{selected.source}</dd><dt>Severity</dt><dd><Severity severity={selected.severity} /></dd></dl>}</DialogContent></Dialog>
  </>
}

