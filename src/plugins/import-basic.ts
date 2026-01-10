import { ElMessage, ElMessageBox } from 'element-plus'
import type { Plugin, PluginContext, ActionSchema } from '../types'

export const importBasicPlugin: Plugin = {
  name: 'import-basic',

  install(context: PluginContext) {
    if (!context.dataSource?.import) {
      return
    }

    const importAction: ActionSchema = {
      key: 'import',
      label: 'Import',
      type: 'primary',
      tooltip: 'Import data',
      handler: async () => {
        if (!context.dataSource?.import) {
          ElMessage.warning('Import function not implemented')
          return
        }

        try {
          await ElMessageBox.alert(
            'Import functionality placeholder. Please implement file upload dialog.',
            'Import',
            {
              confirmButtonText: 'OK',
              type: 'info'
            }
          )

          const input = document.createElement('input')
          input.type = 'file'
          input.accept = '.xlsx,.xls,.csv'

          input.onchange = async (e: Event) => {
            const target = e.target as HTMLInputElement
            const file = target.files?.[0]

            if (!file) return

            try {
              ElMessage.info('Importing...')
              await context.dataSource!.import!(file)
              ElMessage.success('Import completed')

              if ((context as any).refresh) {
                ;(context as any).refresh()
              }
            } catch (error) {
              console.error('Import failed:', error)
              ElMessage.error('Import failed')
            }
          }

          input.click()
        } catch (error) {
          console.log('Import cancelled')
        }
      }
    }

    if (!context.actions) {
      context.actions = []
    }
    context.actions.push(importAction)
  }
}
