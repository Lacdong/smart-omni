import { useEffect, useRef } from 'react'
import styles from './CatalogBanner.module.css'

const TAU = Math.PI * 2
// Warped latitude contours on a sphere, projected and depth-shaded in 3D.
const contours = Array.from({ length: 58 }, (_, ring) => Array.from({ length: 145 }, (_, step) => {
  const longitude = step / 144 * TAU
  const latitude = -1.48 + ring / 57 * 2.96
  const warped = latitude + Math.cos(latitude) * (.14 * Math.sin(longitude * 3 + latitude * 2) + .07 * Math.sin(longitude * 5 - latitude * 3))
  return [Math.cos(warped) * Math.cos(longitude), Math.sin(warped), Math.cos(warped) * Math.sin(longitude)]
}))
const sparks = Array.from({ length: 40 }, (_, index) => {
  const y = 1 - (index + .5) / 40 * 2
  const longitude = index * 2.399963
  return [Math.sqrt(1 - y * y) * Math.cos(longitude), y, Math.sqrt(1 - y * y) * Math.sin(longitude)]
})

export function CatalogBanner() {
  const canvasRef = useRef(null)
  const phase = useRef(0)

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    let width = 0, height = 0, frame = 0, lastTime = 0, visible = true
    let pointerX = 0, pointerY = 0, tiltX = 0, tiltY = 0
    const project = ([x, y, z], scale = 1) => {
      const rotation = phase.current * .17 + tiltX
      const rx = x * Math.cos(rotation) + z * Math.sin(rotation)
      const rz = -x * Math.sin(rotation) + z * Math.cos(rotation)
      const angle = .48 + tiltY
      const ry = y * Math.cos(angle) - rz * Math.sin(angle)
      const depth = y * Math.sin(angle) + rz * Math.cos(angle)
      const radius = Math.min(width, height) * .3 * scale
      const perspective = 1 + depth * .1
      return [width / 2 + (rx * .95 - ry * .3) * radius * perspective, height / 2 + (rx * .3 + ry * .95) * radius * perspective, depth]
    }
    function draw() {
      ctx.clearRect(0, 0, width, height)
      tiltX += (pointerX - tiltX) * .035
      tiltY += (pointerY - tiltY) * .035
      // Fine radial antennas and scattered lights around the silhouette.
      sparks.forEach((point, index) => {
        const a = project(point, 1.04)
        const b = project(point, 1.15 + (index % 5) * .09)
        ctx.beginPath(); ctx.moveTo(a[0], a[1]); ctx.lineTo(b[0], b[1])
        ctx.strokeStyle = `rgba(160,174,198,${.035 + (a[2] + 1) * .035})`; ctx.lineWidth = .65; ctx.stroke()
        ctx.beginPath(); ctx.arc(a[0], a[1], index % 4 === 0 ? 1.4 : .7, 0, TAU)
        ctx.fillStyle = index % 5 === 0 ? '#76c9cd' : 'rgba(202,207,222,.45)'; ctx.fill()
      })
      contours.forEach((points, index) => {
        const colour = index % 7 === 0 ? '111,151,207' : index % 9 === 0 ? '156,135,182' : '177,180,196'
        for (let step = 1; step < points.length; step++) {
          const a = project(points[step - 1]), b = project(points[step])
          ctx.beginPath(); ctx.moveTo(a[0], a[1]); ctx.lineTo(b[0], b[1])
          ctx.lineWidth = index % 7 === 0 ? .85 : .65
          ctx.strokeStyle = `rgba(${colour},${b[2] > 0 ? .24 + b[2] * .36 : .035})`; ctx.stroke()
        }
        if (index % 3 === 0) {
          const point = points[Math.floor((phase.current * 5 + index * 13) % 144)]
          const p = project(point, 1.007)
          if (p[2] > -.1) {
            ctx.beginPath(); ctx.arc(p[0], p[1], index % 2 === 0 ? 1.7 : 1, 0, TAU)
            ctx.fillStyle = index % 4 === 0 ? '#9ce8e5' : '#ddd9f3'; ctx.shadowBlur = 7; ctx.shadowColor = '#7fbfcf'; ctx.fill(); ctx.shadowBlur = 0
          }
        }
      })
    }
    function tick(time) {
      if (time - lastTime >= 1000 / 30) {
        phase.current += lastTime ? Math.min((time - lastTime) / 1000, .05) : 0
        lastTime = time
        draw()
      }
      frame = requestAnimationFrame(tick)
    }
    function sync() {
      cancelAnimationFrame(frame)
      lastTime = 0
      draw()
      if (visible && !document.hidden) frame = requestAnimationFrame(tick)
    }
    const resize = new ResizeObserver(([entry]) => {
      width = entry.contentRect.width; height = entry.contentRect.height
      const ratio = Math.min(window.devicePixelRatio || 1, 2)
      canvas.width = Math.round(width * ratio); canvas.height = Math.round(height * ratio)
      ctx.setTransform(ratio, 0, 0, ratio, 0, 0)
      draw()
    })
    resize.observe(canvas)
    const observer = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; sync() })
    observer.observe(canvas)
    const move = event => {
      const bounds = canvas.getBoundingClientRect()
      pointerX = (event.clientX - bounds.left - bounds.width / 2) / bounds.width * .65
      pointerY = (event.clientY - bounds.top - bounds.height / 2) / bounds.height * .4
    }
    const reset = () => { pointerX = 0; pointerY = 0 }
    document.addEventListener('visibilitychange', sync)
    canvas.addEventListener('pointermove', move)
    canvas.addEventListener('pointerleave', reset)
    sync()
    return () => { cancelAnimationFrame(frame); resize.disconnect(); observer.disconnect(); document.removeEventListener('visibilitychange', sync); canvas.removeEventListener('pointermove', move); canvas.removeEventListener('pointerleave', reset) }
  }, [])

  return <section className={styles.banner} aria-labelledby="collection-title">
    <div className={styles.copy}><p>THE EVERYDAY EDIT</p><h1 id="collection-title">LESS, BUT{' '}<br />BETTER.</h1><span>Thoughtful things for the way you live.<br />Your favourites, on your preferred marketplace.</span></div>
    <div className={styles.scene}><canvas ref={canvasRef} role="img" aria-label="Rotating three-dimensional sphere traced with luminous contours and moving particles" /></div>
  </section>
}
