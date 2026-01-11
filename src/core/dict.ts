import { ref, inject, provide, type InjectionKey } from 'vue'
import type { DictItem, DictConfig } from '../types'

export const DICT_PROVIDER_KEY: InjectionKey<DictProvider> = Symbol('dict-provider')

interface CachedDict {
  data: DictItem[]
  timestamp: number
}

export class DictProvider {
  private dictConfigs: Map<string, DictConfig> = new Map()
  private cache: Map<string, CachedDict> = new Map()

  register(configs: DictConfig[]) {
    configs.forEach((config) => {
      this.dictConfigs.set(config.code, config)
    })
  }

  async load(code: string): Promise<DictItem[]> {
    const config = this.dictConfigs.get(code)
    if (!config) {
      console.warn(`Dict config not found for code: ${code}`)
      return []
    }

    if (config.cache !== false) {
      const cached = this.cache.get(code)
      if (cached) {
        const expiry = config.expiry || 5 * 60 * 1000
        if (Date.now() - cached.timestamp < expiry) {
          return cached.data
        }
      }
    }

    if (!config.loader) {
      return []
    }

    const data = await config.loader()

    if (config.cache !== false) {
      this.cache.set(code, {
        data,
        timestamp: Date.now()
      })
    }

    return data
  }

  clear(code?: string) {
    if (code) {
      this.cache.delete(code)
    } else {
      this.cache.clear()
    }
  }
}

export function provideDictProvider(configs?: DictConfig[]): DictProvider {
  const provider = new DictProvider()
  if (configs) {
    provider.register(configs)
  }
  provide(DICT_PROVIDER_KEY, provider)
  return provider
}

export function useDictProvider(): DictProvider | undefined {
  return inject(DICT_PROVIDER_KEY, undefined)
}

export function useDict(code: string) {
  const provider = useDictProvider()
  const items = ref<DictItem[]>([])
  const loading = ref(false)

  const load = async () => {
    if (!provider) {
      console.warn('DictProvider not found')
      return
    }

    loading.value = true
    try {
      items.value = await provider.load(code)
    } catch (error) {
      console.error(`Failed to load dict: ${code}`, error)
      items.value = []
    } finally {
      loading.value = false
    }
  }

  const getLabel = (value: string | number): string => {
    const item = items.value.find((item) => item.value === value)
    return item?.label || String(value)
  }

  const getItem = (value: string | number): DictItem | undefined => {
    return items.value.find((item) => item.value === value)
  }

  return {
    items,
    loading,
    load,
    getLabel,
    getItem
  }
}
