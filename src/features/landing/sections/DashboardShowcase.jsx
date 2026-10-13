import { useState } from 'react'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import { DashboardPreview } from '../components/DashboardPreview'
import { SectionHeading } from '../components/SectionHeading'
import { previewDescriptions } from '../data/content'
import styles from './DashboardShowcase.module.css'

const previewModes = ['products', 'orders', 'inventory']

export function DashboardShowcase() {
  const [activeIndex, setActiveIndex] = useState(0)

  return <section className={styles.section} aria-labelledby="showcase-title">
    <div className={styles.inner}>
      <SectionHeading id="showcase-title" eyebrow="INSIDE THE WORKSPACE" title="See the work more clearly." description="Explore a sample view of the information merchants use every day." />

      <p className={styles.description}>{previewDescriptions[previewModes[activeIndex]]}</p>
      <div className={styles.carousel} role="group" aria-label="Dashboard previews">
        <div className={styles.viewport}>
          <div className={styles.track} style={{ transform: `translate3d(-${activeIndex * 100}%, 0, 0)` }}>
            {previewModes.map((mode, index) => <div
              key={mode}
              className={styles.slide}
              role="group"
              aria-roledescription="slide"
              aria-label={`${mode[0].toUpperCase()}${mode.slice(1)} preview, ${index + 1} of ${previewModes.length}`}
              aria-hidden={index !== activeIndex}
              inert={index !== activeIndex}
            >
              <DashboardPreview mode={mode} />
            </div>)}
          </div>
        </div>
        <div className={styles.controls}>
          <button
            type="button"
            className={styles.arrow}
            aria-label="Previous preview"
            title="Previous preview"
            disabled={activeIndex === 0}
            onClick={() => setActiveIndex(index => index - 1)}
          >
            <ArrowLeft size={19} strokeWidth={1.7} aria-hidden="true" />
          </button>
          <button
            type="button"
            className={styles.arrow}
            aria-label="Next preview"
            title="Next preview"
            disabled={activeIndex === previewModes.length - 1}
            onClick={() => setActiveIndex(index => index + 1)}
          >
            <ArrowRight size={19} strokeWidth={1.7} aria-hidden="true" />
          </button>
        </div>
        <span className={styles.counter} aria-live="polite" aria-atomic="true">
          Preview {String(activeIndex + 1).padStart(2, '0')} / {String(previewModes.length).padStart(2, '0')}
        </span>
      </div>
    </div>
  </section>
}
