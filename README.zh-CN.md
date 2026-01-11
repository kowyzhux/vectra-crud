# Vectra CRUD

[English](./README.md) | 简体中文

一个强大、灵活且可扩展的 Vue 3 CRUD 框架，基于 Schema 驱动，支持多种 UI 框架适配。

## 特性

- 🚀 **Schema 驱动** - 通过 JSON Schema 配置生成完整的 CRUD 界面
- 🎨 **UI 框架适配** - 支持 Element Plus、Ant Design Vue、Naive UI 等
- 🔌 **插件系统** - 丰富的插件生态，支持列持久化、导入导出、虚拟滚动等
- 📦 **开箱即用** - 提供完整的组件库和最佳实践
- 🛠️ **高度可定制** - 支持自定义渲染、生命周期钩子、表单布局等
- 🔐 **权限管理** - 内置细粒度权限控制系统
- 💪 **TypeScript** - 完整的类型支持

## 安装

```bash
# npm
npm install vectra-crud

# yarn
yarn add vectra-crud

# pnpm
pnpm add vectra-crud
```

### 安装 UI 适配器

根据你使用的 UI 框架安装对应的适配器：

```bash
# Element Plus
npm install @vectra-crud/adapter-element-plus

# Ant Design Vue
npm install @vectra-crud/adapter-ant-design-vue

# Naive UI
npm install @vectra-crud/adapter-naive-ui
```

## 快速开始

### 1. 注册插件

```typescript
import { createApp } from 'vue'
import VectraCrud from 'vectra-crud'
import ElementPlusAdapter from '@vectra-crud/adapter-element-plus'
import 'vectra-crud/dist/style.css'

const app = createApp(App)

app.use(VectraCrud, {
  adapter: ElementPlusAdapter,
  // 全局配置
  api: {
    baseURL: '/api'
  }
})

app.mount('#app')
```

### 2. 基础使用

```vue
<template>
  <CrudPage :schema="schema" :data-source="dataSource" />
</template>

<script setup lang="ts">
import { CrudPage } from 'vectra-crud'
import { ref } from 'vue'

const schema = {
  fields: [
    {
      name: 'id',
      label: 'ID',
      type: 'number',
      tableConfig: { width: 80 }
    },
    {
      name: 'name',
      label: '名称',
      type: 'string',
      rules: [{ required: true, message: '请输入名称' }]
    },
    {
      name: 'email',
      label: '邮箱',
      type: 'string',
      rules: [{ type: 'email', message: '请输入有效的邮箱' }]
    },
    {
      name: 'status',
      label: '状态',
      type: 'select',
      dict: 'userStatus',
      tableConfig: { width: 100 }
    },
    {
      name: 'createTime',
      label: '创建时间',
      type: 'datetime',
      formConfig: { disabled: true }
    }
  ],
  searchFields: ['name', 'email', 'status'],
  tableConfig: {
    rowKey: 'id',
    pagination: true
  }
}

const dataSource = {
  list: async (params) => {
    const res = await fetch('/api/users', {
      method: 'POST',
      body: JSON.stringify(params)
    })
    return res.json()
  },
  create: async (data) => {
    const res = await fetch('/api/users', {
      method: 'POST',
      body: JSON.stringify(data)
    })
    return res.json()
  },
  update: async (id, data) => {
    const res = await fetch(`/api/users/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data)
    })
    return res.json()
  },
  delete: async (id) => {
    await fetch(`/api/users/${id}`, { method: 'DELETE' })
  }
}
</script>
```

## 核心组件

### CrudPage

完整的 CRUD 页面组件，集成了搜索、表格、表单等功能。

```vue
<template>
  <CrudPage
    :schema="schema"
    :data-source="dataSource"
    :plugins="plugins"
    :permission="permission"
    @before-search="handleBeforeSearch"
    @after-search="handleAfterSearch"
  >
    <!-- 自定义工具栏 -->
    <template #toolbar-left>
      <el-button type="primary">自定义按钮</el-button>
    </template>
    
    <!-- 自定义列渲染 -->
    <template #column-status="{ row }">
      <el-tag :type="row.status === 1 ? 'success' : 'danger'">
        {{ row.status === 1 ? '启用' : '禁用' }}
      </el-tag>
    </template>
    
    <!-- 自定义操作列 -->
    <template #action="{ row }">
      <el-button link @click="handleCustomAction(row)">
        自定义操作
      </el-button>
    </template>
  </CrudPage>
</template>
```

#### Props

- `schema`: Schema 配置对象
- `dataSource`: 数据源接口
- `plugins`: 插件列表
- `permission`: 权限配置
- `loading`: 加载状态
- `tableData`: 外部表格数据（覆盖内部数据）

#### Events

- `before-search`: 搜索前触发
- `after-search`: 搜索后触发
- `before-create`: 创建前触发
- `after-create`: 创建后触发
- `before-update`: 更新前触发
- `after-update`: 更新后触发
- `before-delete`: 删除前触发
- `after-delete`: 删除后触发

#### Slots

- `toolbar-left`: 工具栏左侧插槽
- `toolbar-right`: 工具栏右侧插槽
- `column-{fieldName}`: 自定义列渲染
- `action`: 操作列插槽
- `form-{fieldName}`: 自定义表单项渲染

### SchemaSearch

基于 Schema 的搜索表单组件。

```vue
<template>
  <SchemaSearch
    :schema="searchSchema"
    :model="searchModel"
    @search="handleSearch"
    @reset="handleReset"
  >
    <template #field-customField="{ field, model }">
      <CustomSearchComponent v-model="model[field.name]" />
    </template>
  </SchemaSearch>
