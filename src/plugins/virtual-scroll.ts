import type { Plugin, PluginContext } from '../types'

export interface VirtualScrollOptions {
  enabled?: boolean
  gt?: number
  oSize?: number
  rHeight?: number
}

export const virtualScrollPlugin: Plugin = {
  name: 'virtual-scroll',
  options: {
    enabled: true,
    gt: 100,
    oSize: 5,
    rHeight: 40
  } as VirtualScrollOptions,

  beforeMountTable(context: PluginContext) {
    const options = this.options as VirtualScrollOptions

    if (!options.enabled) {
      return
    }

    ;(context as any).scrollY = {
      enabled: true,
      gt: options.gt,
      oSize: options.oSize,
      rHeight: options.rHeight
    }
  }
}

export function createVirtualScrollPlugin(options?: VirtualScrollOptions): Plugin {
  return {
    ...virtualScrollPlugin,
    options: { ...virtualScrollPlugin.options, ...options }
  }
}
