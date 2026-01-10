# vectra-crud

Extensible Vue 3 + TypeScript CRUD library for ERP/enterprise back-office applications.

## Features

### Core Architecture

- **UI Abstraction Layer**: Default Element Plus adapter with interface hooks to support other UI libraries (e.g., Naive UI, Ant Design Vue)
- **Schema-Driven Components**: Define your CRUD pages with declarative schemas
- **Plugin System**: Extensible architecture with built-in plugins for common features
- **Lifecycle Hooks**: Before/after hooks for load, save, remove operations
- **Data Source Abstraction**: Swap backends easily with the `IDataSource` interface

### Components

#### Provider Components
- **CrudProvider**: Context provider with plugin system and lifecycle hooks
- **DictProvider**: Dictionary data provider with caching

#### Schema-Driven Components
- **CrudPage**: Full CRUD page composition (search + table + toolbar + form dialog)
- **SchemaSearch**: Search form component
- **SchemaTable**: Table component with custom rendering
- **SchemaForm**: Form component with validation

#### Common Components
- **DictTag**: Dictionary tag display
- **KVEditor**: Key-value array editor
- **SubForm**: Nested form array (add/remove rows)
- **UploadField**: File upload wrapper (stub)

### Composables (Hooks)

- **useCrud**: Access CRUD context and manage plugins
- **useDict**: Dictionary management with caching
- **usePermission**: Permission checking for actions/columns
- **useAction**: Action runner with lifecycle management

### Built-in Plugins

1. **Column Persist**: Save column state (order, visibility, width) to localStorage
2. **Export**: Basic export functionality (CSV/JSON) with Blob download
3. **Inline Edit**: Enable inline editing in tables
4. **Row Expand**: Row expansion support
5. **Virtual Scroll**: Configuration for virtual scrolling
6. **Batch Actions**: Batch operations on selected rows

## Installation

```bash
npm install vectra-crud
```

**Peer Dependencies:**
```bash
npm install vue@^3.3.0 element-plus@^2.4.0
```

## Quick Start

### 1. Basic Setup

```typescript
import { createApp } from 'vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import App from './App.vue'

const app = createApp(App)
app.use(ElementPlus)
app.mount('#app')
```

### 2. Define a Schema

```typescript
import { CrudSchema } from 'vectra-crud'

const userSchema: CrudSchema = {
  search: [
    {
      prop: 'username',
      label: '用户名',
      type: 'input',
    },
    {
      prop: 'status',
      label: '状态',
      type: 'select',
      options: [
        { label: '启用', value: 1 },
        { label: '禁用', value: 0 },
      ],
    },
  ],
  table: [
    {
      prop: 'id',
      label: 'ID',
      width: 80,
    },
    {
      prop: 'username',
      label: '用户名',
    },
    {
      prop: 'email',
      label: '邮箱',
    },
    {
      prop: 'status',
      label: '状态',
      type: 'dict',
      dictCode: 'user_status',
    },
  ],
  form: [
    {
      prop: 'username',
      label: '用户名',
      type: 'input',
      required: true,
    },
    {
      prop: 'email',
      label: '邮箱',
      type: 'input',
      required: true,
    },
    {
      prop: 'status',
      label: '状态',
      type: 'select',
      options: [
        { label: '启用', value: 1 },
        { label: '禁用', value: 0 },
      ],
    },
  ],
}
```

### 3. Implement Data Source

```typescript
import { IDataSource, ListParams, ListResult } from 'vectra-crud'

const userDataSource: IDataSource = {
  async list(params: ListParams): Promise<ListResult> {
    // Call your API here
    // This is a stub implementation
    return {
      data: [
        { id: 1, username: 'admin', email: 'admin@example.com', status: 1 },
        { id: 2, username: 'user', email: 'user@example.com', status: 1 },
      ],
      total: 2,
    }
  },

  async save(data: any) {
    // Call your API here
    console.log('Saving:', data)
    return data
  },

  async remove(ids: string | number | Array<string | number>) {
    // Call your API here
    console.log('Removing:', ids)
  },
}
```

### 4. Use CrudPage Component

