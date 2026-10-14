import { CheckCircle2, Circle } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { Button } from '@/shared/ui/button'
import { OwnerStep } from '../components/OwnerStep'
import { useOwnerOnboarding } from '../hooks/useOwnerOnboarding'
import { marketplaces } from '../data/onboardingContent'
import stepStyles from '../components/OwnerStep.module.css'
import styles from './ConfigureChannels.module.css'

export function ConfigureChannels() {
  const { state, dispatch, confirmedShops } = useOwnerOnboarding()
  const navigate = useNavigate()
  const freeOccupied = state.selectedPlan === 'Free' && state.connections.length >= 1
  return <OwnerStep title="Connect your sales channels." description="Bring your existing shops into one SmartOmni workspace." eyebrow="TENANT OWNER · STEP 03">
    <div className={styles.context}><span className={stepStyles.badge}>{state.selectedPlan} plan · demo selection</span><p>{state.selectedPlan === 'Free' ? 'Up to 1 shop across all marketplaces. Remove the current demo shop to preview another.' : 'This demo offers one sample shop per marketplace. Production Pro limits are TBD.'}</p></div>
    <div className={stepStyles.twoColumns}>
      {marketplaces.map(marketplace => {
        const shop = state.connections.find(connection => connection.marketplace === marketplace.key)
        const confirmed = shop?.status === 'CONFIRMED'
        return <section className={stepStyles.card} key={marketplace.key} aria-labelledby={`channel-${marketplace.key}`}>
          <div className={styles.channelHeader}><span className={`${styles.mark} ${styles[marketplace.key]}`} aria-hidden="true">{marketplace.mark}</span><div><h2 id={`channel-${marketplace.key}`}>{marketplace.name}</h2><p>Marketplace connection preview</p></div></div>
          <p className={styles.description}>{marketplace.description}</p>
          <div className={`${styles.status} ${confirmed ? styles.confirmed : ''}`} role="status" aria-live="polite">
            {confirmed ? <CheckCircle2 size={16} aria-hidden="true" /> : <Circle size={16} aria-hidden="true" />}
            <span>{confirmed ? 'Confirmed · demo only' : shop ? 'Awaiting confirmation · demo' : 'Not connected'}</span>
          </div>
          {shop ? <>
            <div className={styles.shop}><strong>{shop.name}</strong><p>Sample fixture. No real shop identity or ownership has been verified.</p></div>
            {!confirmed && <Button variant="outline" className={styles.action} aria-label={`Confirm ${marketplace.name} demo shop`} onClick={() => dispatch({ type: 'CONFIRM_SHOP', marketplace: marketplace.key })}>Confirm demo shop</Button>}
            <Button variant="ghost" className={styles.action} onClick={() => dispatch({ type: 'REMOVE_SHOP', marketplace: marketplace.key })}>Remove {marketplace.name} demo shop</Button>
          </> : <>
            <Button variant="outline" className={styles.action} disabled={freeOccupied} onClick={() => dispatch({ type: 'BEGIN_SHOP', marketplace: marketplace.key })}>Connect {marketplace.name} (demo)</Button>
            {freeOccupied && <p className={stepStyles.note}>Free's one-shop allowance is already used in this preview.</p>}
          </>}
        </section>
      })}
    </div>
    <p className={stepStyles.note}>Connection preview and shop confirmation are separate actions. At least one confirmed demo shop is required to continue. Changing shops resets the import preview.</p>
    <div className={stepStyles.actions}><Button asChild variant="outline"><Link to="/auth/register/owner/plan">Back</Link></Button><Button disabled={!confirmedShops.length} onClick={() => navigate('/auth/register/owner/import')}>Continue to Import</Button></div>
  </OwnerStep>
}
