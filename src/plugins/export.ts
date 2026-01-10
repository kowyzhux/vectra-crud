import { CrudPlugin, ExportOptions } from '@/types/plugin'

/**
 * Export plugin - basic export functionality
 */
export function createExportPlugin(options: ExportOptions = {}): CrudPlugin {
  const { filename = 'export', format = 'csv' } = options

  return {
    name: 'export',
    options: {
      filename,
      format,
    },

    install(context: any) {
      // Default CSV export handler
      const exportToCSV = (data: any[], columns: string[]) => {
        // Generate CSV header
        const header = columns.join(',')

        // Generate CSV rows
        const rows = data.map((row) => {
          return columns
            .map((col) => {
              const value = row[col]
              // Escape commas and quotes
              if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
                return `"${value.replace(/"/g, '""')}"`
              }
              return value
            })
            .join(',')
        })

        return [header, ...rows].join('\n')
      }

      // Export data to file
      const exportData = async (data: any[], columns?: string[], customFilename?: string) => {
        try {
          if (options.handler) {
            await options.handler(data, customFilename || filename)
            return
          }

          // Use default columns if not provided
          const cols = columns || (data.length > 0 ? Object.keys(data[0]) : [])

          let content = ''
          let mimeType = 'text/plain'
          const fileExtension = format

          if (format === 'csv') {
            content = exportToCSV(data, cols)
            mimeType = 'text/csv;charset=utf-8;'
          } else if (format === 'json') {
            content = JSON.stringify(data, null, 2)
            mimeType = 'application/json'
          } else {
            throw new Error(`Unsupported export format: ${format}`)
          }

          // Create blob and download
          const blob = new Blob([content], { type: mimeType })
          const url = URL.createObjectURL(blob)
          const link = document.createElement('a')
          link.href = url
          link.download = `${customFilename || filename}.${fileExtension}`
          document.body.appendChild(link)
          link.click()
          document.body.removeChild(link)
          URL.revokeObjectURL(url)
        } catch (error) {
          console.error('Export failed:', error)
          throw error
        }
      }

      // Expose methods
      context.export = {
        exportData,
        exportToCSV,
      }
    },
  }
}
