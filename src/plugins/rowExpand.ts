import { CrudPlugin, RowExpandOptions } from '@/types/plugin'

/**
 * Row expand plugin - enable row expansion in table
 */
export function createRowExpandPlugin(options: RowExpandOptions = {}): CrudPlugin {
  return {
    name: 'row-expand',
    options,

    install(context: any) {
      // Track expanded rows
      const expandedRows = new Set<string | number>()

      // Toggle row expansion
      const toggleExpand = (rowId: string | number) => {
        if (expandedRows.has(rowId)) {
          expandedRows.delete(rowId)
        } else {
          expandedRows.add(rowId)
        }
      }

      // Expand a row
      const expand = (rowId: string | number) => {
        expandedRows.add(rowId)
      }

      // Collapse a row
      const collapse = (rowId: string | number) => {
        expandedRows.delete(rowId)
      }

      // Check if row is expanded
      const isExpanded = (rowId: string | number) => {
        return expandedRows.has(rowId)
      }

      // Collapse all rows
      const collapseAll = () => {
        expandedRows.clear()
      }

      // Expose methods
      context.rowExpand = {
        toggleExpand,
        expand,
        collapse,
        isExpanded,
        collapseAll,
        expandedRows,
        render: options.render,
        component: options.component,
      }
    },
  }
}
