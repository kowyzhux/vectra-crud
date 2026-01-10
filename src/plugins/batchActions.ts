import { CrudPlugin, BatchActionOptions } from '@/types/plugin'

/**
 * Batch actions plugin - enable batch operations on selected rows
 */
export function createBatchActionsPlugin(options: BatchActionOptions = {}): CrudPlugin {
  const { showBar = true, fixed = true } = options

  return {
    name: 'batch-actions',
    options: {
      showBar,
      fixed,
    },

    install(context: any) {
      // Track selected rows
      const selectedRows = new Set<string | number>()

      // Select a row
      const select = (rowId: string | number) => {
        selectedRows.add(rowId)
      }

      // Deselect a row
      const deselect = (rowId: string | number) => {
        selectedRows.delete(rowId)
      }

      // Toggle row selection
      const toggle = (rowId: string | number) => {
        if (selectedRows.has(rowId)) {
          selectedRows.delete(rowId)
        } else {
          selectedRows.add(rowId)
        }
      }

      // Select all rows
      const selectAll = (rowIds: (string | number)[]) => {
        rowIds.forEach((id) => selectedRows.add(id))
      }

      // Deselect all rows
      const deselectAll = () => {
        selectedRows.clear()
      }

      // Check if row is selected
      const isSelected = (rowId: string | number) => {
        return selectedRows.has(rowId)
      }

      // Get selected rows
      const getSelected = () => {
        return Array.from(selectedRows)
      }

      // Get selection count
      const getCount = () => {
        return selectedRows.size
      }

      // Expose methods
      context.batchActions = {
        select,
        deselect,
        toggle,
        selectAll,
        deselectAll,
        isSelected,
        getSelected,
        getCount,
        selectedRows,
        showBar,
        fixed,
      }
    },
  }
}
