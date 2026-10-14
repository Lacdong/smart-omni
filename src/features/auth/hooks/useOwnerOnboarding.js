import { createContext, useContext } from 'react'

export const OwnerOnboardingContext = createContext(null)
export function useOwnerOnboarding() {
  const context = useContext(OwnerOnboardingContext)
  if (!context) throw new Error('Owner wizard context is unavailable.')
  return context
}
