# Getting Started with vectra-crud

## Quick Start Guide

### 1. Installation

```bash
npm install vectra-crud
npm install vue@^3.3.0 element-plus@^2.4.0
```

### 2. Import and Setup

```typescript
// main.ts
import { createApp } from 'vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import App from './App.vue'

const app = createApp(App)
app.use(ElementPlus)
app.mount('#app')
```

### 3. Create Your First CRUD Page

#### Step 1: Define Schema

```typescript
// user-schema.ts
import { CrudSchema } from 'vectra-crud'

export const userSchema: CrudSchema = {
  // Search fields
  search: [
    { prop: 'username', label: 'Username', type: 'input' },
    { prop: 'email', label: 'Email', type: 'input' },
    { 
      prop: 'status', 
      label: 'Status', 
      type: 'select',
      options: [
        { label: 'Active', value: 1 },
        { label: 'Inactive', value: 0 }
      ]
    }
  ],
  
  // Table columns
  table: [
    { prop: 'id', label: 'ID', width: 80 },
    { prop: 'username', label: 'Username' },
    { prop: 'email', label: 'Email' },
    { prop: 'status', label: 'Status', type: 'dict', dictCode: 'user_status' }
  ],
  
  // Form fields
  form: [
    { 
      prop: 'username', 
      label: 'Username', 
      type: 'input',
      required: true 
    },
    { 
      prop: 'email', 
      label: 'Email', 
      type: 'input',
      required: true 
    },
    { 
      prop: 'status', 
      label: 'Status', 
      type: 'select',
      defaultValue: 1,
      options: [
        { label: 'Active', value: 1 },
        { label: 'Inactive', value: 0 }
      ]
    }
  ]
}
```

#### Step 2: Implement Data Source

```typescript
// user-datasource.ts
import { IDataSource } from 'vectra-crud'

export const userDataSource: IDataSource = {
  async list(params) {
    // Call your API
    const response = await fetch('/api/users?' + new URLSearchParams(params))
    return response.json()
  },
  
  async save(data) {
    const method = data.id ? 'PUT' : 'POST'
    const url = data.id ? `/api/users/${data.id}` : '/api/users'
    const response = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    })
    return response.json()
  },
  
  async remove(ids) {
    const idArray = Array.isArray(ids) ? ids : [ids]
    await fetch('/api/users', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ids: idArray })
    })
  }
}
```

#### Step 3: Create Page Component

```vue
<!-- UserPage.vue -->
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
import { 
  CrudProvider, 
  DictProvider, 
  CrudPage,
  createExportPlugin,
  createColumnPersistPlugin
} from 'vectra-crud'
import { userSchema, userDataSource } from './user'

// Configure CRUD with plugins
const crudConfig = {
  plugins: [
    createExportPlugin(),
    createColumnPersistPlugin()
  ],
  hooks: {
    afterSave: () => console.log('User saved!')
  }
}

// Dictionary loader
const dictLoader = async (code) => {
  if (code === 'user_status') {
    return [
      { label: 'Active', value: 1, color: 'success' },
      { label: 'Inactive', value: 0, color: 'info' }
    ]
  }
  return []
}

// Toolbar actions
const toolbarActions = [
  {
    key: 'add',
    label: 'Add User',
    type: 'primary',
    handler: (context) => {
      // CrudPage handles this automatically
    }
  }
]

// Row actions
const rowActions = [
  {
    key: 'edit',
    label: 'Edit',
    type: 'primary',
    handler: (context) => {
      // CrudPage handles this automatically
    }
  },
  {
    key: 'delete',
    label: 'Delete',
    type: 'danger',
    confirm: true,
    handler: async (context) => {
      await context.refresh()
    }
  }
]
</script>
```

## Advanced Features

### Custom Rendering with Slots

```vue
<template>
  <CrudPage :schema="schema" :data-source="dataSource">
    <!-- Custom search field -->
    <template #search-username="{ field, model }">
      <el-input 
        v-model="model[field.prop]" 
        prefix-icon="User"
        clearable
      />
    </template>
    
    <!-- Custom table column -->
    <template #table-avatar="{ row }">
      <el-avatar :src="row.avatar" />
    </template>
    
    <!-- Custom form field -->
    <template #form-bio="{ field, model }">
      <el-input 
        v-model="model[field.prop]" 
        type="textarea"
        :rows="4"
      />
    </template>
  </CrudPage>
</template>
```

### Using Render Functions

```typescript
import { h } from 'vue'
import { ElTag } from 'element-plus'

const schema: CrudSchema = {
  table: [
    {
      prop: 'status',
      label: 'Status',
      render: (value) => h(
        ElTag, 
        { type: value ? 'success' : 'danger' },
        () => value ? 'Active' : 'Inactive'
      )
    }
  ]
}
```

### Permission Control