</template>

<script setup lang="ts">
const searchSchema = {
  fields: [
    { name: 'keyword', label: '关键词', type: 'string' },
    { name: 'status', label: '状态', type: 'select', dict: 'status' },
    {
      name: 'dateRange',
      label: '日期范围',
      type: 'daterange',
      searchConfig: { span: 2 }
    }
  ],
  layout: 'inline', // inline | grid
  labelWidth: '80px'
}

const searchModel = ref({})

const handleSearch = (values) => {
  console.log('搜索参数:', values)
}

const handleReset = () => {
  console.log('重置搜索')
}
</script>
```

### SchemaTable

基于 Schema 的表格组件。

```vue
<template>
  <SchemaTable
    :schema="tableSchema"
    :data="tableData"
    :loading="loading"
    :plugins="plugins"
    @selection-change="handleSelectionChange"
    @sort-change="handleSortChange"
  >
    <template #column-avatar="{ row }">
      <el-avatar :src="row.avatar" />
    </template>
    
    <template #expand="{ row }">
      <div>扩展内容: {{ row.description }}</div>
    </template>
  </SchemaTable>
</template>

<script setup lang="ts">
const tableSchema = {
  fields: [
    { name: 'id', label: 'ID', type: 'number', width: 80 },
    { name: 'name', label: '姓名', type: 'string', sortable: true },
    { name: 'avatar', label: '头像', type: 'string' },
    { name: 'email', label: '邮箱', type: 'string' },
    { name: 'status', label: '状态', type: 'select', dict: 'status' }
  ],
  selection: true, // 启用多选
  expand: true, // 启用展开行
  rowKey: 'id',
  pagination: {
    pageSize: 20,
    pageSizes: [10, 20, 50, 100]
  }
}
</script>
```

### SchemaForm

基于 Schema 的表单组件，支持多种布局方式。

```vue
<template>
  <SchemaForm
    :schema="formSchema"
    :model="formModel"
    :layout="layout"
    @submit="handleSubmit"
    @cancel="handleCancel"
  >
    <template #field-customField="{ field, model }">
      <CustomFormComponent v-model="model[field.name]" />
    </template>
  </SchemaForm>
</template>

<script setup lang="ts">
const formSchema = {
  fields: [
    {
      name: 'name',
      label: '名称',
      type: 'string',
      rules: [{ required: true, message: '请输入名称' }],
      gridConfig: { span: 12 }
    },
    {
      name: 'email',
      label: '邮箱',
      type: 'string',
      rules: [{ type: 'email' }],
      gridConfig: { span: 12 }
    },
    {
      name: 'phone',
      label: '电话',
      type: 'string',
      gridConfig: { span: 12 }
    },
    {
      name: 'address',
      label: '地址',
      type: 'textarea',
      gridConfig: { span: 24 }
    }
  ],
  layout: 'grid', // grid | tabs | steps
  labelWidth: '100px',
  labelPosition: 'right'
}

const formModel = ref({})
const layout = ref('grid')

const handleSubmit = async (values) => {
  console.log('提交表单:', values)
}
</script>
```

### SubForm

子表单组件，用于编辑嵌套的数组数据。

```vue
<template>
  <SchemaForm :schema="schema" :model="formModel">
    <template #field-items>
      <SubForm
        v-model="formModel.items"
        :schema="subFormSchema"
        :mode="mode"
        :max="10"
      />
    </template>
  </SchemaForm>
</template>

<script setup lang="ts">
const subFormSchema = {
  fields: [
    { name: 'name', label: '名称', type: 'string', required: true },
    { name: 'quantity', label: '数量', type: 'number', required: true },
    { name: 'price', label: '价格', type: 'number', required: true },
    { name: 'amount', label: '金额', type: 'number', disabled: true }
  ]
}

const mode = ref('table') // table | card | inline

const formModel = ref({
  items: [
    { name: '商品1', quantity: 1, price: 100, amount: 100 }
  ]
})
</script>
```

### KeyValueEditor

键值对编辑器，用于编辑对象类型的数据。

```vue
<template>
  <KeyValueEditor
    v-model="config"
    :key-options="keyOptions"
    :value-type="valueType"
    :allow-add="true"
    :allow-delete="true"
  />
</template>

<script setup lang="ts">
const config = ref({
  apiUrl: 'https://api.example.com',
  timeout: '5000',
  retryCount: '3'
})

const keyOptions = [
  { label: 'API地址', value: 'apiUrl' },
  { label: '超时时间', value: 'timeout' },
  { label: '重试次数', value: 'retryCount' }
]

const valueType = 'string' // string | number | boolean | json
</script>
```

### DictSelect

字典选择器，支持本地和远程数据源。

```vue
<template>
  <DictSelect
    v-model="selectedValue"
    dict="userStatus"
    :multiple="false"
    :remote="true"
    :props="{ label: 'name', value: 'id' }"
  />
