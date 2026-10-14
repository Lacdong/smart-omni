import styles from './OwnerStep.module.css'

export function OwnerStep({ title, description, children, eyebrow }) {
  return <>
    <div className={styles.intro}>{eyebrow && <p className={styles.eyebrow}>{eyebrow}</p>}
      <h1 tabIndex={-1}>{title}</h1><p>{description}</p>
    </div>
    {children}
  </>
}
