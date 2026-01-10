import type { Plugin, PluginContext } from '../types'

export { Plugin, PluginContext }

export function definePlugin(plugin: Plugin): Plugin {
  return plugin
}

export async function runPlugins(
  plugins: Plugin[],
  hookName: string,
  context: PluginContext,
  ...args: any[]
) {
  for (const plugin of plugins) {
    const hook = plugin[hookName]
    if (typeof hook === 'function') {
      await hook.call(plugin, context, ...args)
    }
  }
}

export function createPluginContext(base: Partial<PluginContext> = {}): PluginContext {
  return {
    dataSource: base.dataSource,
    searchSchema: base.searchSchema || [],
    tableSchema: base.tableSchema || [],
    formSchema: base.formSchema || [],
    actions: base.actions || [],
    pageKey: base.pageKey,
    ...base
  }
}
