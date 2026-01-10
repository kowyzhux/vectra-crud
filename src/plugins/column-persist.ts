import type { Plugin, PluginContext, TableColumnSchema } from '../types'

interface ColumnPersistState {
  visible: string[]
  hidden: string[]
  widths: Record<string, number>
  order: string[]
}

export const columnPersistPlugin: Plugin = {
  name: 'column-persist',

  beforeMountTable(context: PluginContext) {
    if (!context.pageKey) {
      console.warn('columnPersistPlugin: pageKey is required')
      return
    }

    const storageKey = `vectra-crud-columns-${context.pageKey}`
    const stored = localStorage.getItem(storageKey)

    if (stored && context.tableSchema) {
      try {
        const state: ColumnPersistState = JSON.parse(stored)

        context.tableSchema.forEach((column: TableColumnSchema) => {
          if (state.hidden.includes(column.prop)) {
            ;(column as any).visible = false
          }
          if (state.widths[column.prop]) {
            column.width = state.widths[column.prop]
          }
        })

        if (state.order.length > 0) {
          const orderedSchema: TableColumnSchema[] = []
          state.order.forEach((prop) => {
            const column = context.tableSchema?.find((c) => c.prop === prop)
            if (column) {
              orderedSchema.push(column)
            }
          })
          context.tableSchema.splice(0, context.tableSchema.length, ...orderedSchema)
        }
      } catch (error) {
        console.error('Failed to load column state:', error)
      }
    }
  },

  onTableChange(context: PluginContext, event: any) {
    if (!context.pageKey || !context.tableSchema) {
      return
    }

    const storageKey = `vectra-crud-columns-${context.pageKey}`

    const state: ColumnPersistState = {
      visible: [],
      hidden: [],
      widths: {},
      order: []
    }

    context.tableSchema.forEach((column: TableColumnSchema) => {
      const visible = (column as any).visible !== false
      if (visible) {
        state.visible.push(column.prop)
      } else {
        state.hidden.push(column.prop)
      }

      if (column.width) {
        state.widths[column.prop] = Number(column.width)
      }

      state.order.push(column.prop)
    })

    localStorage.setItem(storageKey, JSON.stringify(state))
  }
}

export function clearColumnPersist(pageKey: string) {
  const storageKey = `vectra-crud-columns-${pageKey}`
  localStorage.removeItem(storageKey)
}
