import { useState, useSyncExternalStore } from 'react'
import { getDemoSecurityEvents, subscribeDemoSecurity } from '@/features/auth/lib/demoSecurityLog'
import { DataTable, OwnerPanel } from './components/OwnerWorkspaceUI'
import styles from './OwnerWorkspace.module.css'

export default function OwnerLogs({ state }) {
  const security = useSyncExternalStore(subscribeDemoSecurity, getDemoSecurityEvents, () => [])
  const [tab, setTab] = useState('activity')
  const [query, setQuery] = useState('')
  const [result, setResult] = useState('ALL')
  const source = tab === 'activity' ? state.audit : security.filter(item => item.tenantId === 'demo-tenant')
  const rows = source.filter(item => `${item.action || item.type} ${item.detail || item.message} ${item.actor}`.toLowerCase().includes(query.trim().toLowerCase()) && (result === 'ALL' || item.result === result))
  return <OwnerPanel title="Tenant activity & security"><div className={styles.actions}><button aria-pressed={tab === 'activity'} className={styles.status} onClick={() => { setTab('activity'); setResult('ALL') }}>Activity log</button><button aria-pressed={tab === 'security'} className={styles.status} onClick={() => setTab('security')}>Security log</button></div><div className={styles.filters}><label className={styles.field}>Search tenant logs<input type="search" value={query} onChange={event => setQuery(event.target.value)} /></label>{tab === 'security' && <label className={styles.field}>Security result<select value={result} onChange={event => setResult(event.target.value)}><option value="ALL">All results</option><option value="Allowed">Allowed</option><option value="Rejected">Rejected</option><option value="Blocked">Blocked</option><option value="Completed">Completed</option></select></label>}</div>{rows.length ? <DataTable label="Tenant logs" headings={['Time', 'Actor', 'Action / event', 'Details', 'Source']}>{rows.map(item => <tr key={item.id}><td>{new Date(item.at).toLocaleString('en-GB')}</td><td>{item.actor}</td><td>{item.action || item.type}{item.result && <p>{item.result}</p>}</td><td>{item.detail || item.message}</td><td>{item.source}</td></tr>)}</DataTable> : <p>No tenant events match this selection. Local Owner actions and tenant-associated security events appear here.</p>}<p className={styles.note}>Only demo-tenant events are shown. Browser logs are editable and limited to local activity; they are not server audit records or proof of security enforcement.</p></OwnerPanel>
}
