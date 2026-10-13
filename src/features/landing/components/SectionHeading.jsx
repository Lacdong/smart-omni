import { cn } from '@/shared/lib/utils'
import styles from './SectionHeading.module.css'

export function SectionHeading({ id, eyebrow, title, description, align = 'center', className }) {
  return <div className={cn(styles.heading, align === 'left' && styles.left, className)}>
    {eyebrow && <p className={styles.eyebrow}>{eyebrow}</p>}
    <h2 id={id}>{title}</h2>
    {description && <p className={styles.description}>{description}</p>}
  </div>
}
