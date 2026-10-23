import { useSyncExternalStore } from 'react'
import { getPlatformSnapshot, subscribePlatform } from '../lib/platformStore'

export function usePlatform() { return useSyncExternalStore(subscribePlatform, getPlatformSnapshot, getPlatformSnapshot) }
