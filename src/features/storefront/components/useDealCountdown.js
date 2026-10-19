import { useEffect, useState } from 'react'

const duration = (3 * 3600 + 24 * 60 + 18) * 1000
const timerKey = 'smartomni:everyday-studio:demo-deal-end'

export function useDealCountdown() {
  const [end] = useState(() => {
    const fallback = Date.now() + duration
    try {
      const saved = Number(sessionStorage.getItem(timerKey))
      if (Number.isFinite(saved) && saved > 0) return saved
      sessionStorage.setItem(timerKey, String(fallback))
    } catch { /* Keep the preview timer working when storage is unavailable. */ }
    return fallback
  })
  const [remaining, setRemaining] = useState(() => Math.max(0, Math.ceil((end - Date.now()) / 1000)))
  useEffect(() => {
    const tick = () => setRemaining(Math.max(0, Math.ceil((end - Date.now()) / 1000)))
    const timer = window.setInterval(tick, 1000)
    const onVisibility = () => { if (!document.hidden) tick() }
    document.addEventListener('visibilitychange', onVisibility)
    return () => { window.clearInterval(timer); document.removeEventListener('visibilitychange', onVisibility) }
  }, [end])
  const time = [Math.floor(remaining / 3600), Math.floor(remaining / 60) % 60, remaining % 60].map(value => String(value).padStart(2, '0'))
  return { remaining, time }
}
