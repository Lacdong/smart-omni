import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { Menu, ArrowUpRight } from 'lucide-react'
import { Brand } from '@/shared/components/Brand'
import { Button } from '@/shared/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from '@/shared/ui/dialog'
import { TrialButton } from '../components/TrialButton'
import { navigation } from '../data/content'
import styles from './Header.module.css'

export function Header() {
  const [open, setOpen] = useState(false)
  const headerRef = useRef(null)
  const navRef = useRef(null)

  useEffect(() => {
    const sentinel = document.querySelector('[data-page-top]')
    const observer = new IntersectionObserver(([entry]) => {
      if (headerRef.current) headerRef.current.dataset.scrolled = String(!entry.isIntersecting)
    })
    if (sentinel) observer.observe(sentinel)
    // A desktop resize closes a mobile modal instead of leaving hidden navigation focused.
    const desktop = window.matchMedia('(min-width: 1100px)')
    const onDesktop = (event) => { if (event.matches) setOpen(false) }
    desktop.addEventListener('change', onDesktop)
    return () => { observer.disconnect(); desktop.removeEventListener('change', onDesktop) }
  }, [])

  useEffect(() => {
    const surface = navRef.current
    if (!surface || !window.matchMedia('(pointer: fine)').matches || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    let frame = 0
    const move = (event) => {
      const bounds = surface.getBoundingClientRect()
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(() => {
        surface.style.setProperty('--glint-x', `${((event.clientX - bounds.left) / bounds.width * 100).toFixed(1)}%`)
        surface.style.setProperty('--glint-y', `${((event.clientY - bounds.top) / bounds.height * 100).toFixed(1)}%`)
      })
    }
    const reset = () => {
      surface.style.removeProperty('--glint-x')
      surface.style.removeProperty('--glint-y')
    }
    surface.addEventListener('pointermove', move)
    surface.addEventListener('pointerleave', reset)
    return () => {
      cancelAnimationFrame(frame)
      surface.removeEventListener('pointermove', move)
      surface.removeEventListener('pointerleave', reset)
    }
  }, [])

  useEffect(() => {
    const surface = navRef.current
    if (!surface || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    let frame = 0
    const updateOptics = () => {
      frame = 0
      const travel = window.scrollY
      surface.style.setProperty('--scroll-glint-x', `${50 + Math.sin(travel / 180) * 35}%`)
    }
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(updateOptics)
    }
    updateOptics()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
      cancelAnimationFrame(frame)
    }
  }, [])

  return <header className={styles.header} ref={headerRef}>
    <svg className={styles.filterDefinitions} aria-hidden="true" focusable="false">
      <defs>
        <filter id="smartomni-glass-refraction" x="-10%" y="-20%" width="120%" height="140%">
          <feTurbulence type="fractalNoise" baseFrequency="0.008 0.035" numOctaves="1" seed="8" result="surface" />
          <feDisplacementMap in="SourceGraphic" in2="surface" scale="2" xChannelSelector="R" yChannelSelector="G" />
        </filter>
      </defs>
    </svg>
    <div className={styles.bar}>
      <Brand />
      <nav className={styles.glassNav} ref={navRef} data-gradient-rim="" aria-label="Main navigation">
        {navigation.map(({ label, href }) => <a key={href} href={href}>{label}</a>)}
      </nav>
      <div className={styles.auth}><Link to="/auth/login" className={styles.signIn}>Sign in</Link><TrialButton compact /></div>
      <Link to="/auth/login" className={styles.mobileTopSignIn}>Sign in</Link>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild><Button variant="ghost" size="icon" className={styles.menuTrigger} aria-label="Open menu"><Menu size={22} /></Button></DialogTrigger>
        <DialogContent className={styles.mobilePanel}>
          <DialogTitle><Brand linked={false} /></DialogTitle>
          <DialogDescription className="sr-only">Explore SmartOmni or access your account.</DialogDescription>
          <nav className={styles.mobileNav} aria-label="Mobile navigation">
            {navigation.map(({ label, href }) => <a key={href} href={href} onClick={() => setOpen(false)}>{label}<ArrowUpRight size={18} aria-hidden="true" /></a>)}
          </nav>
          <div className={styles.mobileAuth}><TrialButton onClick={() => setOpen(false)} /><Link to="/auth/login" onClick={() => setOpen(false)} className={styles.mobileSignIn}>Sign in</Link></div>
        </DialogContent>
      </Dialog>
    </div>
  </header>
}
