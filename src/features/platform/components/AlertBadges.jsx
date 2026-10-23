import portal from '@/features/portal/PortalPage.module.css'
import styles from '../Platform.module.css'
import { alertStatuses, severities } from '../data/alertLabels'

export function AlertStatus({ status }) { return <span className={status === 'RESOLVED' ? portal.success : status === 'OPEN' ? portal.warning : portal.neutral}>{alertStatuses[status]}</span> }
export function Severity({ severity }) { return <span className={severity === 'CRITICAL' ? styles.criticalBadge : severity === 'WARNING' ? portal.warning : portal.neutral}>{severities[severity] || severity}</span> }
