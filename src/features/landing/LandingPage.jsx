import { Header } from './sections/Header'
import { Hero } from './sections/Hero'
import { ProblemSolution } from './sections/ProblemSolution'
import { Features } from './sections/Features'
import { HowItWorks } from './sections/HowItWorks'
import { Integrations } from './sections/Integrations'
import { OfferComparison } from './sections/OfferComparison'
import { DashboardShowcase } from './sections/DashboardShowcase'
import { PricingTeaser } from './sections/PricingTeaser'
import { FinalCTA } from './sections/FinalCTA'
import { Footer } from './sections/Footer'
import { StorefrontLauncher } from './components/StorefrontLauncher'
import styles from './LandingPage.module.css'

export function LandingPage() {
  return <div className={styles.page}>
    <Header />
    <main id="main-content" tabIndex={-1}>
      <Hero />
      <ProblemSolution />
      <Features />
      <HowItWorks />
      <Integrations />
      <OfferComparison />
      <DashboardShowcase />
      <PricingTeaser />
      <FinalCTA />
    </main>
    <Footer />
    <StorefrontLauncher />
  </div>
}
