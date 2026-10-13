import { useEffect, useRef } from 'react'
import styles from './HeroRibbon.module.css'

const SEGMENTS = 180

function ribbonPoint(t, s, phase) {
  const twist = .28 + 1.5 * Math.sin(t * 2.15 + phase)
  const width = 49 + 25 * Math.sin(t) + 12 * Math.sin(t * 1.3 + phase)
  const wave = 17 * Math.sin(t * 3.4 - phase * .8)
  const spread = s * width * Math.cos(twist)

  return {
    x: (630 + spread) * Math.cos(t) + wave,
    y: (475 + spread) * Math.sin(t) + 10 * Math.sin(t * 2 + phase),
    z: s * width * Math.sin(twist) + 48 * Math.sin(t * 2.7 + phase),
  }
}

function project(point, width, height) {
  const depth = 900 / (900 - point.z)
  return {
    x: width * (700 + point.x * depth) / 1400,
    y: height * (575 - point.y * depth) / 650,
  }
}

function drawRibbon(ctx, width, height, phase) {
  ctx.clearRect(0, 0, width, height)

  const gradient = alpha => {
    const fill = ctx.createLinearGradient(0, 0, width, 0)
    fill.addColorStop(0, `rgba(199, 45, 235, ${alpha})`)
    fill.addColorStop(.22, `rgba(35, 208, 231, ${alpha})`)
    fill.addColorStop(.45, `rgba(105, 62, 241, ${alpha})`)
    fill.addColorStop(.68, `rgba(252, 75, 127, ${alpha})`)
    fill.addColorStop(.84, `rgba(249, 120, 48, ${alpha})`)
    fill.addColorStop(1, `rgba(112, 51, 235, ${alpha})`)
    return fill
  }

  const fillBand = (from, to, fill) => {
    ctx.beginPath()
    for (let i = 0; i <= SEGMENTS; i += 1) {
      const point = project(ribbonPoint(Math.PI * i / SEGMENTS, from, phase), width, height)
      if (i === 0) ctx.moveTo(point.x, point.y)
      else ctx.lineTo(point.x, point.y)
    }
    for (let i = SEGMENTS; i >= 0; i -= 1) {
      const point = project(ribbonPoint(Math.PI * i / SEGMENTS, to, phase), width, height)
      ctx.lineTo(point.x, point.y)
    }
    ctx.closePath()
    ctx.fillStyle = fill
    ctx.fill()
  }

  fillBand(-1, 1, gradient(.18))
  fillBand(-1, -.68, gradient(.38))
  fillBand(.66, 1, gradient(.24))
  fillBand(-.42, -.27, 'rgba(255, 255, 255, .31)')

  for (const [s, lineWidth, alpha] of [[-1, 2.2, .75], [-.7, 1.4, .65], [.98, 1.8, .58]]) {
    ctx.beginPath()
    for (let i = 0; i <= SEGMENTS; i += 1) {
      const point = project(ribbonPoint(Math.PI * i / SEGMENTS, s, phase), width, height)
      if (i === 0) ctx.moveTo(point.x, point.y)
      else ctx.lineTo(point.x, point.y)
    }
    ctx.strokeStyle = gradient(alpha)
    ctx.lineWidth = lineWidth * width / 1400
    ctx.shadowColor = 'rgba(125, 92, 220, .32)'
    ctx.shadowBlur = 11 * width / 1400
    ctx.stroke()
  }
  ctx.shadowBlur = 0
}

export function HeroRibbon() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d', { alpha: true })
    if (!canvas || !ctx) return

    const motion = window.matchMedia('(prefers-reduced-motion: reduce)')
    let frame = 0
    let lastDraw = 0
    let visible = true

    const render = time => {
      const rect = canvas.getBoundingClientRect()
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5)
      const width = Math.round(rect.width * dpr)
      const height = Math.round(rect.height * dpr)
      if (!width || !height) return
      if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width
        canvas.height = height
      }
      drawRibbon(ctx, width, height, motion.matches ? .65 : time * .00032)
    }

    const tick = time => {
      if (!visible || motion.matches || document.hidden) return
      if (time - lastDraw >= 32) {
        render(time)
        lastDraw = time
      }
      frame = requestAnimationFrame(tick)
    }

    const start = () => {
      cancelAnimationFrame(frame)
      render(performance.now())
      if (visible && !motion.matches && !document.hidden) frame = requestAnimationFrame(tick)
    }

    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting
      if (visible) start()
      else cancelAnimationFrame(frame)
    })
    observer.observe(canvas)
    const resize = new ResizeObserver(start)
    resize.observe(canvas)
    motion.addEventListener('change', start)
    document.addEventListener('visibilitychange', start)
    start()

    return () => {
      cancelAnimationFrame(frame)
      observer.disconnect()
      resize.disconnect()
      motion.removeEventListener('change', start)
      document.removeEventListener('visibilitychange', start)
    }
  }, [])

  return <div className={styles.ribbon} aria-hidden="true"><canvas ref={canvasRef} /></div>
}
