import { useSyncExternalStore } from 'react'
import { getDemoSession, subscribeDemoSession } from '../lib/demoSession'

export function useDemoSession() {
  return useSyncExternalStore(subscribeDemoSession, getDemoSession, () => null)
}
