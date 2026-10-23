import { useState } from 'react'
import { Download, Search } from 'lucide-react'
import { Link } from 'react-router-dom'
import { usePlatformFilters } from './hooks/usePlatformFilters'
import { Button } from '@/shared/ui/button'
import { usePlatform } from './hooks/usePlatform'
import { EmptyResults, PageHeading } from './components/PlatformUI'
import { formatTime } from './lib/format'
import portal from '@/features/portal/PortalPage.module.css'
import styles from './Platform.module.css'

export default function ActionLog() {
  const { audit } = usePlatform()
  const { params, filter, clear } = usePlatformFilters()
  const [notice, setNotice] = useState('')
  const query = params.get('q') || ''
  const action = params.get('action') || 'all'
  const result = audit.filter(entry => `${entry.actor} ${entry.action} ${entry.target} ${entry.reason}`.toLowerCase().includes(query.trim().toLowerCase()) && (action === 'all' || entry.action === action))
  function exportLog() {
    // Escape both CSV syntax and spreadsheet formula prefixes in user-entered reasons.
    const cell = value => `"${String(value).replace(/^[=+@\-\t\r]/, match => `'${match}`).replaceAll('"', '""')}"`
    const rows = [['Time (UTC)', 'Actor', 'Action', 'Target', 'Reason'], ...result.map(entry => [entry.at, entry.actor, entry.action, entry.target, entry.reason])]
    const url = URL.createObjectURL(new Blob(['\uFEFF' + rows.map(row => row.map(cell).join(',')).join('\r\n')], { type: 'text/csv;charset=utf-8;' }))
    const link = document.createElement('a'); link.href = url; link.download = 'smartomni-admin-actions-demo.csv'; link.click()
    setTimeout(() => URL.revokeObjectURL(url), 1000)
    setNotice(`Exported ${result.length} demo actions.`)
  }
  return <><PageHeading title="Action log" description="Review who changed tenant access or plan definitions, and why." action={<Button variant="outline" className={portal.outline} onClick={exportLog}><Download size={16} aria-hidden="true" />Export log</Button>} /><div className={styles.toolbar}><label className={styles.search}><Search size={17} aria-hidden="true" /><span className="sr-only">Search actions</span><input value={query} onChange={event => filter('q', event.target.value)} placeholder="Search actor, tenant or reason" /></label><label>Action<select aria-label="Action" value={action} onChange={event => filter('action', event.target.value)}><option value="all">All actions</option>{[...new Set(audit.map(entry => entry.action))].map(item => <option key={item}>{item}</option>)}</select></label><span className={styles.resultCount}>{result.length} actions · GMT+7</span></div><p role="status" className={styles.notice}>{notice}</p><section className={portal.panel} aria-label="Admin actions"><div className={styles.logList}>{result.map(entry => <article key={entry.id}><div><strong>{entry.action}</strong><span>{formatTime(entry.at)}</span></div><p>{entry.tenantId ? <Link to={`/admin/tenants/${entry.tenantId}`}>{entry.target}</Link> : <Link to="/admin/plans">{entry.target}</Link>}<span> · {entry.actor}</span></p><p>{entry.reason}</p></article>)}</div>{!result.length && <EmptyResults label="No actions match these filters." onClear={clear} />}</section><p className={styles.demoNote}>This is a local demo action history, not a server audit or security monitoring system.</p></>
}



