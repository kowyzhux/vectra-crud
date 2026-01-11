# Basic Usage Example

This example demonstrates the basic usage of the vectra-crud library.

```vue
<template>
  <div id="app">
    <crud-page
      :data-source="dataSource"
      :search-schema="searchSchema"
      :table-schema="tableSchema"
      :form-schema="formSchema"
      page-key="users"
    />
  </div>
</template>

<script setup lang="ts">
import { CrudPage, createMockDataSource, provideCrudProvider, elementPlusAdapter } from 'vectra-crud'
import 'vectra-crud/style.css'
import 'element-plus/dist/index.css'
import 'vxe-table/lib/style.css'

// Setup provider with Element Plus adapter
provideCrudProvider({
  uiAdapter: elementPlusAdapter
})

// Create mock data source
const mockData = [
  { id: 1, name: 'John Doe', email: 'john@example.com', status: 'active', age: 28 },
  { id: 2, name: 'Jane Smith', email: 'jane@example.com', status: 'inactive', age: 34 },
  { id: 3, name: 'Bob Johnson', email: 'bob@example.com', status: 'active', age: 45 },
  { id: 4, name: 'Alice Brown', email: 'alice@example.com', status: 'active', age: 29 },
  { id: 5, name: 'Charlie Wilson', email: 'charlie@example.com', status: 'inactive', age: 52 }
]

const dataSource = createMockDataSource(mockData)

// Define search schema
const searchSchema = [
  {
    prop: 'name',
    label: 'Name',
    type: 'input',
    placeholder: 'Enter name to search'
  },
  {
    prop: 'status',
    label: 'Status',
    type: 'select',
    placeholder: 'Select status',
    options: [
      { label: 'Active', value: 'active' },
      { label: 'Inactive', value: 'inactive' }
    ]
  }
]

// Define table schema
const tableSchema = [
  { 
    prop: 'id', 
    label: 'ID', 
    width: 80,
    sortable: true
  },
  { 
    prop: 'name', 
    label: 'Name', 
    minWidth: 120,
    sortable: true
  },
  { 
    prop: 'email', 
    label: 'Email', 
    minWidth: 180
  },
  { 
    prop: 'age', 
    label: 'Age', 
    width: 100,
    sortable: true
  },
  { 
    prop: 'status', 
    label: 'Status', 
    width: 120,
    type: 'dict',
    formatter: (row, column, cellValue) => {
      return cellValue === 'active' ? 'Active' : 'Inactive'
    }
  }
]

// Define form schema
const formSchema = [
  {
    prop: 'id',
    label: 'ID',
    type: 'number',
    disabled: true
  },
  {
    prop: 'name',
    label: 'Name',
    type: 'input',
    required: true,
    placeholder: 'Enter user name'
  },
  {
    prop: 'email',
    label: 'Email',
    type: 'input',
    required: true,
    placeholder: 'Enter email address'
  },
  {
    prop: 'age',
    label: 'Age',
    type: 'number',
    required: true,
    min: 18,
    max: 100,
    placeholder: 'Enter age'
  },
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

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  padding: 20px;
}
</style>
```

## Features Demonstrated

1. **Search Form**: Schema-driven search with text input and select dropdown
2. **Data Table**: Sortable columns, pagination, and formatted cells
3. **Form Dialog**: Add/Edit form with validation
4. **Mock Data Source**: Simple in-memory data source for testing

## Customization

### Custom Row Actions

```vue
<crud-page
  :data-source="dataSource"
  :search-schema="searchSchema"
  :table-schema="tableSchema"
  :form-schema="formSchema"
>
  <template #row-actions="{ row }">
    <el-button type="primary" text @click="handleCustomAction(row)">
      Custom
    </el-button>
    <el-button type="danger" text @click="handleDelete(row)">
      Delete
    </el-button>
  </template>
</crud-page>
```

### Custom Toolbar

```vue
<crud-page
  :data-source="dataSource"
  :search-schema="searchSchema"
  :table-schema="tableSchema"
  :form-schema="formSchema"
>
  <template #toolbar-right>
    <el-button @click="handleExport">Export</el-button>
    <el-button @click="handleImport">Import</el-button>
  </template>
</crud-page>
```

### With Plugins

```typescript
import { 
  provideCrudProvider,
  columnPersistPlugin,
  virtualScrollPlugin 
} from 'vectra-crud'

provideCrudProvider({
  plugins: [
    columnPersistPlugin,
    virtualScrollPlugin
  ]
})
```
