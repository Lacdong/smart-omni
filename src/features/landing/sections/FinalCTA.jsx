import { AuthActions } from '../components/TrialButton'
import styles from './FinalCTA.module.css'

export function FinalCTA() {
  return <section className={styles.section} aria-labelledby="final-cta-title">
    <div className={styles.inner}><p className={styles.eyebrow}>A CLEARER WAY TO WORK</p><h2 id="final-cta-title">Run your multi-channel store with less friction.</h2><p>Bring your products, orders and inventory into one workspace.</p><AuthActions /></div>
  </section>
}
