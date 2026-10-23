import { ArrowUpRight, Building2, CirclePause, Store, UsersRound } from 'lucide-react'
import { Link } from 'react-router-dom'
import { usePlatform } from './hooks/usePlatform'
import { usageIssues } from './lib/platformStore'
import { formatTime } from './lib/format'
import { PageHeading, TenantName, TenantStatus } from './components/PlatformUI'
import portal from '@/features/portal/PortalPage.module.css'
import styles from './Platform.module.css'

export default function PlatformOverview() {
  const { tenants, plans, audit } = usePlatform()
  const active = tenants.filter(tenant => tenant.status === 'ACTIVE')
  const shops = tenants.reduce((sum, tenant) => sum + tenant.shops.length, 0)
  const attention = tenants.filter(tenant => {
    const plan = plans.find(item => item.id === tenant.plan)
    return tenant.status === 'SUSPENDED' || tenant.shops.some(shop => shop.status === 'Needs attention') || tenant.skus / plan.skuLimit >= .9 || usageIssues(tenant, plan).length
  })
  const recent = [...tenants].sort((a, b) => b.created.localeCompare(a.created)).slice(0, 5)
  return <><PageHeading title="Platform overview" description="A clear view of tenants, plans and the work that needs your attention." action={<Link className={styles.actionLink} to="/admin/tenants">Manage tenants<ArrowUpRight size={16} aria-hidden="true" /></Link>} />
    <div className={`${portal.stats} ${styles.overviewStats}`}>{[[Building2, 'Total tenants', tenants.length, `${tenants.filter(tenant => tenant.status === 'ONBOARDING').length} completing onboarding`], [UsersRound, 'Active workspaces', active.length, 'Tenants with platform access'], [Store, 'Connected shops', shops, 'Across Shopee and TikTok Shop'], [CirclePause, 'Suspended tenants', tenants.filter(tenant => tenant.status === 'SUSPENDED').length, 'Access paused for review']].map(([Icon, label, value, caption]) => <div key={label}><div className={portal.statLabel}>{label}<Icon size={17} aria-hidden="true" /></div><strong>{value}</strong><span>{caption}</span></div>)}</div>
    <div className={portal.dashboardGrid}>
      <section className={portal.panel}><div className={portal.panelHeading}><div><h2>Recent workspaces</h2><p>The five most recently created tenants</p></div><Link className={styles.viewAll} to="/admin/tenants">View all</Link></div><div className={styles.workspaceRows}>{recent.map(tenant => <div key={tenant.id}><TenantName tenant={tenant} /><div><span className={styles.planLabel}>{tenant.plan}</span><TenantStatus status={tenant.status} /></div></div>)}</div></section>
      <section className={portal.panel}><div className={portal.panelHeading}><div><h2>Needs attention</h2><p>{attention.length} workspaces to review</p></div></div><div className={styles.attentionList}>{attention.map(tenant => <Link key={tenant.id} to={`/admin/tenants/${tenant.id}`}><strong>{tenant.name}</strong><span>{tenant.status === 'SUSPENDED' ? 'Workspace suspended' : usageIssues(tenant, plans.find(plan => plan.id === tenant.plan)).length ? 'Usage exceeds current plan limits' : tenant.shops.some(shop => shop.status === 'Needs attention') ? 'Shop connection needs attention' : 'SKU usage is nearing the demo limit'}</span></Link>)}{attention.length === 0 && <p className={styles.empty}>No workspaces need attention.</p>}</div></section>
      <section className={portal.panel}><div className={portal.panelHeading}><div><h2>Plan distribution</h2><p>Current tenant subscriptions · mock data</p></div><Link className={styles.viewAll} to="/admin/plans">Manage plans</Link></div><div className={styles.planDistribution}>{plans.map(plan => { const count = tenants.filter(tenant => tenant.plan === plan.id).length; return <div key={plan.id}><div><span>{plan.id}</span><strong>{count} tenants</strong></div><div className={portal.track}><span style={{ width: `${count / tenants.length * 100}%` }} /></div><p>{plan.shopLimit} shop connections · {plan.skuLimit.toLocaleString()} SKUs</p></div> })}</div></section>
      <section className={portal.panel}><div className={portal.panelHeading}><div><h2>Admin activity</h2><p>Latest platform actions · GMT+7</p></div><Link className={styles.viewAll} to="/admin/audit">View all</Link></div><div className={styles.auditPreview}>{audit.slice(0, 3).map(entry => <div key={entry.id}><p><strong>{entry.actor}</strong> · {entry.action.toLowerCase()}</p>{entry.tenantId ? <Link to={`/admin/tenants/${entry.tenantId}`}>{entry.target}</Link> : <Link to="/admin/plans">{entry.target}</Link>}<span>{formatTime(entry.at)}</span></div>)}</div></section>
    </div><p className={styles.demoNote}>Local demo data. Plan limits are illustrative; no billing or live monitoring is connected.</p>
  </>
}

