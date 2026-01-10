import { CrudPlugin, ColumnPersistOptions } from '@/types/plugin'

/**
 * Column persist plugin - saves column state to localStorage
 */
export function createColumnPersistPlugin(options: ColumnPersistOptions = {}): CrudPlugin {
  const {
    storageKey = 'vectra-crud-columns',
    order = true,
    visibility = true,
    width = true,
  } = options

  return {
    name: 'column-persist',
    options: {
      storageKey,
      order,
      visibility,
      width,
    },

    install(context: any) {
      // Load persisted column state
      const loadColumnState = (tableId: string) => {
        try {
          const key = `${storageKey}-${tableId}`
          const data = localStorage.getItem(key)
          return data ? JSON.parse(data) : null
        } catch (error) {
          console.error('Failed to load column state:', error)
          return null
        }
      }

      // Save column state
      const saveColumnState = (tableId: string, state: any) => {
        try {
          const key = `${storageKey}-${tableId}`
          localStorage.setItem(key, JSON.stringify(state))
        } catch (error) {
          console.error('Failed to save column state:', error)
        }
      }

      // Expose methods
      context.columnPersist = {
        load: loadColumnState,
        save: saveColumnState,
      }
    },
  }
}
