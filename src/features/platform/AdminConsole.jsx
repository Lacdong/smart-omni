import { Route, Routes, Link } from 'react-router-dom'
import PlatformOverview from './PlatformOverview'
import TenantDirectory from './TenantDirectory'
import TenantDetail from './TenantDetail'
import PlanManagement from './PlanManagement'
import ActionLog from './ActionLog'
import { PageHeading } from './components/PlatformUI'

export default function AdminConsole() {
  return <Routes><Route index element={<PlatformOverview />} /><Route path="tenants" element={<TenantDirectory />} /><Route path="tenants/:tenantId" element={<TenantDetail />} /><Route path="plans" element={<PlanManagement />} /><Route path="audit" element={<ActionLog />} /><Route path="*" element={<><PageHeading title="Page not found" description="This platform page does not exist." /><Link to="/admin">Back to platform overview</Link></>} /></Routes>
}