```vue
<script setup lang="ts">
import { providePermissionContext } from 'vectra-crud'

// Provide user permissions
providePermissionContext(['user:create', 'user:update', 'user:delete'])

const toolbarActions = [
  {
    key: 'add',
    label: 'Add User',
    permission: 'user:create',
    hidden: (context) => !context.hasPermission('user:create'),
    handler: () => {}
  }
]
</script>
```

### Using Plugins

```typescript
import {
  createColumnPersistPlugin,
  createExportPlugin,
  createBatchActionsPlugin
} from 'vectra-crud'

const crudConfig = {
  plugins: [
    // Save column settings to localStorage
    createColumnPersistPlugin({
      storageKey: 'my-table-columns'
    }),
    
    // Export to CSV/JSON
    createExportPlugin({
      filename: 'export',
      format: 'csv'
    }),
    
    // Enable batch operations
    createBatchActionsPlugin({
      showBar: true
    })
  ]
}
```

### Lifecycle Hooks

```typescript
const crudConfig = {
  hooks: {
    // Before loading data
    beforeLoad: async (params) => {
      console.log('Loading with params:', params)
      return true // Return false to cancel
    },
    
    // After loading data
    afterLoad: async (result) => {
      console.log('Loaded:', result.total, 'items')
    },
    
    // Before saving
    beforeSave: async (data) => {
      // Validate or transform data
      if (!data.email.includes('@')) {
        throw new Error('Invalid email')
      }
      return true
    },
    
    // After saving
    afterSave: async (data) => {
      console.log('Saved:', data)
    },
    
    // Error handling
    onError: async (error) => {
      console.error('Error:', error)
    }
  }
}
```

### Nested Forms (SubForm)

```typescript
const schema: CrudSchema = {
  form: [
    {
      prop: 'contacts',
      label: 'Contacts',
      type: 'custom',
      render: () => h(SubForm, {
        schema: [
          { prop: 'name', label: 'Name', type: 'input' },
          { prop: 'phone', label: 'Phone', type: 'input' }
        ]
      })
    }
  ]
}
```

### Key-Value Editor

```vue
<template>
  <SchemaForm :schema="schema">
    <template #metadata>
      <KVEditor v-model="metadata" />
    </template>
  </SchemaForm>
</template>
```

## Common Patterns

### Pattern 1: Master-Detail

```vue
<template>
  <CrudPage
    :schema="orderSchema"
    :data-source="orderDataSource"
  >
    <template #table-items="{ row }">
      <el-table :data="row.items">
        <el-table-column prop="name" label="Item" />
        <el-table-column prop="qty" label="Quantity" />
      </el-table>
    </template>
  </CrudPage>
</template>
```

### Pattern 2: Inline Actions

```typescript
const rowActions = [
  {
    key: 'approve',
    label: 'Approve',
    type: 'success',
    confirm: true,
    confirmMessage: (context) => 
      `Approve order #${context.row.orderNo}?`,
    handler: async (context) => {
      await fetch(`/api/orders/${context.row.id}/approve`, {
        method: 'POST'
      })
      await context.refresh()
    }
  }
]
```

### Pattern 3: Conditional Fields

```typescript
const schema: CrudSchema = {
  form: [
    {
      prop: 'type',
      label: 'Type',
      type: 'select',
      options: [
        { label: 'Individual', value: 1 },
        { label: 'Company', value: 2 }
      ]
    },
    {
      prop: 'companyName',
      label: 'Company Name',
      type: 'input',
      // Only show for company type
      hidden: (row) => row.type !== 2
    }
  ]
}
```

## Tips & Best Practices

1. **Schema Organization**: Keep schemas in separate files for maintainability
2. **Type Safety**: Use TypeScript types from vectra-crud for better IntelliSense
3. **Error Handling**: Always implement the `onError` hook for user feedback
4. **Performance**: Use virtual scroll plugin for large datasets
5. **Reusability**: Create custom plugins for common functionality
6. **Testing**: Mock IDataSource for unit tests
7. **Styling**: Extend CSS classes for custom theming

## Troubleshooting

### Issue: Types not recognized
**Solution**: Ensure TypeScript includes the library's type definitions
```json
{
  "compilerOptions": {
    "types": ["vectra-crud"]
  }
}
```

### Issue: Build errors with Element Plus
**Solution**: Make sure Element Plus is installed as a peer dependency
```bash
npm install element-plus@^2.4.0
```

### Issue: Plugins not working
**Solution**: Register plugins in CrudProvider config
```typescript
const crudConfig = {
  plugins: [createExportPlugin()]
}
```

## Next Steps

- Explore the [examples/](./examples/) directory
- Read the [API Documentation](./README.md)
- Check out [TODO list](./README.md#todo) for upcoming features
- Contribute to the project!

## Support

- GitHub Issues: https://github.com/kowyzhux/vectra-crud/issues
- Documentation: [README.md](./README.md)
- Examples: [examples/](./examples/)
