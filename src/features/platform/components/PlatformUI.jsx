import { Link } from 'react-router-dom'
import portal from '@/features/portal/PortalPage.module.css'
import styles from '../Platform.module.css'

const statusLabels = { ACTIVE: 'Active', SUSPENDED: 'Suspended', ONBOARDING: 'Onboarding' }
export function TenantStatus({ status }) {
  return <span className={status === 'ACTIVE' ? portal.success : status === 'SUSPENDED' ? portal.warning : portal.neutral}>{statusLabels[status] || status}</span>
}
export function PageHeading({ eyebrow = 'PLATFORM ADMINISTRATION', title, description, action }) {
  return <div className={portal.headingRow}><div className={portal.pageHeading}><p>{eyebrow}</p><h1>{title}</h1><span>{description}</span></div>{action}</div>
}
export function TenantName({ tenant }) {
  return <div className={styles.tenantIdentity}><span className={styles.tenantAvatar}>{tenant.name.split(' ').slice(0, 2).map(word => word[0]).join('')}</span><div><Link className={styles.nameLink} to={`/admin/tenants/${tenant.id}`}>{tenant.name}</Link><span>{tenant.domain}</span></div></div>
}
export function EmptyResults({ onClear, label = 'No tenants match these filters.' }) {
  return <p className={styles.empty}>{label} <button onClick={onClear}>Clear filters</button></p>
}
