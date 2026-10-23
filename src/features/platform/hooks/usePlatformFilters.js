import { useEffect, useRef } from 'react'
import { useSearchParams } from 'react-router-dom'

export function usePlatformFilters() {
  const [params, setParams] = useSearchParams()
  const pending = useRef(params)
  useEffect(() => { pending.current = params }, [params])
  function filter(key, value) {
    // Router navigations are asynchronous: consecutive controls must use the latest
    // requested filters, rather than restoring a search from the previous render.
    const next = new URLSearchParams(pending.current)
    if (!value || value === 'all') next.delete(key)
    else next.set(key, value)
    pending.current = next
    setParams(next, { replace: true })
  }
  function clear() {
    const next = new URLSearchParams()
    pending.current = next
    setParams(next, { replace: true })
  }
  return { params, filter, clear }
}
