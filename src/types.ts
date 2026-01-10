import type { Component } from 'vue'

// ============ Dictionary Types ============

export interface DictItem {
  label: string
  value: string | number
  color?: string
  disabled?: boolean
  [key: string]: any
}

export interface DictConfig {
  code: string
  loader?: () => Promise<DictItem[]>
  cache?: boolean
  expiry?: number
}

// ============ Data Source Types ============

export interface PaginationParams {
  page: number
  pageSize: number
}

export interface SortParams {
  prop: string
  order: 'asc' | 'desc'
}

export interface FilterParams {
  [key: string]: any
}

export interface ListParams {
  pagination?: PaginationParams
  sort?: SortParams
  filters?: FilterParams
}

export interface ListResult<T = any> {
  data: T[]
  total: number
}

export interface IDataSource<T = any> {
  list(params: ListParams): Promise<ListResult<T>>
  save(data: T): Promise<T>
  remove(id: string | number): Promise<void>
  export?(params: ListParams): Promise<Blob | string>
  import?(file: File): Promise<void>
}

// ============ Schema Types ============

export type FieldType =
  | 'input'
  | 'textarea'
  | 'number'
  | 'select'
  | 'dict-select'
  | 'date'
  | 'datetime'
  | 'switch'
  | 'radio'
  | 'checkbox'
  | 'upload'
  | 'subform'
  | 'keyvalue'
  | 'custom'

export interface BaseFieldSchema {
  prop: string
  label: string
  type?: FieldType
  defaultValue?: any
  required?: boolean
  disabled?: boolean
  placeholder?: string
  tooltip?: string
  width?: string | number
  span?: number
}

export interface SearchFieldSchema extends BaseFieldSchema {
  operator?: 'eq' | 'like' | 'in' | 'between' | 'gt' | 'lt' | 'gte' | 'lte'
  dictCode?: string
  options?: DictItem[]
  render?: (props: { field: SearchFieldSchema; modelValue: any }) => any
}

export interface FormFieldSchema extends BaseFieldSchema {
  rules?: any[]
  dictCode?: string
  options?: DictItem[]
  min?: number
  max?: number
  step?: number
  multiple?: boolean
  childFields?: FormFieldSchema[]
  render?: (props: {
    field: FormFieldSchema
    modelValue: any
    onChange: (value: any) => void
  }) => any
}

export interface TableColumnSchema {
  prop: string
  label: string
  type?: 'text' | 'dict' | 'date' | 'datetime' | 'custom'
  width?: string | number
  minWidth?: string | number
  fixed?: 'left' | 'right'
  sortable?: boolean
  filterable?: boolean
  dictCode?: string
  formatter?: (row: any, column: TableColumnSchema, cellValue: any) => string
  render?: (props: { row: any; column: TableColumnSchema; $index: number }) => any
}

export interface ActionSchema {
  key: string
  label: string
  type?: 'primary' | 'success' | 'warning' | 'danger' | 'info' | 'text'
  icon?: string
  tooltip?: string
  visible?: (context?: any) => boolean
  disabled?: (context?: any) => boolean
  handler: (context?: any) => void | Promise<void>
}

// ============ UI Adapter Types ============

export interface UIComponentMap {
  input: Component
  textarea: Component
  number: Component
  select: Component
  date: Component
  datetime: Component
  switch: Component
  radio: Component
  checkbox: Component
  button: Component
  dialog: Component
  drawer: Component
  form: Component
  formItem: Component
  table: Component
  pagination: Component
  tag: Component
  upload: Component
}

export interface UIAdapter {
  components: UIComponentMap
  formItemProp?: string
  formItemLabel?: string
}

// ============ Plugin Types ============

export interface PluginContext {
  dataSource?: IDataSource
  searchSchema?: SearchFieldSchema[]
  tableSchema?: TableColumnSchema[]
  formSchema?: FormFieldSchema[]
  actions?: ActionSchema[]
  pageKey?: string
  [key: string]: any
}

export interface Plugin {
  name: string
  install?: (context: PluginContext) => void | Promise<void>
  beforeMountSearch?: (context: PluginContext) => void
  beforeMountTable?: (context: PluginContext) => void
  beforeMountForm?: (context: PluginContext) => void
  onSearch?: (context: PluginContext, params: any) => void
  onTableChange?: (context: PluginContext, event: any) => void
  onFormSubmit?: (context: PluginContext, data: any) => void
  [key: string]: any
}

// ============ Lifecycle Hook Types ============

export type LifecycleHook = (...args: any[]) => void | Promise<void>

export interface LifecycleHooks {
  beforeSearch?: LifecycleHook
  afterSearch?: LifecycleHook
  beforeSave?: LifecycleHook
  afterSave?: LifecycleHook
  beforeRemove?: LifecycleHook
  afterRemove?: LifecycleHook
  beforeExport?: LifecycleHook
  afterExport?: LifecycleHook
  beforeImport?: LifecycleHook
  afterImport?: LifecycleHook
}

// ============ Permission Types ============

export type PermissionChecker = (permission: string, context?: any) => boolean | Promise<boolean>

export interface PermissionConfig {
  checker: PermissionChecker
}

// ============ Provider Types ============

export interface CrudProviderOptions {
  uiAdapter?: UIAdapter
  plugins?: Plugin[]
  dictProvider?: DictConfig[]
  permissionConfig?: PermissionConfig
}
