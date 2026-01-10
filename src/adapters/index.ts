import { IUiAdapter, AdapterRegistry } from '@/types/adapter'
import { elementPlusAdapter } from './element-plus'

// Global adapter registry
const adapterRegistry: AdapterRegistry = new Map()

// Register default adapter
adapterRegistry.set('element-plus', elementPlusAdapter)

// Current active adapter
let currentAdapter: IUiAdapter = elementPlusAdapter

/**
 * Register a UI adapter
 */
export function registerAdapter(adapter: IUiAdapter) {
  adapterRegistry.set(adapter.name, adapter)
}

/**
 * Get an adapter by name
 */
export function getAdapter(name: string): IUiAdapter | undefined {
  return adapterRegistry.get(name)
}

/**
 * Set the current active adapter
 */
export function setCurrentAdapter(name: string) {
  const adapter = adapterRegistry.get(name)
  if (adapter) {
    currentAdapter = adapter
  } else {
    throw new Error(`Adapter '${name}' not found`)
  }
}

/**
 * Get the current active adapter
 */
export function useAdapter(): IUiAdapter {
  return currentAdapter
}

export { elementPlusAdapter }