</template>

<script setup lang="ts">
import { ref } from 'vue'

const selectedValue = ref('')

// 注册字典提供者
import { useDictProvider } from 'vectra-crud'

const dictProvider = useDictProvider()

// 本地字典
dictProvider.register('userStatus', [
  { label: '启用', value: 1 },
  { label: '禁用', value: 0 }
])

// 远程字典
dictProvider.register('userRole', async () => {
  const res = await fetch('/api/dict/userRole')
  return res.json()
})
</script>
```

### Upload

上传组件，支持多种上传方式。

```vue
<template>
  <Upload
    v-model="fileList"
    :action="uploadAction"
    :max-count="5"
    :max-size="10 * 1024 * 1024"
    :accept="['image/*', '.pdf']"
    :list-type="listType"
    :before-upload="beforeUpload"
    @success="handleSuccess"
  />
</template>

<script setup lang="ts">
const fileList = ref([])
const uploadAction = '/api/upload'
const listType = ref('picture-card') // text | picture | picture-card

const beforeUpload = (file) => {
  if (file.size > 10 * 1024 * 1024) {
    ElMessage.error('文件大小不能超过 10MB')
    return false
  }
  return true
}

const handleSuccess = (response, file) => {
  console.log('上传成功:', response, file)
}
</script>
```

### IconPicker

图标选择器。

```vue
<template>
  <IconPicker
    v-model="selectedIcon"
    :icon-set="iconSet"
    :searchable="true"
  />
</template>

<script setup lang="ts">
const selectedIcon = ref('el-icon-user')
const iconSet = 'element-plus' // element-plus | ant-design | custom
</script>
```

### ColumnSetting

列设置组件，用于动态显示/隐藏表格列。

```vue
<template>
  <ColumnSetting
    v-model:columns="visibleColumns"
    :all-columns="allColumns"
    @change="handleColumnChange"
  />
</template>

<script setup lang="ts">
const allColumns = [
  { name: 'id', label: 'ID', fixed: true },
  { name: 'name', label: '姓名' },
  { name: 'email', label: '邮箱' },
  { name: 'phone', label: '电话' },
  { name: 'status', label: '状态' }
]

const visibleColumns = ref(['id', 'name', 'email', 'status'])

const handleColumnChange = (columns) => {
  console.log('列配置变更:', columns)
}
</script>
```

## 插件系统

### 列持久化插件

保存用户的列设置到本地存储。

```typescript
import { ColumnPersistPlugin } from 'vectra-crud/plugins'

const plugins = [
  ColumnPersistPlugin({
    storageKey: 'user-table-columns', // 存储键名
    storage: localStorage, // 存储对象
    expires: 7 * 24 * 60 * 60 * 1000 // 过期时间（毫秒）
  })
]
```

### 导出插件

支持导出表格数据为 Excel、CSV 等格式。

```typescript
import { ExportPlugin } from 'vectra-crud/plugins'

const plugins = [
  ExportPlugin({
    formats: ['xlsx', 'csv', 'json'], // 支持的格式
    filename: '用户数据', // 文件名
    sheetName: 'Users', // Excel 工作表名
    beforeExport: (data) => {
      // 导出前处理数据
      return data
    },
    columns: [
      { field: 'name', label: '姓名' },
      { field: 'email', label: '邮箱' },
      {
        field: 'status',
        label: '状态',
        formatter: (val) => val === 1 ? '启用' : '禁用'
      }
    ]
  })
]
```

### 导入插件

支持从 Excel、CSV 导入数据。

```typescript
import { ImportPlugin } from 'vectra-crud/plugins'

const plugins = [
  ImportPlugin({
    accept: ['.xlsx', '.xls', '.csv'], // 接受的文件类型
    template: '/templates/user-import-template.xlsx', // 导入模板
    mapping: {
      '姓名': 'name',
      '邮箱': 'email',
      '电话': 'phone'
    },
    beforeImport: (data) => {
      // 导入前验证和转换数据
      return data.map(row => ({
        ...row,
        status: row.status === '启用' ? 1 : 0
      }))
    },
    onSuccess: (result) => {
      ElMessage.success(`成功导入 ${result.success} 条，失败 ${result.failed} 条`)
    }
  })
]
```

### 行内编辑插件

支持在表格中直接编辑数据。

```typescript
import { InlineEditPlugin } from 'vectra-crud/plugins'

const plugins = [
  InlineEditPlugin({
    mode: 'cell', // cell | row
    trigger: 'click', // click | dblclick
    saveOn: 'blur', // blur | enter | manual
    editableFields: ['name', 'email', 'phone'], // 可编辑字段
    beforeEdit: (row, field) => {
      // 编辑前验证
      return true
    },
    afterEdit: async (row, field, newValue, oldValue) => {
      // 编辑后保存
      await api.updateUser(row.id, { [field]: newValue })
    }
  })
]
```

### 行展开插件

支持展开行显示详细信息。

```typescript
import { RowExpandPlugin } from 'vectra-crud/plugins'

