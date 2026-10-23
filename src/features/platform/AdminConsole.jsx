import { Route, Routes, Link } from 'react-router-dom'
import PlatformOverview from './PlatformOverview'
import TenantDirectory from './TenantDirectory'
import TenantDetail from './TenantDetail'
import PlanManagement from './PlanManagement'
import ActionLog from './ActionLog'
import AlertsPage from './AlertsPage'
import SecurityLog from './SecurityLog'
import { PageHeading } from './components/PlatformUI'

export default function AdminConsole() {
  return <Routes><Route index element={<PlatformOverview />} /><Route path="tenants" element={<TenantDirectory />} /><Route path="tenants/:tenantId" element={<TenantDetail />} /><Route path="plans" element={<PlanManagement />} /><Route path="audit" element={<ActionLog />} /><Route path="security" element={<SecurityLog />} /><Route path="shop-alerts" element={<AlertsPage kind="shop" />} /><Route path="shop-alerts/:alertId" element={<AlertsPage kind="shop" />} /><Route path="operations" element={<AlertsPage kind="operations" />} /><Route path="operations/:alertId" element={<AlertsPage kind="operations" />} /><Route path="*" element={<><PageHeading title="Page not found" description="This platform page does not exist." /><Link to="/admin">Back to platform overview</Link></>} /></Routes>
}
