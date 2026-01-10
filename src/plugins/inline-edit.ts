import type { Plugin, PluginContext } from '../types'

export interface InlineEditOptions {
  trigger?: 'click' | 'dblclick' | 'manual'
  mode?: 'cell' | 'row'
  autoClear?: boolean
}

export const inlineEditPlugin: Plugin = {
  name: 'inline-edit',
  options: {
    trigger: 'click',
    mode: 'cell',
    autoClear: true
  } as InlineEditOptions,

  beforeMountTable(context: PluginContext) {
    const options = this.options as InlineEditOptions

    ;(context as any).editConfig = {
      trigger: options.trigger,
      mode: options.mode,
      showStatus: true,
      autoClear: options.autoClear
    }
  },

  async onEditClosed(context: PluginContext, row: any, column: any) {
    if (!context.dataSource) {
      console.warn('inlineEditPlugin: dataSource is required')
      return
    }

    try {
      await context.dataSource.save(row)
    } catch (error) {
      console.error('Failed to save edited row:', error)
    }
  }
}

export function createInlineEditPlugin(options?: InlineEditOptions): Plugin {
  return {
    ...inlineEditPlugin,
    options: { ...inlineEditPlugin.options, ...options }
  }
}