const plugins = [
  RowExpandPlugin({
    expandRowKeys: [], // 默认展开的行
    expandOnRowClick: false, // 点击行展开
    render: (row) => {
      // 自定义展开内容渲染
      return h('div', { class: 'expand-content' }, [
        h('p', `详细描述: ${row.description}`),
        h('p', `创建时间: ${row.createTime}`)
      ])
    }
  })
]
```

### 虚拟滚动插件

优化大数据量表格性能。

```typescript
import { VirtualScrollPlugin } from 'vectra-crud/plugins'

const plugins = [
  VirtualScrollPlugin({
    height: 600, // 表格高度
    itemSize: 50, // 每行高度
    buffer: 5, // 缓冲区行数
    threshold: 100 // 启用虚拟滚动的阈值
  })
]
```

### 批量操作插件

支持批量操作选中的数据。

```typescript
import { BulkActionsPlugin } from 'vectra-crud/plugins'

const plugins = [
  BulkActionsPlugin({
    actions: [
      {
        label: '批量启用',
        type: 'primary',
        handler: async (selectedRows) => {
          await api.batchUpdateStatus(selectedRows.map(r => r.id), 1)
          ElMessage.success('批量启用成功')
        }
      },
      {
        label: '批量禁用',
        type: 'danger',
        confirm: true,
        confirmMessage: '确认批量禁用选中的用户吗？',
        handler: async (selectedRows) => {
          await api.batchUpdateStatus(selectedRows.map(r => r.id), 0)
        }
      },
      {
        label: '批量删除',
        type: 'danger',
        confirm: true,
        handler: async (selectedRows) => {
          await api.batchDelete(selectedRows.map(r => r.id))
        }
      }
    ]
  })
]
```

### 权限插件

基于权限控制按钮和操作的显示。

```typescript
import { PermissionPlugin } from 'vectra-crud/plugins'

const plugins = [
  PermissionPlugin({
    permissions: {
      create: 'user:create',
      update: 'user:update',
      delete: 'user:delete',
      export: 'user:export',
      import: 'user:import'
    },
    check: (permission) => {
      // 自定义权限检查逻辑
      return userPermissions.includes(permission)
    }
  })
]
```

## UI 适配器抽象

Vectra CRUD 通过适配器模式支持多种 UI 框架。

### 创建自定义适配器

```typescript
import { defineAdapter } from 'vectra-crud'

export default defineAdapter({
  name: 'custom-ui',
  
  components: {
    // 表单组件映射
    form: {
      string: CustomInput,
      number: CustomInputNumber,
      select: CustomSelect,
      date: CustomDatePicker,
      // ... 更多组件
    },
    
    // 表格组件
    table: CustomTable,
    tableColumn: CustomTableColumn,
    
    // 其他基础组件
    button: CustomButton,
    dialog: CustomDialog,
    message: CustomMessage
  },
  
  // 组件属性转换
  transformProps: {
    button: (props) => ({
      ...props,
      type: props.type === 'primary' ? 'default' : props.type
    })
  },
  
  // 事件名称转换
  transformEvents: {
    button: {
      click: 'onClick'
    }
  }
})
```

### 使用适配器

```typescript
import CustomAdapter from './adapters/custom-adapter'

app.use(VectraCrud, {
  adapter: CustomAdapter
})
```

## 数据源接口

数据源接口定义了与后端 API 交互的标准方法。

```typescript
import { defineDataSource } from 'vectra-crud'

