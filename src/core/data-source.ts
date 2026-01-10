import type {
  IDataSource,
  ListParams,
  ListResult,
  PaginationParams,
  SortParams,
  FilterParams
} from '../types'

export { IDataSource, ListParams, ListResult, PaginationParams, SortParams, FilterParams }

export function createMockDataSource<T = any>(data: T[]): IDataSource<T> {
  return {
    async list(params: ListParams): Promise<ListResult<T>> {
      const { pagination, sort, filters } = params
      let result = [...data]

      if (filters) {
        result = result.filter((item: any) => {
          return Object.entries(filters).every(([key, value]) => {
            if (value === undefined || value === null || value === '') return true
            const itemValue = item[key]
            if (Array.isArray(value)) {
              return value.includes(itemValue)
            }
            return String(itemValue).toLowerCase().includes(String(value).toLowerCase())
          })
        })
      }

      if (sort?.prop) {
        result.sort((a: any, b: any) => {
          const aVal = a[sort.prop]
          const bVal = b[sort.prop]
          const order = sort.order === 'asc' ? 1 : -1
          if (aVal < bVal) return -1 * order
          if (aVal > bVal) return 1 * order
          return 0
        })
      }

      const total = result.length

      if (pagination) {
        const { page, pageSize } = pagination
        const start = (page - 1) * pageSize
        result = result.slice(start, start + pageSize)
      }

      return { data: result, total }
    },

    async save(item: T): Promise<T> {
      const index = data.findIndex((d: any) => d.id === (item as any).id)
      if (index >= 0) {
        data[index] = item
      } else {
        data.push(item)
      }
      return item
    },

    async remove(id: string | number): Promise<void> {
      const index = data.findIndex((d: any) => d.id === id)
      if (index >= 0) {
        data.splice(index, 1)
      }
    }
  }
}

export function mergeListParams(...params: Partial<ListParams>[]): ListParams {
  const merged: ListParams = {}

  for (const param of params) {
    if (param.pagination) {
      merged.pagination = { ...merged.pagination, ...param.pagination }
    }
    if (param.sort) {
      merged.sort = param.sort
    }
    if (param.filters) {
      merged.filters = { ...merged.filters, ...param.filters }
    }
  }

  return merged
}
