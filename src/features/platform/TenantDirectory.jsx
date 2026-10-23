import { Search } from 'lucide-react'
import { usePlatformFilters } from './hooks/usePlatformFilters'
import { usePlatform } from './hooks/usePlatform'
import { EmptyResults, PageHeading, TenantName, TenantStatus } from './components/PlatformUI'
import { formatDate } from './lib/format'
import portal from '@/features/portal/PortalPage.module.css'
import styles from './Platform.module.css'

export default function TenantDirectory() {
  const { tenants } = usePlatform()
  const { params, filter, clear } = usePlatformFilters()
  const query = params.get('q') || ''
  const status = params.get('status') || 'all'
  const plan = params.get('plan') || 'all'
  const result = tenants.filter(tenant => `${tenant.name} ${tenant.owner} ${tenant.email} ${tenant.domain}`.toLowerCase().includes(query.trim().toLowerCase()) && (status === 'all' || tenant.status === status) && (plan === 'all' || tenant.plan === plan))
  return <><PageHeading title="Tenants" description="Find workspaces, review usage and manage platform access." />
    <div className={styles.toolbar}><label className={styles.search}><Search size={17} aria-hidden="true" /><span className="sr-only">Search tenants</span><input value={query} onChange={event => filter('q', event.target.value)} placeholder="Search name, owner or domain" /></label><label>Status<select aria-label="Status" value={status} onChange={event => filter('status', event.target.value)}><option value="all">All statuses</option><option value="ACTIVE">Active</option><option value="ONBOARDING">Onboarding</option><option value="SUSPENDED">Suspended</option></select></label><label>Plan<select aria-label="Plan" value={plan} onChange={event => filter('plan', event.target.value)}><option value="all">All plans</option><option>Free</option><option>Pro</option></select></label><span className={styles.resultCount}>{result.length} of {tenants.length} tenants</span></div>
    <section className={portal.panel} aria-label="Tenant directory"><div className={styles.tenantTable}><table><thead><tr><th>Workspace</th><th>Owner</th><th>Plan</th><th>Status</th><th>Usage</th><th>Created</th></tr></thead><tbody>{result.map(tenant => <tr key={tenant.id}><td data-label="Workspace"><TenantName tenant={tenant} /></td><td data-label="Owner"><strong className={styles.ownerName}>{tenant.owner}</strong><span className={styles.subtext}>{tenant.email}</span></td><td data-label="Plan">{tenant.plan}</td><td data-label="Status"><TenantStatus status={tenant.status} /></td><td data-label="Usage">{tenant.skus.toLocaleString()} SKUs</td><td data-label="Created">{formatDate(tenant.created)}</td></tr>)}</tbody></table></div>{result.length === 0 && <EmptyResults onClear={clear} />}</section>
  </>
}