const dataSource = defineDataSource({
  // 列表查询
  list: async (params) => {
    const { page, pageSize, search, sort, filters } = params
    
    const res = await fetch('/api/users', {
      method: 'POST',
      body: JSON.stringify({
        page,
        pageSize,
        ...search,
        ...filters,
        orderBy: sort?.field,
        orderDir: sort?.order
      })
    })
    
    const data = await res.json()
    
    return {
      data: data.list,
      total: data.total,
      page: data.page,
      pageSize: data.pageSize
    }
  },
  
  // 详情查询
  detail: async (id) => {
    const res = await fetch(`/api/users/${id}`)
    return res.json()
  },
  
  // 创建
  create: async (data) => {
    const res = await fetch('/api/users', {
      method: 'POST',
      body: JSON.stringify(data)
    })
    return res.json()
  },
  
  // 更新
  update: async (id, data) => {
    const res = await fetch(`/api/users/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data)
    })
    return res.json()
  },
  
  // 删除
  delete: async (id) => {
    await fetch(`/api/users/${id}`, {
      method: 'DELETE'
    })
  },
  
  // 批量删除
  batchDelete: async (ids) => {
    await fetch('/api/users/batch', {
      method: 'DELETE',
      body: JSON.stringify({ ids })
    })
  }
})
```

### RESTful 数据源助手

```typescript
import { createRestDataSource } from 'vectra-crud'

const dataSource = createRestDataSource({
  baseURL: '/api/users',
  // 自定义请求配置
  requestConfig: {
    headers: {
      'Authorization': 'Bearer token'
    }
  },
  // 响应转换
  transformResponse: (res) => ({
    data: res.data.list,
    total: res.data.total
  })
})
```

### GraphQL 数据源

```typescript
import { createGraphQLDataSource } from 'vectra-crud'

const dataSource = createGraphQLDataSource({
  endpoint: '/graphql',
  queries: {
    list: `
      query Users($page: Int, $pageSize: Int) {
        users(page: $page, pageSize: $pageSize) {
          items { id name email }
          total
        }
      }
    `,
    detail: `
      query User($id: ID!) {
        user(id: $id) { id name email phone }
      }
    `
  },
  mutations: {
    create: `
      mutation CreateUser($input: UserInput!) {
        createUser(input: $input) { id }
      }
    `,
    update: `
      mutation UpdateUser($id: ID!, $input: UserInput!) {
        updateUser(id: $id, input: $input) { id }
      }
    `
  }
})
```

## 字典提供者

字典提供者用于管理和获取字典数据。

```typescript
import { useDictProvider } from 'vectra-crud'

const dictProvider = useDictProvider()

// 注册本地字典
dictProvider.register('gender', [
  { label: '男', value: 'M' },
  { label: '女', value: 'F' }
])

// 注册远程字典
dictProvider.register('department', async () => {
  const res = await fetch('/api/dict/departments')
  return res.json()
})

// 带缓存的远程字典
dictProvider.register('role', {
  loader: async () => {
    const res = await fetch('/api/dict/roles')
    return res.json()
  },
  cache: true,
  cacheTime: 5 * 60 * 1000 // 5分钟
})

// 获取字典数据
const genders = await dictProvider.get('gender')

// 获取字典标签
const label = dictProvider.getLabel('gender', 'M') // "男"

// 刷新字典缓存
await dictProvider.refresh('role')
```

### 自定义字典提供者

```typescript
import { defineDictProvider } from 'vectra-crud'

const customDictProvider = defineDictProvider({
  async get(dictKey, params) {
    // 自定义获取逻辑
    const res = await fetch(`/api/dict/${dictKey}`, {
      method: 'POST',
      body: JSON.stringify(params)
    })
    return res.json()
  },
  
  getLabel(dictKey, value) {
    // 自定义标签获取逻辑
    const dict = this.cache.get(dictKey)
    return dict?.find(item => item.value === value)?.label
  }
})

app.use(VectraCrud, {
  dictProvider: customDictProvider
})
```

## 权限系统

Vectra CRUD 提供了细粒度的权限控制系统。

### 基础权限配置

```typescript
const permission = {
  // 页面级权限
  view: 'user:view',
  
  // 操作权限
  create: 'user:create',
  update: 'user:update',
  delete: 'user:delete',
  export: 'user:export',
  import: 'user:import',
  
  // 字段级权限
  fields: {
    salary: 'user:view:salary',
    idCard: 'user:view:idcard'
  },
  
  // 自定义权限检查
  check: (permission) => {
    return store.state.user.permissions.includes(permission)
  }
}
```

### 行级权限

```typescript
const schema = {
  fields: [...],
  permission: {
    // 行操作权限
    rowActions: {
      update: (row) => {
        // 只能编辑自己创建的数据
        return row.creatorId === currentUserId
      },
      delete: (row) => {
        // 只能删除草稿状态的数据
        return row.status === 'draft'
      }
    }
  }
}
```

### 字段权限

```typescript
const schema = {
  fields: [
    {
      name: 'salary',
      label: '薪资',
      type: 'number',
      // 字段级权限
      permission: 'user:view:salary',
      // 或使用函数
      permission: (context) => {
        return context.user.role === 'admin'
      }
    }
  ]
}
```

## 生命周期钩子

Vectra CRUD 提供了丰富的生命周期钩子。

```typescript
const hooks = {
  // 搜索生命周期
  beforeSearch: async (params) => {
    console.log('搜索前', params)
    // 可以修改搜索参数
    return { ...params, extra: 'value' }
  },
  afterSearch: (result) => {
    console.log('搜索后', result)
  },
  
  // 创建生命周期
  beforeCreate: async (data) => {
    console.log('创建前', data)
    // 数据验证
    if (!data.name) {
      throw new Error('名称不能为空')
    }
    return data
  },
  afterCreate: (result) => {
    ElMessage.success('创建成功')
  },
  
  // 更新生命周期
  beforeUpdate: async (id, data) => {
    console.log('更新前', id, data)
    return data
  },
  afterUpdate: (result) => {
    ElMessage.success('更新成功')
  },
  
  // 删除生命周期
  beforeDelete: async (id) => {
    const confirmed = await ElMessageBox.confirm('确认删除吗？')
    return confirmed
  },
  afterDelete: () => {
    ElMessage.success('删除成功')
  },
  
  // 表单生命周期
  beforeFormOpen: (type, data) => {
    console.log('表单打开前', type, data)
  },
  afterFormClose: (type, result) => {
    console.log('表单关闭后', type, result)
  },
  
  // 表单值变化
  onFieldChange: (field, value, formData) => {
    console.log('字段变化', field, value)
    // 联动逻辑
    if (field === 'country') {
      formData.province = ''
      formData.city = ''
    }
  }
}
```

## 自定义渲染

### 表格列自定义渲染

```vue
<template>
  <CrudPage :schema="schema">
    <!-- 使用插槽 -->
    <template #column-avatar="{ row, column, index }">
      <el-avatar :src="row.avatar" :size="40" />
    </template>
    
    <!-- 使用 render 函数 -->
    <template #column-status="{ row }">
      <el-tag :type="getStatusType(row.status)">
        {{ getStatusLabel(row.status) }}
      </el-tag>
    </template>
  </CrudPage>
</template>

<script setup>
// 在 Schema 中使用 render 函数
const schema = {
  fields: [
    {
      name: 'progress',
      label: '进度',
      type: 'number',
      render: (h, { row }) => {
        return h(ElProgress, {
          percentage: row.progress,
          strokeWidth: 6
        })
      }
    }
  ]
}
</script>
```

### 表单项自定义渲染

```vue
<template>
  <CrudPage :schema="schema">
    <template #form-customField="{ field, model, errors }">
      <CustomComponent
        v-model="model[field.name]"
        :error="errors[field.name]"
      />
    </template>
  </CrudPage>
</template>

<script setup>
const schema = {
  fields: [
    {
      name: 'richText',
      label: '富文本',
      type: 'custom',
      render: (h, { model, field }) => {
        return h(RichTextEditor, {
          modelValue: model[field.name],
          'onUpdate:modelValue': (val) => {
            model[field.name] = val
          }
        })
      }
    }
  ]
}
</script>
```

## 表单布局

### Grid 布局

```typescript
const schema = {
  fields: [
    {
      name: 'name',
      label: '名称',
      type: 'string',
      gridConfig: { span: 12 } // 占用 12 列（共 24 列）
    },
    {
      name: 'email',
      label: '邮箱',
      type: 'string',
      gridConfig: { span: 12 }
    },
    {
      name: 'address',
      label: '地址',
      type: 'string',
      gridConfig: { span: 24 } // 占满整行
    }
  ],
  formConfig: {
    layout: 'grid',
    grid: {
      cols: 24,
      gutter: 20
    }
  }
}
```

### Tabs 布局

```typescript
const schema = {
  fields: [
    // 基本信息 tab
    {
      name: 'name',
      label: '名称',
      type: 'string',
      tab: 'basic'
    },
    {
      name: 'email',
      label: '邮箱',
      type: 'string',
      tab: 'basic'
    },
    
    // 详细信息 tab
    {
      name: 'phone',
      label: '电话',
      type: 'string',
      tab: 'detail'
    },
    {
      name: 'address',
      label: '地址',
      type: 'string',
      tab: 'detail'
    },
    
    // 其他信息 tab
    {
      name: 'remark',
      label: '备注',
      type: 'textarea',
      tab: 'other'
    }
  ],
  formConfig: {
    layout: 'tabs',
    tabs: [
      { key: 'basic', label: '基本信息', icon: 'el-icon-user' },
      { key: 'detail', label: '详细信息', icon: 'el-icon-document' },
      { key: 'other', label: '其他信息', icon: 'el-icon-more' }
    ]
  }
}
```

### Steps 布局

```typescript
const schema = {
  fields: [
    // 第一步
    {
      name: 'name',
      label: '名称',
      type: 'string',
      step: 0
    },
    {
      name: 'type',
      label: '类型',
      type: 'select',
      step: 0
    },
    
    // 第二步
    {
      name: 'config',
      label: '配置',
      type: 'json',
      step: 1
    },
    
    // 第三步
    {
      name: 'confirm',
      label: '确认信息',
      type: 'custom',
      step: 2,
      render: (h, { model }) => {
        return h('div', [
          h('p', `名称: ${model.name}`),
          h('p', `类型: ${model.type}`)
        ])
      }
    }
  ],
  formConfig: {
    layout: 'steps',
    steps: [
      { title: '基本信息', description: '填写基本信息' },
      { title: '详细配置', description: '填写详细配置' },
      { title: '确认提交', description: '确认并提交' }
    ]
  }
}
```

### 表单容器模式

#### Dialog 模式（默认）

```typescript
const schema = {
  formConfig: {
    mode: 'dialog',
    dialog: {
      width: '800px',
      title: {
        create: '新增用户',
        update: '编辑用户'
      },
      fullscreen: false,
      draggable: true
    }
  }
}
```

#### Drawer 模式

```typescript
const schema = {
  formConfig: {
    mode: 'drawer',
    drawer: {
      size: '60%',
      direction: 'rtl', // rtl | ltr | ttb | btt
      title: {
        create: '新增用户',
        update: '编辑用户'
      }
    }
  }
}
```

#### Inline 模式

```typescript
const schema = {
  formConfig: {
    mode: 'inline',
    // 表单直接显示在页面中，不使用弹窗
  }
}
```

## 子表编辑

子表编辑用于处理一对多关系的数据。

### Table 模式

```vue
<template>
  <SchemaForm :schema="schema" :model="formModel" />
</template>

<script setup>
const schema = {
  fields: [
    {
      name: 'orderNo',
      label: '订单号',
      type: 'string'
    },
    {
      name: 'items',
      label: '订单明细',
      type: 'subform',
      subform: {
        mode: 'table',
        fields: [
          { name: 'productName', label: '商品名称', type: 'string' },
          { name: 'quantity', label: '数量', type: 'number' },
          { name: 'price', label: '单价', type: 'number' },
          {
            name: 'amount',
            label: '金额',
            type: 'number',
            disabled: true,
            computed: (row) => row.quantity * row.price
          }
        ],
        min: 1,
        max: 20,
        addText: '添加明细',
        deleteConfirm: true
      }
    }
  ]
}

const formModel = ref({
  orderNo: 'ORD20260111001',
  items: []
})
</script>
```

### Card 模式

```typescript
const schema = {
  fields: [
    {
      name: 'contacts',
      label: '联系人',
      type: 'subform',
      subform: {
        mode: 'card',
        fields: [
          { name: 'name', label: '姓名', type: 'string' },
          { name: 'phone', label: '电话', type: 'string' },
          { name: 'email', label: '邮箱', type: 'string' },
          { name: 'isPrimary', label: '主要联系人', type: 'switch' }
        ],
        cardTitle: (row, index) => `联系人 ${index + 1}`,
        collapsible: true
      }
    }
  ]
}
```

### Inline 模式

```typescript
const schema = {
  fields: [
    {
      name: 'tags',
      label: '标签',
      type: 'subform',
      subform: {
        mode: 'inline',
        fields: [
          { name: 'name', label: '标签名', type: 'string' },
          { name: 'color', label: '颜色', type: 'color' }
        ],
        addText: '添加标签'
      }
    }
  ]
}
```

## 完整示例

### 用户管理示例

```vue
<template>
  <CrudPage
    :schema="schema"
    :data-source="dataSource"
    :plugins="plugins"
    :permission="permission"
    @before-create="handleBeforeCreate"
    @after-create="handleAfterCreate"
  >
    <template #toolbar-left>
      <el-button type="success" @click="handleBatchImport">
        批量导入
      </el-button>
    </template>
    
    <template #column-avatar="{ row }">
      <el-avatar :src="row.avatar" :size="40">
        {{ row.name.charAt(0) }}
      </el-avatar>
    </template>
    
    <template #column-status="{ row }">
      <el-switch
        v-model="row.status"
        :active-value="1"
        :inactive-value="0"
        @change="handleStatusChange(row)"
      />
    </template>
    
    <template #action="{ row }">
      <el-button link type="primary" @click="handleResetPassword(row)">
        重置密码
      </el-button>
    </template>
  </CrudPage>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { CrudPage } from 'vectra-crud'
import {
  ColumnPersistPlugin,
  ExportPlugin,
  ImportPlugin,
  BulkActionsPlugin,
  PermissionPlugin
} from 'vectra-crud/plugins'

const schema = {
  fields: [
    {
      name: 'id',
      label: 'ID',
      type: 'number',
      tableConfig: { width: 80, fixed: 'left' },
      formConfig: { hidden: true }
    },
    {
      name: 'avatar',
      label: '头像',
      type: 'upload',
      tableConfig: { width: 80 },
      formConfig: {
        uploadConfig: {
          action: '/api/upload',
          listType: 'picture-card',
          limit: 1
        }
      }
    },
    {
      name: 'name',
      label: '姓名',
      type: 'string',
      rules: [{ required: true, message: '请输入姓名' }],
      tableConfig: { width: 120, sortable: true },
      searchConfig: { show: true }
    },
    {
      name: 'username',
      label: '用户名',
      type: 'string',
      rules: [
        { required: true, message: '请输入用户名' },
        { min: 4, max: 20, message: '长度在 4 到 20 个字符' }
      ],
      tableConfig: { width: 120 },
      searchConfig: { show: true }
    },
    {
      name: 'email',
      label: '邮箱',
      type: 'string',
      rules: [{ type: 'email', message: '请输入有效的邮箱' }],
      tableConfig: { width: 180 }
    },
    {
      name: 'phone',
      label: '电话',
      type: 'string',
      rules: [{ pattern: /^1[3-9]\d{9}$/, message: '请输入有效的手机号' }],
      tableConfig: { width: 120 }
    },
    {
      name: 'department',
      label: '部门',
      type: 'select',
      dict: 'department',
      tableConfig: { width: 120 },
      searchConfig: { show: true }
    },
    {
      name: 'role',
      label: '角色',
      type: 'select',
      dict: 'role',
      multiple: true,
      tableConfig: { width: 150 },
      searchConfig: { show: true }
    },
    {
      name: 'status',
      label: '状态',
      type: 'select',
      dict: 'userStatus',
      tableConfig: { width: 100 },
      searchConfig: { show: true }
    },
    {
      name: 'createTime',
      label: '创建时间',
      type: 'datetime',
      tableConfig: { width: 160, sortable: true },
      formConfig: { hidden: true },
      searchConfig: {
        show: true,
        type: 'daterange'
      }
    },
    {
      name: 'remark',
      label: '备注',
      type: 'textarea',
      tableConfig: { hidden: true },
      formConfig: { span: 24 }
    }
  ],
  
  formConfig: {
    layout: 'tabs',
    tabs: [
      { key: 'basic', label: '基本信息' },
      { key: 'detail', label: '详细信息' },
      { key: 'permission', label: '权限配置' }
    ],
    labelWidth: '100px'
  },
  
  tableConfig: {
    rowKey: 'id',
    selection: true,
    pagination: {
      pageSize: 20,
      pageSizes: [10, 20, 50, 100]
    }
  }
}

const dataSource = {
  list: async (params) => {
    const res = await fetch('/api/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params)
    })
    return res.json()
  },
  
  detail: async (id) => {
    const res = await fetch(`/api/users/${id}`)
    return res.json()
  },
  
  create: async (data) => {
    const res = await fetch('/api/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    })
    return res.json()
  },
  
  update: async (id, data) => {
    const res = await fetch(`/api/users/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    })
    return res.json()
  },
  
  delete: async (id) => {
    await fetch(`/api/users/${id}`, { method: 'DELETE' })
  }
}

