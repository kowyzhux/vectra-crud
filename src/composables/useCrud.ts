import { inject, provide, reactive } from 'vue'
import { CrudContext, CrudContextKey, CrudConfig } from '@/types/context'
import { CrudPlugin } from '@/types/plugin'
import { CrudHooks } from '@/types/hooks'

/**
 * Create CRUD context
 */
export function createCrudContext(config: CrudConfig = {}): CrudContext {
  const plugins = new Map<string, CrudPlugin>()

  const context: CrudContext = reactive({
    config,
    plugins,

    registerPlugin(plugin: CrudPlugin) {
      if (plugins.has(plugin.name)) {
        console.warn(`Plugin '${plugin.name}' already registered`)
        return
      }
      plugins.set(plugin.name, plugin)
      // Call plugin install method if available
      if (plugin.install) {
        plugin.install(context)
      }
    },

    getPlugin(name: string) {
      return plugins.get(name)
    },

    async executeHook(hookName: keyof CrudHooks, ...args: any[]): Promise<any> {
      const hook = config.hooks?.[hookName]
      let result
      if (hook) {
        result = await (hook as any)(...args)
      }
      // Execute plugin hooks
      for (const plugin of plugins.values()) {
        const pluginHook = (plugin as any)[hookName]
        if (pluginHook) {
          const pluginResult = await pluginHook(...args)
          if (result === undefined) {
            result = pluginResult
          }
        }
      }
      return result
    },
  }) as CrudContext

  // Register initial plugins
  if (config.plugins) {
    config.plugins.forEach((plugin) => context.registerPlugin(plugin))
  }

  return context
}

/**
 * Provide CRUD context
 */
export function provideCrudContext(config: CrudConfig = {}) {
  const context = createCrudContext(config)
  provide(CrudContextKey, context)
  return context
}

/**
 * Use CRUD context
 */
export function useCrudContext(): CrudContext {
  const context = inject(CrudContextKey)
  if (!context) {
    throw new Error('CRUD context not found. Make sure to wrap your component with CrudProvider')
  }
  return context
}
