import { inject, provide, type InjectionKey } from 'vue'
import type {
  CrudProviderOptions,
  Plugin,
  PluginContext,
  LifecycleHooks,
  UIAdapter
} from '../types'

export const CRUD_PROVIDER_KEY: InjectionKey<CrudProvider> = Symbol('crud-provider')

export class CrudProvider {
  private plugins: Plugin[] = []
  private lifecycleHooks: Map<string, Set<(...args: any[]) => void | Promise<void>>> = new Map()
  public uiAdapter?: UIAdapter

  constructor(options?: CrudProviderOptions) {
    if (options?.uiAdapter) {
      this.uiAdapter = options.uiAdapter
    }
    if (options?.plugins) {
      options.plugins.forEach((plugin) => this.use(plugin))
    }
  }

  use(plugin: Plugin) {
    this.plugins.push(plugin)
    return this
  }

  async install(context: PluginContext) {
    for (const plugin of this.plugins) {
      if (plugin.install) {
        await plugin.install(context)
      }
    }
  }

  async runPluginHook(hookName: string, context: PluginContext, ...args: any[]) {
    for (const plugin of this.plugins) {
      const hook = plugin[hookName]
      if (typeof hook === 'function') {
        await hook.call(plugin, context, ...args)
      }
    }
  }

  on(event: string, handler: (...args: any[]) => void | Promise<void>) {
    if (!this.lifecycleHooks.has(event)) {
      this.lifecycleHooks.set(event, new Set())
    }
    this.lifecycleHooks.get(event)!.add(handler)
  }

  off(event: string, handler: (...args: any[]) => void | Promise<void>) {
    const handlers = this.lifecycleHooks.get(event)
    if (handlers) {
      handlers.delete(handler)
    }
  }

  async emit(event: string, ...args: any[]) {
    const handlers = this.lifecycleHooks.get(event)
    if (handlers) {
      for (const handler of handlers) {
        await handler(...args)
      }
    }
  }

  getPlugins(): Plugin[] {
    return this.plugins
  }
}

export function provideCrudProvider(options?: CrudProviderOptions): CrudProvider {
  const provider = new CrudProvider(options)
  provide(CRUD_PROVIDER_KEY, provider)
  return provider
}

export function useCrudProvider(): CrudProvider | undefined {
  return inject(CRUD_PROVIDER_KEY, undefined)
}

export function createLifecycleHooks(provider?: CrudProvider): LifecycleHooks {
  if (!provider) return {}

  return {
    beforeSearch: async (...args: any[]) => await provider.emit('beforeSearch', ...args),
    afterSearch: async (...args: any[]) => await provider.emit('afterSearch', ...args),
    beforeSave: async (...args: any[]) => await provider.emit('beforeSave', ...args),
    afterSave: async (...args: any[]) => await provider.emit('afterSave', ...args),
    beforeRemove: async (...args: any[]) => await provider.emit('beforeRemove', ...args),
    afterRemove: async (...args: any[]) => await provider.emit('afterRemove', ...args),
    beforeExport: async (...args: any[]) => await provider.emit('beforeExport', ...args),
    afterExport: async (...args: any[]) => await provider.emit('afterExport', ...args),
    beforeImport: async (...args: any[]) => await provider.emit('beforeImport', ...args),
    afterImport: async (...args: any[]) => await provider.emit('afterImport', ...args)
  }
}