```vue
<template>
  <CrudProvider :config="crudConfig">
    <DictProvider :loader="dictLoader">
      <CrudPage
        :schema="userSchema"
        :data-source="userDataSource"
        :toolbar-actions="toolbarActions"
        :row-actions="rowActions"
      />
    </DictProvider>
  </CrudProvider>
</template>

<script setup lang="ts">
import { CrudProvider, DictProvider, CrudPage } from 'vectra-crud'
import { createExportPlugin, createColumnPersistPlugin } from 'vectra-crud'
import { userSchema, userDataSource } from './user'

// CRUD configuration
const crudConfig = {
  plugins: [
    createExportPlugin(),
    createColumnPersistPlugin(),
  ],
  hooks: {
    afterLoad: (result) => {
      console.log('Loaded data:', result)
    },
  },
}

// Dictionary loader
const dictLoader = async (code: string) => {
  // Load dictionary from API
  if (code === 'user_status') {
    return [
      { label: '启用', value: 1, color: 'success' },
      { label: '禁用', value: 0, color: 'danger' },
    ]
  }
  return []
}

// Toolbar actions
const toolbarActions = [
  {
    key: 'add',
    label: '新增',
    type: 'primary',
    handler: (context) => {
      context.refresh?.()
    },
  },
  {
    key: 'export',
    label: '导出',
    handler: async (context) => {
      // Use export plugin
      console.log('Exporting data:', context.data)
    },
  },
]

// Row actions
const rowActions = [
  {
    key: 'edit',
    label: '编辑',
    type: 'primary',
    handler: (context) => {
      console.log('Editing row:', context.row)
    },
  },
  {
    key: 'delete',
    label: '删除',
    type: 'danger',
    confirm: true,
    handler: async (context) => {
      console.log('Deleting row:', context.row)
      context.refresh?.()
    },
  },
]
</script>
```

## Advanced Usage

### Custom Rendering with Slots

```vue
<template>
  <CrudPage :schema="schema" :data-source="dataSource">
    <!-- Custom search field -->
    <template #search-username="{ field, model }">
      <el-input v-model="model[field.prop]" prefix-icon="User" />
    </template>

    <!-- Custom table column -->
    <template #table-status="{ row }">
      <el-tag :type="row.status === 1 ? 'success' : 'danger'">
        {{ row.status === 1 ? '启用' : '禁用' }}
      </el-tag>
    </template>

    <!-- Custom form field -->
    <template #form-email="{ field, model }">
      <el-input v-model="model[field.prop]" type="email" />
    </template>
  </CrudPage>
</template>
```

### Custom Render Functions

```typescript
const schema: CrudSchema = {
  table: [
    {
      prop: 'avatar',
      label: '头像',
      render: (value) => h('img', { src: value, style: 'width: 40px; height: 40px' }),
    },
    {
      prop: 'status',
      label: '状态',
      render: (value) => h(ElTag, { type: value ? 'success' : 'danger' }, 
        () => value ? '启用' : '禁用'
      ),
    },
  ],
}
```

### Using Plugins

```typescript
import {
  createColumnPersistPlugin,
  createExportPlugin,
  createInlineEditPlugin,
  createRowExpandPlugin,
  createVirtualScrollPlugin,
  createBatchActionsPlugin,
} from 'vectra-crud'

const crudConfig = {
  plugins: [
    createColumnPersistPlugin({
      storageKey: 'my-table-columns',
      order: true,
      visibility: true,
      width: true,
    }),
    createExportPlugin({
      filename: 'users',
      format: 'csv',
    }),
    createInlineEditPlugin({
      trigger: 'dblclick',
      autoSave: true,
    }),
    createRowExpandPlugin({
      render: (row) => h('div', `Details for ${row.name}`),
    }),
    createVirtualScrollPlugin({
      enabled: true,
      itemHeight: 48,
    }),
    createBatchActionsPlugin({
      showBar: true,
    }),
  ],
}
```

### Permission Control

```vue
<template>
  <CrudPage
    :schema="schema"
    :toolbar-actions="toolbarActions"
    :row-actions="rowActions"
  />
</template>

<script setup lang="ts">
import { usePermission } from 'vectra-crud'

const { hasPermission } = usePermission()

const toolbarActions = [
  {
    key: 'add',
    label: '新增',
    permission: 'user:create',
    hidden: (context) => !hasPermission('user:create'),
    handler: () => { /* ... */ },
  },
]
</script>
```

### Lifecycle Hooks