const plugins = [
  ColumnPersistPlugin({ storageKey: 'user-table-columns' }),
  ExportPlugin({ filename: '用户数据' }),
  ImportPlugin({ template: '/templates/user-import.xlsx' }),
  BulkActionsPlugin({
    actions: [
      {
        label: '批量启用',
        type: 'primary',
        handler: async (rows) => {
          await batchUpdateStatus(rows.map(r => r.id), 1)
        }
      },
      {
        label: '批量禁用',
        type: 'warning',
        handler: async (rows) => {
          await batchUpdateStatus(rows.map(r => r.id), 0)
        }
      },
      {
        label: '批量删除',
        type: 'danger',
        confirm: true,
        handler: async (rows) => {
          await batchDelete(rows.map(r => r.id))
        }
      }
    ]
  }),
  PermissionPlugin({
    permissions: {
      create: 'user:create',
      update: 'user:update',
      delete: 'user:delete',
      export: 'user:export',
      import: 'user:import'
    }
  })
]

const permission = {
  create: 'user:create',
  update: 'user:update',
  delete: 'user:delete',
  export: 'user:export',
  import: 'user:import'
}

const handleBeforeCreate = (data) => {
  console.log('创建前', data)
}

const handleAfterCreate = (result) => {
  ElMessage.success('创建成功')
}

