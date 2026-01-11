import type { Plugin, PluginContext } from '../types'

export interface RowExpandOptions {
  visibleMethod?: (row: any) => boolean
  expandRowKeys?: string[]
  accordion?: boolean
}

export const rowExpandPlugin: Plugin = {
  name: 'row-expand',
  options: {
    accordion: false
  } as RowExpandOptions,

  beforeMountTable(context: PluginContext) {
    const options = this.options as RowExpandOptions

    ;(context as any).expandConfig = {
      visibleMethod: options.visibleMethod,
      expandRowKeys: options.expandRowKeys,
      accordion: options.accordion
    }

    ;(context as any).showExpand = true
  }
}

export function createRowExpandPlugin(options?: RowExpandOptions): Plugin {
  return {
    ...rowExpandPlugin,
    options: { ...rowExpandPlugin.options, ...options }
  }
}
