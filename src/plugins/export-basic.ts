import { ElMessage } from 'element-plus'
import type { Plugin, PluginContext, ActionSchema } from '../types'

export const exportBasicPlugin: Plugin = {
  name: 'export-basic',

  install(context: PluginContext) {
    if (!context.dataSource?.export) {
      return
    }

    const exportAction: ActionSchema = {
      key: 'export',
      label: 'Export',
      type: 'primary',
      tooltip: 'Export data',
      handler: async () => {
        if (!context.dataSource?.export) {
          ElMessage.warning('Export function not implemented')
          return
        }

        try {
          ElMessage.info('Exporting...')

          const result = await context.dataSource.export({
            filters: (context as any).searchParams || {}
          })

          if (result instanceof Blob) {
            const url = URL.createObjectURL(result)
            const link = document.createElement('a')
            link.href = url
            link.download = `export-${Date.now()}.xlsx`
            link.click()
            URL.revokeObjectURL(url)
          } else if (typeof result === 'string') {
            const link = document.createElement('a')
            link.href = result
            link.download = `export-${Date.now()}.xlsx`
            link.click()
          }

          ElMessage.success('Export completed')
        } catch (error) {
          console.error('Export failed:', error)
          ElMessage.error('Export failed')
        }
      }
    }

    if (!context.actions) {
      context.actions = []
    }
    context.actions.push(exportAction)
  }
}