const handleStatusChange = async (row) => {
  try {
    await fetch(`/api/users/${row.id}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status: row.status })
    })
    ElMessage.success('状态更新成功')
  } catch (error) {
    ElMessage.error('状态更新失败')
    row.status = row.status === 1 ? 0 : 1
  }
}

const handleResetPassword = async (row) => {
  await ElMessageBox.confirm('确认重置该用户密码吗？')
  await fetch(`/api/users/${row.id}/reset-password`, { method: 'POST' })
  ElMessage.success('密码重置成功')
}

const handleBatchImport = () => {
  // 批量导入逻辑
}
</script>
```

### 订单管理示例（含子表）

```vue
<template>
  <CrudPage
    :schema="schema"
    :data-source="dataSource"
  >
    <template #column-totalAmount="{ row }">
      <span style="color: #f56c6c; font-weight: bold;">
        ¥{{ row.totalAmount.toFixed(2) }}
      </span>
    </template>
  </CrudPage>
</template>

<script setup lang="ts">
const schema = {
  fields: [
    {
      name: 'orderNo',
      label: '订单号',
      type: 'string',
      formConfig: { disabled: true, default: () => generateOrderNo() }
    },
    {
      name: 'customer',
      label: '客户',
      type: 'select',
      dict: 'customer',
      rules: [{ required: true }]
    },
    {
      name: 'orderDate',
      label: '订单日期',
      type: 'date',
      rules: [{ required: true }],
      formConfig: { default: () => new Date() }
    },
    {
      name: 'items',
      label: '订单明细',
      type: 'subform',
      rules: [
        { required: true, message: '至少添加一条明细' },
        { min: 1, message: '至少添加一条明细' }
      ],
      subform: {
        mode: 'table',
        fields: [
          {
            name: 'product',
            label: '商品',
            type: 'select',
            dict: 'product',
            rules: [{ required: true }],
            width: 200
          },
          {
            name: 'quantity',
            label: '数量',
            type: 'number',
            rules: [{ required: true, min: 1 }],
            width: 100,
            formConfig: { min: 1, precision: 0 }
          },
          {
            name: 'price',
            label: '单价',
            type: 'number',
            rules: [{ required: true, min: 0 }],
            width: 120,
            formConfig: { min: 0, precision: 2 }
          },
          {
            name: 'amount',
            label: '金额',
            type: 'number',
            width: 120,
            disabled: true,
            computed: (row) => (row.quantity || 0) * (row.price || 0)
          }
        ],
        min: 1,
        summary: {
          show: true,
          fields: ['amount'],
          formatter: (field, values) => {
            if (field === 'amount') {
              const total = values.reduce((sum, val) => sum + (val || 0), 0)
              return `总计: ¥${total.toFixed(2)}`
            }
          }
        }
      }
    },
    {
      name: 'totalAmount',
      label: '订单总额',
      type: 'number',
      formConfig: { disabled: true },
      computed: (formData) => {
        return formData.items?.reduce((sum, item) => {
          return sum + (item.quantity || 0) * (item.price || 0)
        }, 0) || 0
      }
    },
    {
      name: 'remark',
      label: '备注',
      type: 'textarea',
      formConfig: { span: 24 }
    }
  ],
  
  formConfig: {
    layout: 'grid',
    labelWidth: '100px'
  }
}

const generateOrderNo = () => {
  const now = new Date()
  const timestamp = now.getTime()
  return `ORD${timestamp}`
}
</script>
```

## 贡献

欢迎贡献代码、报告问题或提出建议！

## 许可证

MIT License

## 相关链接

- [文档](https://vectra-crud.dev)
- [GitHub](https://github.com/kowyzhux/vectra-crud)
- [示例](https://vectra-crud.dev/examples)
- [变更日志](./CHANGELOG.md)