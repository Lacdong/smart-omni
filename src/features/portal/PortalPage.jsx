import { lazy, Suspense } from 'react'
import { Bell, Boxes, Building2, CircleUserRound, CreditCard, LayoutDashboard, LockKeyhole, LogOut, Package, ScrollText, ShieldCheck, Store } from 'lucide-react'
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom'
import { Brand } from '@/shared/components/Brand'
import { Button } from '@/shared/ui/button'
import { useDemoSession } from '@/features/auth/hooks/useDemoSession'
import { signOutDemo } from '@/features/auth/lib/demoSession'
import { useTenantAccess } from '@/features/auth/hooks/useTenantAccess'
import styles from './PortalPage.module.css'

const OwnerDashboard = lazy(() => import('./OwnerDashboard'))
const AdminConsole = lazy(() => import('@/features/platform/AdminConsole'))

export function PortalPage() {
  const session = useDemoSession()
  const tenantStatus = useTenantAccess(session?.tenantId)
  const { pathname } = useLocation()
  const navigate = useNavigate()
  if (!session) return <Navigate to="/auth/login" replace />
  const admin = session.role === 'SUPER_ADMIN'
  if (admin && !pathname.startsWith('/admin')) return <Navigate to="/admin" replace />
  if (!admin && pathname.startsWith('/admin')) return <Navigate to="/merchant/dashboard" replace />
  const base = admin ? '/admin' : '/merchant'
  const profile = pathname === `${base}/profile`
  const notifications = pathname === `${base}/notifications`
  const home = admin ? '/admin' : '/merchant/dashboard'
  if (!admin && ![home, `${base}/profile`, `${base}/notifications`].includes(pathname)) return <Navigate to={home} replace />
  const suspended = tenantStatus === 'SUSPENDED'
  const ownerAccess = !suspended && session.role === 'TENANT_OWNER' && session.membershipStatus === 'ACTIVE' && session.onboardingStatus === 'COMPLETED'
  const title = profile ? 'Your profile' : notifications ? 'Notifications' : admin ? pathname.startsWith('/admin/tenants') ? 'Tenants' : pathname === '/admin/plans' ? 'Plans & limits' : pathname === '/admin/audit' ? 'Action log' : 'Platform overview' : 'Overview'
  const navigation = admin ? [[home, LayoutDashboard, 'Overview'], ['/admin/tenants', Building2, 'Tenants'], ['/admin/plans', CreditCard, 'Plans & limits'], ['/admin/audit', ScrollText, 'Action log'], [`${base}/profile`, CircleUserRound, 'Your profile']] : [[home, LayoutDashboard, 'Overview'], [`${base}/notifications`, Bell, 'Notifications'], [`${base}/profile`, CircleUserRound, 'Your profile']]
  function logout() { signOutDemo(); navigate('/auth/login', { replace: true }) }
  return <div className={styles.shell}>
    <aside className={`${styles.sidebar} ${admin ? styles.platformSidebar : ''}`} aria-label="Workspace navigation">
      <div className={styles.brand}><Brand /></div>
      <div className={styles.workspace}><span className={styles.storeIcon}>{admin ? <ShieldCheck size={19} /> : <Store size={19} />}</span><div><strong>{session.tenantName || (admin ? 'SmartOmni Platform' : 'Your workspace')}</strong><span>{session.roleLabel}</span></div></div>
      <p className={styles.navLabel}>{admin ? 'PLATFORM' : 'WORKSPACE'}</p>
      {admin && <label className={styles.platformMobileNav}><span className="sr-only">Platform navigation</span><select aria-label="Platform navigation" value={pathname.startsWith('/admin/tenants') ? '/admin/tenants' : navigation.some(([to]) => to === pathname) ? pathname : '/admin'} onChange={event => navigate(event.target.value)}>{navigation.map(([to, , label]) => <option value={to} key={to}>{label}</option>)}</select></label>}
      <nav>{navigation.map(([to, Icon, label]) => <Link key={to} to={to} aria-current={pathname === to || (to === '/admin/tenants' && pathname.startsWith('/admin/tenants/')) ? 'page' : undefined}><Icon size={18} aria-hidden="true" />{label}{label === 'Overview' && !ownerAccess && !admin && <LockKeyhole size={14} className={styles.navLock} aria-label="Locked" />}</Link>)}</nav>
      {ownerAccess && <><p className={styles.navLabel}>STORE OPERATIONS</p><nav>{[['orders', 'Recent orders', Package], ['inventory', 'Inventory alerts', Boxes], ['channels', 'Sales channels', Store]].map(([id, label, Icon]) => <a key={id} href={`${home}#${id}`}><Icon size={18} aria-hidden="true" />{label}</a>)}</nav></>}
      <div className={styles.sidebarBottom}><p>Demo workspace<span>Sample data. No live connections.</span></p><Button variant="ghost" onClick={logout}><LogOut size={16} aria-hidden="true" />Sign out</Button></div>
    </aside>
    <div className={styles.main}>
      <header className={styles.topbar}><span>{admin ? 'Platform' : 'Workspace'}<span className={styles.slash}>/</span><strong>{title}</strong></span><div><span className={styles.demoBadge}>Demo mode</span><Link className={styles.bell} to={`${base}/notifications`} aria-label="Notifications"><Bell size={18} /></Link><Link className={styles.avatar} to={`${base}/profile`} aria-label="Your profile">{session.name.split(' ').map(word => word[0]).join('')}</Link><Button variant="ghost" size="icon" className={styles.mobileLogout} aria-label="Sign out" onClick={logout}><LogOut size={18} /></Button></div></header>
      <main id="main-content" tabIndex={-1} className={styles.content}>
        {profile ? <><div className={styles.pageHeading}><p>ACCOUNT</p><h1>Your profile</h1></div><section className={styles.accountCard}><h2>Personal information</h2><dl><dt>Full name</dt><dd>{session.name}</dd><dt>Email address</dt><dd>{session.email}</dd><dt>Role</dt><dd>{session.roleLabel}</dd><dt>Workspace</dt><dd>{session.tenantName || 'No workspace assigned'}</dd></dl><p>This demo profile is read-only.</p></section></>
          : notifications ? <><div className={styles.pageHeading}><p>YOUR INBOX</p><h1>Notifications</h1></div><section className={styles.emptyPanel}><Bell size={28} aria-hidden="true" /><h2>You’re all caught up</h2><p>{session.role === 'TENANT_STAFF' ? 'No workspace invitations yet. When an owner invites you, review and accept the invitation here.' : 'There are no new account notifications in this demo.'}</p></section></>
            : admin ? <Suspense fallback={<p role="status">Loading platform administration…</p>}><AdminConsole /></Suspense>
              : suspended ? <section className={styles.locked}><span className={styles.lockIcon}><LockKeyhole size={28} aria-hidden="true" /></span><p className={styles.kicker}>WORKSPACE SUSPENDED</p><h1>Workspace access is paused.</h1><p>A platform administrator has suspended this workspace. Contact your administrator for review. Your profile and account notifications remain available.</p><Button asChild><Link to="/merchant/profile">View your profile</Link></Button></section>
              : ownerAccess ? <Suspense fallback={<p role="status">Loading your dashboard…</p>}><OwnerDashboard session={session} /></Suspense>
                : <section className={styles.locked}><span className={styles.lockIcon}><LockKeyhole size={28} aria-hidden="true" /></span><p className={styles.kicker}>PENDING INVITATION</p><h1>Your workspace is waiting.</h1><p>Your dashboard is locked until a Tenant Owner invites you to their workspace and you accept the invitation.</p><ol><li><span>1</span>Receive an invitation from your store owner</li><li><span>2</span>Review the workspace and your permissions</li><li><span>3</span>Accept to unlock your dashboard</li></ol><Button asChild><Link to="/merchant/notifications">Check invitations</Link></Button><p className={styles.lockedFoot}>You can still view your profile, check notifications and sign out.</p></section>}
      </main>
    </div>
  </div>
}
