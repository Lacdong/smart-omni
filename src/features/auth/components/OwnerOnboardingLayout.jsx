import { useEffect, useReducer, useRef } from 'react'
import { ArrowLeft } from 'lucide-react'
import { Link, Navigate, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { Brand } from '@/shared/components/Brand'
import { Button } from '@/shared/ui/button'
import { ownerSteps, OWNER_BASE } from '../data/onboardingContent'
import { allowedStep, confirmedShops, createOwnerState, ownerReducer } from '../lib/ownerState'
import { OwnerOnboardingContext } from '../hooks/useOwnerOnboarding'
import { OnboardingStepper } from './OnboardingStepper'
import { PrototypeNotice } from './PrototypeNotice'
import styles from './OwnerOnboardingLayout.module.css'

export function OwnerOnboardingLayout() {
  const [state, dispatch] = useReducer(ownerReducer, undefined, createOwnerState)
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const content = useRef(null)
  const current = ownerSteps.findIndex(step => step.path === pathname.replace(/\/$/, ''))
  const allowed = allowedStep(state)
  useEffect(() => { content.current?.querySelector('h1')?.focus() }, [pathname])
  if (current > allowed) return <Navigate replace to={ownerSteps[allowed].path} />
  function reset() { dispatch({ type: 'RESET' }); navigate(OWNER_BASE, { replace: true }) }
  return <OwnerOnboardingContext.Provider value={{ state, dispatch, confirmedShops: confirmedShops(state) }}>
    <main id="main-content" className={styles.page} tabIndex={-1}>
      <header className={styles.header}><div><Brand /><span className={styles.context}>Owner setup</span></div><Button variant="ghost" onClick={reset} className={styles.restart}>Restart preview</Button></header>
      <OnboardingStepper current={Math.max(0, current)} allowed={allowed} />
      <div className={styles.content} ref={content}>
        <PrototypeNotice>No account, workspace, or live marketplace connection is created. Demo progress is temporary and resets on refresh or when you leave this wizard.</PrototypeNotice>
        <div className={styles.step} key={`${pathname}-${state.resetKey}`}><Outlet /></div>
      </div>
      <footer className={styles.footer}><Link to="/auth/register"><ArrowLeft size={16} aria-hidden="true" />Back to Account Type</Link><span>Products. Orders. Inventory. Together.</span></footer>
    </main>
  </OwnerOnboardingContext.Provider>
}
