import { CrudPlugin, InlineEditOptions } from '@/types/plugin'

/**
 * Inline edit plugin - enable inline editing in table
 */
export function createInlineEditPlugin(options: InlineEditOptions = {}): CrudPlugin {
  const { trigger = 'dblclick', autoSave = false } = options

  return {
    name: 'inline-edit',
    options: {
      trigger,
      autoSave,
    },

    install(context: any) {
      // Track editing state
      const editingRows = new Map<string | number, any>()

      // Start editing a row
      const startEdit = (row: any, rowId: string | number) => {
        editingRows.set(rowId, { ...row })
      }

      // Cancel editing
      const cancelEdit = (rowId: string | number) => {
        editingRows.delete(rowId)
      }

      // Save edited row
      const saveEdit = async (rowId: string | number, onSave?: (data: any) => Promise<void>) => {
        const editedRow = editingRows.get(rowId)
        if (!editedRow) return

        try {
          if (onSave) {
            await onSave(editedRow)
          }
          editingRows.delete(rowId)
        } catch (error) {
          console.error('Failed to save inline edit:', error)
          throw error
        }
      }

      // Check if row is being edited
      const isEditing = (rowId: string | number) => {
        return editingRows.has(rowId)
      }

      // Get edited value
      const getEditedRow = (rowId: string | number) => {
        return editingRows.get(rowId)
      }

      // Expose methods
      context.inlineEdit = {
        startEdit,
        cancelEdit,
        saveEdit,
        isEditing,
        getEditedRow,
        editingRows,
      }
    },
  }
}