```typescript
const crudConfig = {
  hooks: {
    beforeLoad: async (params) => {
      console.log('Before loading data:', params)
      // Return false to cancel loading
      return true
    },
    afterLoad: async (result) => {
      console.log('After loading data:', result)
    },
    beforeSave: async (data) => {
      console.log('Before saving:', data)
      // Validate or transform data
      return true
    },
    afterSave: async (data) => {
      console.log('After saving:', data)
    },
    beforeRemove: async (ids) => {
      console.log('Before removing:', ids)
      return true
    },
    afterRemove: async (ids) => {
      console.log('After removing:', ids)
    },
    onError: async (error) => {
      console.error('Error:', error)
    },
  },
}
```

## UI Adapter System

The library uses a UI adapter system to support multiple UI libraries. Element Plus is the default adapter.

### Using Element Plus (Default)

```typescript
import { elementPlusAdapter, setCurrentAdapter } from 'vectra-crud'

// Element Plus is used by default, but you can explicitly set it
setCurrentAdapter('element-plus')
```

### Creating a Custom Adapter

```typescript
import { IUiAdapter, registerAdapter, setCurrentAdapter } from 'vectra-crud'

const naiveUiAdapter: IUiAdapter = {
  name: 'naive-ui',
  form: {
    Form: NForm,
    FormItem: NFormItem,
    Input: NInput,
    // ... other components
  },
  table: {
    Table: NDataTable,
    TableColumn: NDataTableColumn,
  },
  // ... other component mappings
  showMessage(message, type) {
    // Implement message display
  },
  // ... other helper methods
}

// Register and use the adapter
registerAdapter(naiveUiAdapter)
setCurrentAdapter('naive-ui')
```

## Architecture

### Component Hierarchy

```
CrudProvider (Context + Plugins)
└── DictProvider (Dictionary Cache)
    └── CrudPage (Composition)
        ├── SchemaSearch (Search Form)
        ├── Toolbar (Actions)
        ├── SchemaTable (Data Table)
        │   ├── DictTag (Dictionary Display)
        │   └── Row Actions
        ├── Pagination
        └── SchemaForm (Dialog Form)
            ├── SubForm (Nested Arrays)
            ├── KVEditor (Key-Value Pairs)
            └── UploadField (File Upload)
```

### Data Flow

```
User Input → Schema Definition → UI Adapter → Components
                                      ↓
                          Data Source ← Lifecycle Hooks
                                      ↓
                          Backend API → Response → Update UI
```

## TypeScript Support

This library is written in TypeScript and provides full type definitions.

```typescript
import type {
  CrudSchema,
  SearchFieldSchema,
  TableColumnSchema,
  FormFieldSchema,
  IDataSource,
  ActionConfig,
  CrudConfig,
  DictItem,
} from 'vectra-crud'
```

## Development

### Install Dependencies

```bash
npm install
```

### Build

```bash
npm run build
```

### Lint

```bash
npm run lint
```

### Format

```bash
npm run format
```

### Test

```bash
npm run test
```

### Preview

```bash
npm run preview
```

## TODO

### High Priority
- [ ] Add real API integration examples
- [ ] Improve documentation with more examples
- [ ] Add unit tests for core functionality
- [ ] Add E2E tests for components
- [ ] Improve accessibility (ARIA labels, keyboard navigation)

### Features
- [ ] Advanced search (query builder)
- [ ] Column filtering and sorting persistence
- [ ] Column resizing
- [ ] Row drag-and-drop reordering
- [ ] Import functionality (CSV/Excel)
- [ ] Print support
- [ ] Mobile responsive design
- [ ] Dark mode support

### Adapters
- [ ] Naive UI adapter
- [ ] Ant Design Vue adapter
- [ ] Quasar adapter
- [ ] Vuetify adapter

### Plugins
- [ ] Advanced export (Excel with formatting)
- [ ] Import validation and preview
- [ ] Advanced filtering (faceted search)
- [ ] Column grouping
- [ ] Tree table support
- [ ] Timeline view
- [ ] Kanban view
- [ ] Calendar view

### Developer Experience
- [ ] Component playground/demo
- [ ] Storybook integration
- [ ] CLI for scaffolding
- [ ] VS Code extension
- [ ] More comprehensive TypeScript examples

### Performance
- [ ] Optimize virtual scrolling
- [ ] Lazy loading for large forms
- [ ] Debounce search inputs
- [ ] Request cancellation
- [ ] Cache management improvements

## License

MIT

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## Support

For issues and questions, please open an issue on GitHub.
