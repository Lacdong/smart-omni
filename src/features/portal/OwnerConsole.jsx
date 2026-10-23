import { useLocation } from 'react-router-dom'
import { ownerScreens } from './data/ownerNavigation'
import { useOwnerWorkspace } from './lib/ownerWorkspaceStore'
import { OwnerTabs } from './components/OwnerWorkspaceUI'
import BillingWorkspace from './BillingWorkspace'
import ShopWorkspace from './ShopWorkspace'
import LoyaltyWorkspace from './LoyaltyWorkspace'
import PlanningWorkspace from './PlanningWorkspace'
import FinanceWorkspace from './FinanceWorkspace'
import AdvisorWorkspace from './AdvisorWorkspace'
import OwnerLogs from './OwnerLogs'
import styles from './OwnerWorkspace.module.css'

const groups = [['subscription', 'invoices', 'payments'], ['shops', 'shop-alerts'], ['customers', 'vouchers', 'voucher-results'], ['sales-events', 'forecasts'], ['costs', 'profit'], ['advisor', 'strategy'], ['logs']]
export default function OwnerConsole() {
  const { pathname } = useLocation()
  const screen = pathname.split('/').at(-1)
  const workspace = useOwnerWorkspace()
  const group = groups.find(items => items.includes(screen)) || []
  const title = ownerScreens.find(([id]) => id === screen)?.[1]
  const Component = groups[0].includes(screen) ? BillingWorkspace : groups[1].includes(screen) ? ShopWorkspace : groups[2].includes(screen) ? LoyaltyWorkspace : groups[3].includes(screen) ? PlanningWorkspace : groups[4].includes(screen) ? FinanceWorkspace : groups[5].includes(screen) ? AdvisorWorkspace : OwnerLogs
  return <div className={styles.page}><div className={styles.heading}><h1>{title}</h1><p>Everyday Studio · Tenant Owner workspace</p></div>{group.length > 1 && <OwnerTabs items={ownerScreens.filter(([id]) => group.includes(id))} selected={screen} />}<Component key={screen} screen={screen} {...workspace} /><p className={styles.note}>Frontend demo · sample data and local browser storage · no live payment, marketplace, messaging or AI services.</p></div>
}
