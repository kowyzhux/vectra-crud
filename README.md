# vectra-crud

A flexible Vue 3 + TypeScript CRUD library with schema-driven components and pluggable UI adapters.

## Features

- 🚀 **Schema-driven**: Define your CRUD interface with simple schemas
- 🎨 **Pluggable UI**: Swap UI libraries via adapters (Element Plus default)
- 🔌 **Plugin System**: Extend functionality with plugins
- 📦 **TypeScript**: Full type safety
- ⚡ **Vite**: Fast build and development
- 🎯 **Composable**: Use components independently or together

## Installation

```bash
npm install vectra-crud element-plus vxe-table
# or
pnpm add vectra-crud element-plus vxe-table
# or
yarn add vectra-crud element-plus vxe-table
```

## Quick Start

### Basic Usage

```vue
<template>
  <crud-page
    :data-source="dataSource"
    :search-schema="searchSchema"
    :table-schema="tableSchema"
    :form-schema="formSchema"
    page-key="users"
  />
</template>

<script setup lang="ts">
import { CrudPage, createMockDataSource } from 'vectra-crud'
import 'vectra-crud/style.css'

// Mock data source
const dataSource = createMockDataSource([
  { id: 1, name: 'John Doe', email: 'john@example.com', status: 'active' },
  { id: 2, name: 'Jane Smith', email: 'jane@example.com', status: 'inactive' }
])

// Search schema
const searchSchema = [
  { prop: 'name', label: 'Name', type: 'input', placeholder: 'Enter name' },
  { 
    prop: 'status', 
    label: 'Status', 
    type: 'select',
    options: [
      { label: 'Active', value: 'active' },
      { label: 'Inactive', value: 'inactive' }
    ]
  }
]

// Table schema
const tableSchema = [
  { prop: 'id', label: 'ID', width: 80 },
  { prop: 'name', label: 'Name', minWidth: 120 },
  { prop: 'email', label: 'Email', minWidth: 180 },
  { 
    prop: 'status', 
    label: 'Status', 
    width: 100,
    type: 'dict',
    dictCode: 'user-status'
  }
]

// Form schema
const formSchema = [
  { prop: 'id', label: 'ID', type: 'number', disabled: true },
  { prop: 'name', label: 'Name', type: 'input', required: true },
  { prop: 'email', label: 'Email', type: 'input', required: true },
  { 
    prop: 'status', 
    label: 'Status', 
    type: 'select',
    required: true,
    options: [
      { label: 'Active', value: 'active' },
      { label: 'Inactive', value: 'inactive' }
    ]
  }
]
</script>
```

### With Plugins

```vue
<script setup lang="ts">
import { 
  CrudPage, 
  provideCrudProvider,
  columnPersistPlugin,
  exportBasicPlugin,
  virtualScrollPlugin
} from 'vectra-crud'

// Setup provider with plugins
provideCrudProvider({
  plugins: [
    columnPersistPlugin,
    exportBasicPlugin,
    virtualScrollPlugin
  ]
})
</script>
```

### Custom Data Source

```typescript
import type { IDataSource } from 'vectra-crud'
import axios from 'axios'

const dataSource: IDataSource = {
  async list(params) {
    const response = await axios.get('/api/users', { params })
    return {
      data: response.data.items,
      total: response.data.total
    }
  },
  
  async save(data) {
    if (data.id) {
      const response = await axios.put(`/api/users/${data.id}`, data)
      return response.data
    } else {
      const response = await axios.post('/api/users', data)
      return response.data
    }
  },
  
  async remove(id) {
    await axios.delete(`/api/users/${id}`)
  },
  
  async export(params) {
    const response = await axios.get('/api/users/export', {
      params,
      responseType: 'blob'
    })
    return response.data
  }
}
```

## UI Adapters

### Element Plus (Default)

```typescript
import { provideCrudProvider, elementPlusAdapter } from 'vectra-crud'
import 'element-plus/dist/index.css'
import 'vxe-table/lib/style.css'

provideCrudProvider({
  uiAdapter: elementPlusAdapter
})
```

### Custom Adapter

Create your own UI adapter for other libraries (Naive UI, Ant Design Vue, etc.):

```typescript
import type { UIAdapter } from 'vectra-crud'

const myAdapter: UIAdapter = {
  components: {
    input: MyInput,
    select: MySelect,
    button: MyButton,
    dialog: MyDialog,
    form: MyForm,
    formItem: MyFormItem,
    table: MyTable,
    pagination: MyPagination,
    // ... other components
  },
  formItemProp: 'prop',
  formItemLabel: 'label'
}
```

## Plugins

### Built-in Plugins

- **columnPersistPlugin**: Persist column visibility, width, and order to localStorage
- **exportBasicPlugin**: Add export functionality to toolbar
- **importBasicPlugin**: Add import functionality to toolbar
- **inlineEditPlugin**: Enable inline editing in tables
- **rowExpandPlugin**: Add expandable rows
- **virtualScrollPlugin**: Enable virtual scrolling for large datasets

### Custom Plugin

```typescript
import { definePlugin } from 'vectra-crud'

const myPlugin = definePlugin({
  name: 'my-plugin',
  
  install(context) {
    // Plugin initialization
  },
  
  beforeMountTable(context) {
    // Hook before table mount
  },
  
  onSearch(params) {
    // Hook on search
  }
})
```

## Components

### CrudPage

Main component that combines search, table, and form.

**Props:**
- `dataSource`: IDataSource - Data source implementation
- `searchSchema`: SearchFieldSchema[] - Search form schema
- `tableSchema`: TableColumnSchema[] - Table columns schema
- `formSchema`: FormFieldSchema[] - Form fields schema
- `pageKey`: string - Unique key for persistence
- `pagination`: boolean - Enable pagination (default: true)
- `showSelection`: boolean - Show checkbox selection (default: false)
- `showIndex`: boolean - Show index column (default: true)

### SchemaSearch

Schema-driven search form component.

### SchemaTable

Schema-driven table component using VxeTable.

### SchemaForm

Schema-driven form dialog component.

## Development

```bash
# Install dependencies
pnpm install

# Development mode
pnpm dev

# Build library
pnpm build

# Run tests
pnpm test

# Lint
pnpm lint

# Format
pnpm format

# Type check
pnpm typecheck
```

## License

Apache-2.0

## Repository

https://github.com/kowyzhux/vectra-crud
