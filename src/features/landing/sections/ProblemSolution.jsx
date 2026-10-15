import { Boxes, ClipboardList, Layers3 } from 'lucide-react'
import { SectionHeading } from '../components/SectionHeading'
import styles from './ProblemSolution.module.css'

const pairs = [
  { icon: Layers3, problem: 'Product information lives in too many places.', solution: 'Keep your catalog, SKUs and channel listings connected in one view.' },
  { icon: ClipboardList, problem: 'Orders arrive from different shops.', solution: 'See marketplace orders together with the status that matters next.' },
  { icon: Boxes, problem: 'Stock gets harder to see clearly.', solution: 'Review inventory and sync information alongside each product.' },
]

export function ProblemSolution() {
  return <section className={styles.section} aria-labelledby="problem-title">
    <div className={styles.inner}>
      <SectionHeading id="problem-title" eyebrow="THE EVERYDAY CHALLENGE" title="When every sales channel becomes another place to check." description="SmartOmni brings the moving parts of your store into a clearer workspace." />
      <div className={styles.grid}>
        {pairs.map(({ icon: Icon, problem, solution }) => <article className={styles.card} key={problem}>
          <span className={styles.icon}><Icon size={23} strokeWidth={1.55} aria-hidden="true" /></span>
          <p className={styles.problem}>{problem}</p>
          <p className={styles.solution}>{solution}</p>
        </article>)}
      </div>
    </div>
  </section>
}
