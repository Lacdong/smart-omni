import { useEffect, useRef } from 'react'
import styles from './HeroConnection.module.css'

// Render the hand silhouette as flat monochrome dots, without the source's
// skin tones or metallic surfaces. CSS animates the resulting layer.
function PixelHand({ mirrored = false }) {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const image = new Image()
    let active = true
    const draw = () => {
      if (!active || !image.naturalWidth) return
      const width = Math.round(canvas.getBoundingClientRect().width)
      if (!width) return
      const height = Math.round(width / 2)
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      canvas.width = Math.round(width * dpr)
      canvas.height = Math.round(height * dpr)
      const ctx = canvas.getContext('2d')
      const step = width < 350 ? 4.5 : 6
      const columns = Math.ceil(width / step)
      const rows = Math.ceil(height / step)
      const sample = document.createElement('canvas')
      sample.width = columns
      sample.height = rows
      const sampleCtx = sample.getContext('2d', { willReadFrequently: true })
      sampleCtx.imageSmoothingQuality = 'high'
      if (mirrored) {
        sampleCtx.translate(columns, 0)
        sampleCtx.scale(-1, 1)
      }
      sampleCtx.drawImage(image, 0, 0, columns, rows)
      const { data } = sampleCtx.getImageData(0, 0, columns, rows)
      ctx.scale(dpr, dpr)
      ctx.fillStyle = '#171717'
      for (let row = 0; row < rows; row += 1) {
        for (let column = 0; column < columns; column += 1) {
          const x = (column + .5) * step
          const y = (row + .5) * step
          const offset = (row * columns + column) * 4
          const alpha = data[offset + 3] / 255
          if (alpha < .25) continue
          const luminance = (data[offset] * .2126 + data[offset + 1] * .7152 + data[offset + 2] * .0722) / 255
          const radius = step * (.12 + .32 * Math.pow(1 - luminance, .65)) * Math.sqrt(alpha)
          ctx.globalAlpha = .98
          ctx.beginPath()
          ctx.arc(x, y, radius, 0, Math.PI * 2)
          ctx.fill()
        }
      }
    }
    image.onload = draw
    image.src = '/images/hero/human-hand.png'
    const resize = new ResizeObserver(draw)
    resize.observe(canvas)
    return () => { active = false; image.onload = null; resize.disconnect() }
  }, [mirrored])

  return <canvas ref={canvasRef} />
}

export function HeroConnection() {
  return <div className={styles.scene} aria-hidden="true">
    <div className={`${styles.hand} ${styles.left}`}><PixelHand mirrored /></div>
    <div className={`${styles.hand} ${styles.right}`}><PixelHand /></div>
  </div>
}
