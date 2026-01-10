// Main entry point
export { default as CrudPage } from './components/CrudPage.vue'
export { default as SchemaSearch } from './components/SchemaSearch.vue'
export { default as SchemaTable } from './components/SchemaTable.vue'
export { default as SchemaForm } from './components/SchemaForm.vue'

// Common components
export { default as DictSelect } from './components/common/DictSelect.vue'
export { default as DictTag } from './components/common/DictTag.vue'
export { default as SubForm } from './components/common/SubForm.vue'
export { default as KeyValueEditor } from './components/common/KeyValueEditor.vue'
export { default as Upload } from './components/common/Upload.vue'
export { default as ColumnSettingPanel } from './components/common/ColumnSettingPanel.vue'

// Core
export {
  type IDataSource,
  type ListParams,
  type ListResult,
  createMockDataSource,
  mergeListParams
} from './core/data-source'

export {
  CrudProvider,
  provideCrudProvider,
  useCrudProvider,
  createLifecycleHooks,
  CRUD_PROVIDER_KEY
} from './core/provider'

export {
  DictProvider,
  provideDictProvider,
  useDictProvider,
  useDict,
  DICT_PROVIDER_KEY
} from './core/dict'

export {
  providePermission,
  usePermission,
  PERMISSION_KEY
} from './core/permissions'

export {
  definePlugin,
  runPlugins,
  createPluginContext
} from './core/plugins'

// Adapters
export { elementPlusAdapter } from './adapters/element-plus'
export type { UIAdapter } from './adapters'

// Plugins
export { columnPersistPlugin, clearColumnPersist } from './plugins/column-persist'
export { exportBasicPlugin } from './plugins/export-basic'
export { importBasicPlugin } from './plugins/import-basic'
export { inlineEditPlugin, createInlineEditPlugin } from './plugins/inline-edit'
export { rowExpandPlugin, createRowExpandPlugin } from './plugins/row-expand'
export { virtualScrollPlugin, createVirtualScrollPlugin } from './plugins/virtual-scroll'

// Types
export type {
  DictItem,
  DictConfig,
  PaginationParams,
  SortParams,
  FilterParams,
  SearchFieldSchema,
  FormFieldSchema,
  TableColumnSchema,
  ActionSchema,
  Plugin,
  PluginContext,
  LifecycleHooks,
  PermissionChecker,
  PermissionConfig,
  CrudProviderOptions,
  UIComponentMap,
  BaseFieldSchema,
  FieldType
} from './types'

// Styles
import './style.css'
