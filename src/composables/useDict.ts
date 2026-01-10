import { ref, computed, InjectionKey, provide, inject } from 'vue'

/**
 * Dictionary item
 */
export interface DictItem {
  label: string
  value: any
  color?: string
  [key: string]: any
}

/**
 * Dictionary data structure
 */
export type DictData = Record<string, DictItem[]>

/**
 * Dictionary context
 */
export interface DictContext {
  // Dictionary data cache
  data: DictData
  // Load dictionary by code
  load: (code: string) => Promise<DictItem[]>
  // Get dictionary by code
  get: (code: string) => DictItem[]
  // Set dictionary data
  set: (code: string, items: DictItem[]) => void
  // Get label by value
  getLabel: (code: string, value: any) => string
  // Get item by value
  getItem: (code: string, value: any) => DictItem | undefined
}

/**
 * Dictionary context key
 */
export const DictContextKey: InjectionKey<DictContext> = Symbol('DictContext')

/**
 * Dictionary loader function type
 */
export type DictLoader = (code: string) => Promise<DictItem[]>

/**
 * Create dictionary context
 */
export function createDictContext(loader?: DictLoader): DictContext {
  const data = ref<DictData>({})
  const loadingCache = new Map<string, Promise<DictItem[]>>()

  const context: DictContext = {
    get data() {
      return data.value
    },

    async load(code: string): Promise<DictItem[]> {
      // Return cached data if available
      if (data.value[code]) {
        return data.value[code]
      }

      // Return loading promise if already loading
      if (loadingCache.has(code)) {
        return loadingCache.get(code)!
      }

      // Load dictionary data
      const loadPromise = (async () => {
        try {
          if (loader) {
            const items = await loader(code)
            data.value[code] = items
            return items
          } else {
            // Stub implementation - return empty array
            console.warn(`No dictionary loader provided for code: ${code}`)
            return []
          }
        } finally {
          loadingCache.delete(code)
        }
      })()

      loadingCache.set(code, loadPromise)
      return loadPromise
    },

    get(code: string): DictItem[] {
      return data.value[code] || []
    },

    set(code: string, items: DictItem[]) {
      data.value[code] = items
    },

    getLabel(code: string, value: any): string {
      const items = this.get(code)
      const item = items.find((item) => item.value === value)
      return item?.label || String(value)
    },

    getItem(code: string, value: any): DictItem | undefined {
      const items = this.get(code)
      return items.find((item) => item.value === value)
    },
  }

  return context
}

/**
 * Provide dictionary context
 */
export function provideDictContext(loader?: DictLoader) {
  const context = createDictContext(loader)
  provide(DictContextKey, context)
  return context
}

/**
 * Use dictionary hook
 */
export function useDict(code?: string) {
  const context = inject(DictContextKey)
  if (!context) {
    throw new Error(
      'Dictionary context not found. Make sure to wrap your component with DictProvider'
    )
  }

  if (code) {
    // Auto-load dictionary if code provided
    context.load(code)
  }

  return {
    // Dictionary data for specific code
    dict: computed(() => (code ? context.get(code) : [])),
    // Get label by value
    getLabel: (value: any) => (code ? context.getLabel(code, value) : String(value)),
    // Get item by value
    getItem: (value: any) => (code ? context.getItem(code, value) : undefined),
    // Load dictionary
    load: context.load,
    // Full context for advanced usage
    context,
  }
}
