# Vectra CRUD

[English](./README.md) | 简体中文

一个强大的、基于 Schema 驱动的 Vue 3 CRUD 组件库,提供开箱即用的增删改查功能。

## ✨ 特性

- 🚀 **Schema 驱动**: 通过 JSON Schema 配置即可生成完整的 CRUD 界面
- 🎨 **多 UI 框架支持**: 支持 Element Plus、Ant Design Vue、Naive UI 等
- 🔌 **插件系统**: 丰富的插件支持,包括导出、导入、虚拟滚动、行展开等
- 📦 **组件丰富**: 提供搜索、表格、表单、子表单等多种组件
- 🛠️ **高度可定制**: 支持自定义渲染、生命周期钩子、字典系统等
- 💪 **TypeScript**: 完整的类型支持
- 🎯 **易于使用**: 简洁的 API 设计,快速上手

## 📦 安装

```bash
# npm
npm install vectra-crud

# yarn
yarn add vectra-crud

# pnpm
pnpm add vectra-crud
```

### 安装 UI 适配器

根据你使用的 UI 框架安装对应的适配器:

```bash
# Element Plus
npm install @vectra-crud/element-plus

# Ant Design Vue
npm install @vectra-crud/ant-design-vue

# Naive UI
npm install @vectra-crud/naive-ui
```

## 🚀 快速开始

### 1. 注册插件

```typescript
import { createApp } from 'vue'
import VectraCrud from 'vectra-crud'
import ElementPlusAdapter from '@vectra-crud/element-plus'
import 'vectra-crud/dist/style.css'

const app = createApp(App)

app.use(VectraCrud, {
  adapter: ElementPlusAdapter
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

const schema = {
  columns: [
    {
      prop: 'id',
      label: 'ID',
      type: 'number',
      tableProps: { width: 80 }
    },
    {
      prop: 'name',
      label: '姓名',
      type: 'string',
      searchable: true,
      required: true
    },
    {
      prop: 'email',
      label: '邮箱',
      type: 'string',
      searchable: true
    },
    {
      prop: 'age',
      label: '年龄',
      type: 'number'
    },
    {
      prop: 'status',
      label: '状态',
      type: 'dict',
      dict: 'userStatus',
      searchable: true
    }
  ]
}

const dataSource = {
  search: async (params) => {
    const response = await fetch('/api/users', {
      method: 'POST',
      body: JSON.stringify(params)
    })
    return response.json()
  },
  create: async (data) => {
    const response = await fetch('/api/users', {
      method: 'POST',
      body: JSON.stringify(data)
    })
    return response.json()
  },
  update: async (id, data) => {
    const response = await fetch(`/api/users/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data)
    })
    return response.json()
  },
  delete: async (id) => {
    await fetch(`/api/users/${id}`, {
      method: 'DELETE'
    })
  }
}
</script>
```

## 🎯 核心概念

### Schema 配置

Schema 是 Vectra CRUD 的核心,它定义了数据的结构、验证规则、显示方式等:

```typescript
interface ColumnSchema {
  prop: string                    // 字段名
  label: string                   // 显示标签
  type: ColumnType               // 字段类型
  searchable?: boolean           // 是否可搜索
  required?: boolean             // 是否必填
  defaultValue?: any            // 默认值
  tableProps?: object           // 表格列属性
  formProps?: object            // 表单项属性
  searchProps?: object          // 搜索项属性
  dict?: string                 // 字典标识
  render?: Function             // 自定义渲染函数
  rules?: ValidationRule[]      // 验证规则
  [key: string]: any           // 其他自定义属性
}

type ColumnType = 
  | 'string' 
  | 'number' 
  | 'boolean' 
  | 'date' 
  | 'datetime'
  | 'dict' 
  | 'textarea' 
  | 'upload'
  | 'icon'
  // ... 更多类型
```

### 数据源 (DataSource)

DataSource 定义了如何获取和操作数据:

```typescript
interface DataSource {
  search: (params: SearchParams) => Promise<PageResult>
  detail?: (id: any) => Promise<any>
  create?: (data: any) => Promise<any>
  update?: (id: any, data: any) => Promise<any>
  delete?: (id: any) => Promise<void>
  bulkDelete?: (ids: any[]) => Promise<void>
}

interface SearchParams {
  page: number
  pageSize: number
  search?: Record<string, any>
  sort?: { prop: string; order: 'asc' | 'desc' }
}

interface PageResult {
  list: any[]
  total: number
}
```

### 字典系统

字典用于管理下拉选项、标签显示等:

```typescript
import { defineDict } from 'vectra-crud'

// 静态字典
defineDict('userStatus', [
  { label: '正常', value: 1, type: 'success' },
  { label: '禁用', value: 0, type: 'danger' }
])

// 动态字典
defineDict('department', async () => {
  const response = await fetch('/api/departments')
  return response.json()
})
```

## 📋 组件详解

### CrudPage

完整的 CRUD 页面组件,集成了搜索、表格、表单等功能。

```vue
<template>
  <CrudPage
    :schema="schema"
    :data-source="dataSource"
    :plugins="plugins"
    :table-props="tableProps"
    :form-props="formProps"
    @create-success="onCreateSuccess"
    @update-success="onUpdateSuccess"
    @delete-success="onDeleteSuccess"
  />
</template>

<script setup lang="ts">
const plugins = [
  'columnPersist',
  'export',
  'import',
  'inlineEdit',
  'rowExpand',
  'virtualScroll',
  'bulkActions',
  'permissions'
]

const tableProps = {
  stripe: true,
  border: true,
  size: 'default'
}

const formProps = {
  labelWidth: '120px',
  layout: 'vertical' // horizontal | vertical | inline
}

const onCreateSuccess = (data) => {
  console.log('创建成功:', data)
}
</script>
```

### SchemaSearch

基于 Schema 的搜索组件。

```vue
<template>
  <SchemaSearch
    :schema="searchSchema"
    :model-value="searchParams"
    @update:model-value="onSearchChange"
    @search="onSearch"
    @reset="onReset"
  />
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { SchemaSearch } from 'vectra-crud'

const searchSchema = {
  columns: [
    {
      prop: 'name',
      label: '姓名',
      type: 'string',
      searchProps: {
        placeholder: '请输入姓名'
      }
    },
    {
      prop: 'status',
      label: '状态',
      type: 'dict',
      dict: 'userStatus'
    },
    {
      prop: 'dateRange',
      label: '创建时间',
      type: 'daterange'
    }
  ]
}

const searchParams = ref({})

const onSearch = (params) => {
  console.log('搜索参数:', params)
  // 执行搜索逻辑
}

const onReset = () => {
  searchParams.value = {}
}
</script>
```

### SchemaTable

基于 Schema 的表格组件。

```vue
<template>
  <SchemaTable
    :schema="schema"
    :data="tableData"
    :loading="loading"
    :pagination="pagination"
    :selection="true"
    @selection-change="onSelectionChange"
    @sort-change="onSortChange"
    @page-change="onPageChange"
  >
    <template #operation="{ row }">
      <el-button @click="handleEdit(row)">编辑</el-button>
      <el-button @click="handleDelete(row)">删除</el-button>
    </template>
  </SchemaTable>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { SchemaTable } from 'vectra-crud'

const tableData = ref([])
const loading = ref(false)
const pagination = ref({
  page: 1,
  pageSize: 10,
  total: 0
})

const onSelectionChange = (selection) => {
  console.log('选中的行:', selection)
}

const onSortChange = ({ prop, order }) => {
  console.log('排序变化:', prop, order)
}

const onPageChange = ({ page, pageSize }) => {
  pagination.value.page = page
  pagination.value.pageSize = pageSize
  // 重新加载数据
}
</script>
```

### SchemaForm

基于 Schema 的表单组件。

```vue
<template>
  <SchemaForm
    ref="formRef"
    :schema="formSchema"
    :model-value="formData"
    :mode="mode"
    :layout="layout"
    @update:model-value="onFormChange"
    @validate="onValidate"
  />
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { SchemaForm } from 'vectra-crud'

const formRef = ref()
const formData = ref({})

const formSchema = {
  columns: [
    {
      prop: 'name',
      label: '姓名',
      type: 'string',
      required: true,
      rules: [
        { required: true, message: '请输入姓名' },
        { min: 2, max: 20, message: '长度在 2 到 20 个字符' }
      ]
    },
    {
      prop: 'email',
      label: '邮箱',
      type: 'string',
      rules: [
        { type: 'email', message: '请输入正确的邮箱地址' }
      ]
    },
    {
      prop: 'age',
      label: '年龄',
      type: 'number',
      formProps: {
        min: 1,
        max: 150
      }
    }
  ]
}

const mode = ref('create') // create | edit | view
const layout = ref('horizontal') // horizontal | vertical | inline

const onFormChange = (data) => {
  formData.value = data
}

const onValidate = async () => {
  const valid = await formRef.value.validate()
  if (valid) {
    console.log('表单验证通过:', formData.value)
  }
}
</script>
```

### SubForm

子表单组件,用于处理一对多关系。

```vue
<template>
  <SubForm
    :schema="subFormSchema"
    :model-value="subFormData"
    @update:model-value="onSubFormChange"
  />
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { SubForm } from 'vectra-crud'

const subFormData = ref([])

const subFormSchema = {
  columns: [
    {
      prop: 'product',
      label: '产品',
      type: 'dict',
      dict: 'products',
      required: true
    },
    {
      prop: 'quantity',
      label: '数量',
      type: 'number',
      required: true,
      formProps: { min: 1 }
    },
    {
      prop: 'price',
      label: '单价',
      type: 'number',
      required: true
    },
    {
      prop: 'total',
      label: '小计',
      type: 'number',
      readonly: true,
      compute: (row) => (row.quantity || 0) * (row.price || 0)
    }
  ]
}

const onSubFormChange = (data) => {
  subFormData.value = data
}
</script>
```

### SubTableForm

以表格形式展示的子表单,支持内联编辑。

```vue
<template>
  <SubTableForm
    :schema="subTableSchema"
    :model-value="orderItems"
    :inline-edit="true"
    @update:model-value="onItemsChange"
  />
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { SubTableForm } from 'vectra-crud'

const orderItems = ref([
  { product: '001', quantity: 2, price: 100 },
  { product: '002', quantity: 1, price: 200 }
])

const subTableSchema = {
  columns: [
    {
      prop: 'product',
      label: '产品',
      type: 'dict',
      dict: 'products',
      required: true
    },
    {
      prop: 'quantity',
      label: '数量',
      type: 'number',
      required: true
    },
    {
      prop: 'price',
      label: '单价',
      type: 'number',
      required: true
    },
    {
      prop: 'total',
      label: '小计',
      type: 'number',
      readonly: true,
      compute: (row) => row.quantity * row.price
    }
  ]
}
</script>
```

### KeyValueEditor

键值对编辑器,用于编辑 JSON 对象或动态字段。

```vue
<template>
  <KeyValueEditor
    :model-value="config"
    :key-options="keyOptions"
    :value-type="valueType"
    @update:model-value="onConfigChange"
  />
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { KeyValueEditor } from 'vectra-crud'

const config = ref({
  host: 'localhost',
  port: 3000,
  debug: true
})

const keyOptions = [
  { label: '主机', value: 'host' },
  { label: '端口', value: 'port' },
  { label: '调试模式', value: 'debug' }
]

const valueType = 'auto' // auto | string | number | boolean
</script>
```

### DictSelect

字典选择器组件。

```vue
<template>
  <DictSelect
    v-model="selectedValue"
    dict="userStatus"
    :multiple="false"
    :clearable="true"
    placeholder="请选择状态"
  />
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { DictSelect } from 'vectra-crud'

const selectedValue = ref(null)
</script>
```

### DictTag

字典标签组件,用于显示字典值对应的标签。

```vue
<template>
  <DictTag dict="userStatus" :value="status" />
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { DictTag } from 'vectra-crud'

const status = ref(1)
</script>
```

### Upload

文件上传组件。

```vue
<template>
  <Upload
    v-model="fileList"
    :action="uploadUrl"
    :max-count="5"
    :max-size="10"
    accept="image/*"
    @success="onUploadSuccess"
    @error="onUploadError"
  />
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Upload } from 'vectra-crud'

const fileList = ref([])
const uploadUrl = '/api/upload'

const onUploadSuccess = (response) => {
  console.log('上传成功:', response)
}

const onUploadError = (error) => {
  console.error('上传失败:', error)
}
</script>
```

### IconPicker

图标选择器组件。

```vue
<template>
  <IconPicker
    v-model="selectedIcon"
    :icon-set="iconSet"
  />
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { IconPicker } from 'vectra-crud'

const selectedIcon = ref('user')
const iconSet = 'element-plus' // element-plus | ant-design | custom
</script>
```

### ColumnSetting

列设置组件,用于动态显示/隐藏表格列。

```vue
<template>
  <ColumnSetting
    v-model="visibleColumns"
    :columns="allColumns"
    @change="onColumnChange"
  />
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { ColumnSetting } from 'vectra-crud'

const allColumns = [
  { prop: 'id', label: 'ID', fixed: true },
  { prop: 'name', label: '姓名' },
  { prop: 'email', label: '邮箱' },
  { prop: 'age', label: '年龄' }
]

const visibleColumns = ref(['id', 'name', 'email'])

const onColumnChange = (columns) => {
  console.log('可见列:', columns)
}
</script>
```

## 🔌 插件系统

Vectra CRUD 提供了丰富的插件来扩展功能。

### columnPersist - 列持久化

保存用户的列显示设置。

```typescript
import { useColumnPersist } from 'vectra-crud'

const { load, save } = useColumnPersist({
  key: 'user-table-columns', // 存储键名
  storage: localStorage      // 存储方式
})

// 加载设置
const columns = load()

// 保存设置
save(columns)
```

### export - 导出

导出表格数据为 Excel、CSV 等格式。

```vue
<template>
  <CrudPage
    :schema="schema"
    :data-source="dataSource"
    :plugins="['export']"
    :export-config="exportConfig"
  />
</template>

<script setup lang="ts">
const exportConfig = {
  filename: '用户列表',
  format: 'xlsx', // xlsx | csv | json
  columns: ['name', 'email', 'age'], // 指定导出的列
  beforeExport: (data) => {
    // 数据预处理
    return data
  }
}
</script>
```

### import - 导入

从 Excel、CSV 文件导入数据。

```vue
<template>
  <CrudPage
    :schema="schema"
    :data-source="dataSource"
    :plugins="['import']"
    :import-config="importConfig"
  />
</template>

<script setup lang="ts">
const importConfig = {
  template: '/templates/user-import.xlsx', // 导入模板
  validate: (data) => {
    // 数据验证
    return { valid: true, errors: [] }
  },
  beforeImport: (data) => {
    // 数据转换
    return data
  },
  onSuccess: (result) => {
    console.log('导入成功:', result)
  }
}
</script>
```

### inlineEdit - 行内编辑

支持在表格中直接编辑数据。

```vue
<template>
  <CrudPage
    :schema="schema"
    :data-source="dataSource"
    :plugins="['inlineEdit']"
    :inline-edit-config="inlineEditConfig"
  />
</template>

<script setup lang="ts">
const inlineEditConfig = {
  trigger: 'click', // click | dblclick
  columns: ['name', 'email', 'age'], // 可编辑的列
  showButtons: true, // 显示确认/取消按钮
  onSave: async (row, oldRow) => {
    // 保存逻辑
    await dataSource.update(row.id, row)
  }
}
</script>
```

### rowExpand - 行展开

支持展开行显示详细信息。

```vue
<template>
  <CrudPage
    :schema="schema"
    :data-source="dataSource"
    :plugins="['rowExpand']"
    :row-expand-config="rowExpandConfig"
  />
</template>

<script setup lang="ts">
const rowExpandConfig = {
  render: (row) => {
    // 自定义展开内容渲染
    return h('div', [
      h('p', `详细地址: ${row.address}`),
      h('p', `备注: ${row.remark}`)
    ])
  },
  // 或使用组件
  component: DetailComponent,
  props: (row) => ({ data: row })
}
</script>
```

### virtualScroll - 虚拟滚动

大数据量时使用虚拟滚动提升性能。

```vue
<template>
  <CrudPage
    :schema="schema"
    :data-source="dataSource"
    :plugins="['virtualScroll']"
    :virtual-scroll-config="virtualScrollConfig"
  />
</template>

<script setup lang="ts">
const virtualScrollConfig = {
  itemHeight: 50,        // 每行高度
  buffer: 5,             // 缓冲行数
  threshold: 100         // 启用虚拟滚动的阈值
}
</script>
```

### bulkActions - 批量操作

支持批量删除、批量编辑等操作。

```vue
<template>
  <CrudPage
    :schema="schema"
    :data-source="dataSource"
    :plugins="['bulkActions']"
    :bulk-actions-config="bulkActionsConfig"
  />
</template>

<script setup lang="ts">
const bulkActionsConfig = {
  actions: [
    {
      label: '批量删除',
      icon: 'delete',
      type: 'danger',
      confirm: '确认删除选中的记录吗?',
      handler: async (selection) => {
        const ids = selection.map(item => item.id)
        await dataSource.bulkDelete(ids)
      }
    },
    {
      label: '批量启用',
      icon: 'check',
      handler: async (selection) => {
        // 批量启用逻辑
      }
    }
  ]
}
</script>
```

### permissions - 权限控制

基于权限控制按钮和操作的显示。

```vue
<template>
  <CrudPage
    :schema="schema"
    :data-source="dataSource"
    :plugins="['permissions']"
    :permissions="permissions"
  />
</template>

<script setup lang="ts">
const permissions = {
  create: 'user:create',
  update: 'user:update',
  delete: 'user:delete',
  export: 'user:export',
  import: 'user:import'
}
</script>
```

配置权限检查函数:

```typescript
import { setPermissionChecker } from 'vectra-crud'

setPermissionChecker((permission) => {
  // 从用户权限列表中检查
  const userPermissions = store.getters.permissions
  return userPermissions.includes(permission)
})
```

## 🎨 高级用法

### 自定义渲染

#### 表格列自定义渲染

```typescript
const schema = {
  columns: [
    {
      prop: 'avatar',
      label: '头像',
      render: (value, row) => {
        return h('img', {
          src: value,
          style: { width: '40px', height: '40px', borderRadius: '50%' }
        })
      }
    },
    {
      prop: 'status',
      label: '状态',
      renderCell: (h, { row, column }) => {
        const statusMap = {
          1: { text: '在线', color: 'success' },
          0: { text: '离线', color: 'danger' }
        }
        const status = statusMap[row.status]
        return h('el-tag', { type: status.color }, () => status.text)
      }
    }
  ]
}
```

#### 表单项自定义渲染

```typescript
const schema = {
  columns: [
    {
      prop: 'customField',
      label: '自定义字段',
      formRender: (h, { value, onChange }) => {
        return h('div', [
          h('input', {
            value,
            onInput: (e) => onChange(e.target.value)
          }),
          h('span', ` (${value?.length || 0}/100)`)
        ])
      }
    }
  ]
}
```

### 表单布局

#### 水平布局

```vue
<SchemaForm
  :schema="schema"
  layout="horizontal"
  :label-width="120"
/>
```

#### 垂直布局

```vue
<SchemaForm
  :schema="schema"
  layout="vertical"
/>
```

#### 行内布局

```vue
<SchemaForm
  :schema="schema"
  layout="inline"
/>
```

#### 自定义布局

```typescript
const schema = {
  layout: 'grid',
  gridProps: {
    cols: 3,
    gutter: 16
  },
  columns: [
    {
      prop: 'field1',
      label: '字段1',
      span: 1  // 占用1列
    },
    {
      prop: 'field2',
      label: '字段2',
      span: 2  // 占用2列
    },
    {
      prop: 'field3',
      label: '字段3',
      span: 3  // 占用3列(整行)
    }
  ]
}
```

### 表单容器模式

#### 对话框模式

```vue
<CrudPage
  :schema="schema"
  :data-source="dataSource"
  form-container="dialog"
  :dialog-props="{
    width: '800px',
    top: '10vh',
    closeOnClickModal: false
  }"
/>
```

#### 抽屉模式

```vue
<CrudPage
  :schema="schema"
  :data-source="dataSource"
  form-container="drawer"
  :drawer-props="{
    size: '50%',
    direction: 'rtl'
  }"
/>
```

#### 页面模式

```vue
<CrudPage
  :schema="schema"
  :data-source="dataSource"
  form-container="page"
/>
```

### 子表单内联编辑

```typescript
const schema = {
  columns: [
    {
      prop: 'orderItems',
      label: '订单明细',
      type: 'subTable',
      subTableProps: {
        inlineEdit: true,
        showSummary: true,
        summaryMethod: (data) => {
          const total = data.reduce((sum, item) => {
            return sum + (item.quantity * item.price)
          }, 0)
          return { total }
        }
      },
      columns: [
        {
          prop: 'product',
          label: '产品',
          type: 'dict',
          dict: 'products',
          required: true
        },
        {
          prop: 'quantity',
          label: '数量',
          type: 'number',
          required: true,
          onChange: (value, row) => {
            // 数量变化时重新计算小计
            row.total = value * row.price
          }
        },
        {
          prop: 'price',
          label: '单价',
          type: 'number',
          required: true
        },
        {
          prop: 'total',
          label: '小计',
          type: 'number',
          readonly: true
        }
      ]
    }
  ]
}
```

### 字典系统

#### 静态字典

```typescript
import { defineDict } from 'vectra-crud'

defineDict('gender', [
  { label: '男', value: 'M' },
  { label: '女', value: 'F' }
])

defineDict('userStatus', [
  { label: '正常', value: 1, type: 'success', color: '#67c23a' },
  { label: '禁用', value: 0, type: 'danger', color: '#f56c6c' }
])
```

#### 动态字典

```typescript
defineDict('department', async () => {
  const response = await fetch('/api/departments')
  const data = await response.json()
  return data.map(item => ({
    label: item.name,
    value: item.id
  }))
})

// 带缓存的动态字典
defineDict('products', async () => {
  const response = await fetch('/api/products')
  return response.json()
}, {
  cache: true,
  cacheTime: 5 * 60 * 1000 // 缓存5分钟
})
```

#### 字典刷新

```typescript
import { refreshDict, refreshAllDicts } from 'vectra-crud'

// 刷新单个字典
await refreshDict('department')

// 刷新所有字典
await refreshAllDicts()
```

### 权限系统

#### 配置权限检查器

```typescript
import { setPermissionChecker } from 'vectra-crud'

setPermissionChecker((permission) => {
  const userPermissions = store.state.user.permissions
  if (Array.isArray(permission)) {
    return permission.some(p => userPermissions.includes(p))
  }
  return userPermissions.includes(permission)
})
```

#### 在组件中使用权限

```vue
<template>
  <CrudPage
    :schema="schema"
    :data-source="dataSource"
    :permissions="{
      create: 'user:create',
      update: 'user:update',
      delete: 'user:delete',
      export: ['user:export', 'admin']  // 支持多个权限(或关系)
    }"
  />
</template>
```

#### 自定义按钮权限

```typescript
const schema = {
  columns: [
    {
      prop: 'operation',
      label: '操作',
      type: 'operation',
      buttons: [
        {
          label: '编辑',
          permission: 'user:update',
          onClick: (row) => {
            // 编辑逻辑
          }
        },
        {
          label: '删除',
          permission: 'user:delete',
          type: 'danger',
          onClick: (row) => {
            // 删除逻辑
          }
        }
      ]
    }
  ]
}
```

### 生命周期钩子

```typescript
const schema = {
  columns: [...],
  hooks: {
    // 表单相关钩子
    beforeCreate: async (data) => {
      console.log('创建前', data)
      // 可以修改数据或返回 false 阻止创建
      return data
    },
    afterCreate: (response, data) => {
      console.log('创建后', response, data)
    },
    beforeUpdate: async (id, data) => {
      console.log('更新前', id, data)
      return data
    },
    afterUpdate: (response, id, data) => {
      console.log('更新后', response, id, data)
    },
    beforeDelete: async (id) => {
      console.log('删除前', id)
      // 返回 false 可以阻止删除
      return true
    },
    afterDelete: (id) => {
      console.log('删除后', id)
    },
    
    // 搜索相关钩子
    beforeSearch: (params) => {
      console.log('搜索前', params)
      // 可以修改搜索参数
      return params
    },
    afterSearch: (result, params) => {
      console.log('搜索后', result, params)
    },
    
    // 表单打开/关闭钩子
    onFormOpen: (mode, data) => {
      console.log('表单打开', mode, data)
    },
    onFormClose: () => {
      console.log('表单关闭')
    },
    
    // 数据变化钩子
    onChange: (prop, value, row) => {
      console.log('数据变化', prop, value, row)
    }
  }
}
```

## 🎯 UI 适配器

Vectra CRUD 支持多个主流 UI 框架:

### Element Plus

```typescript
import ElementPlusAdapter from '@vectra-crud/element-plus'
import 'element-plus/dist/index.css'

app.use(VectraCrud, {
  adapter: ElementPlusAdapter
})
```

### Ant Design Vue

```typescript
import AntDesignVueAdapter from '@vectra-crud/ant-design-vue'
import 'ant-design-vue/dist/antd.css'

app.use(VectraCrud, {
  adapter: AntDesignVueAdapter
})
```

### Naive UI

```typescript
import NaiveUIAdapter from '@vectra-crud/naive-ui'

app.use(VectraCrud, {
  adapter: NaiveUIAdapter
})
```

### 自定义适配器

```typescript
import { defineAdapter } from 'vectra-crud'

const MyAdapter = defineAdapter({
  name: 'my-adapter',
  components: {
    Table: MyTable,
    Form: MyForm,
    FormItem: MyFormItem,
    Input: MyInput,
    Select: MySelect,
    DatePicker: MyDatePicker,
    Button: MyButton,
    Dialog: MyDialog,
    Pagination: MyPagination
    // ... 其他组件
  },
  props: {
    table: {
      // 表格属性映射
      data: 'dataSource',
      loading: 'loading'
    },
    form: {
      // 表单属性映射
      model: 'modelValue'
    }
  }
})

app.use(VectraCrud, {
  adapter: MyAdapter
})
```

## 📝 完整示例

### Mock 数据源示例

```typescript
import { defineDataSource } from 'vectra-crud'

// 模拟数据
let users = [
  { id: 1, name: '张三', email: 'zhangsan@example.com', age: 25, status: 1, dept: '001' },
  { id: 2, name: '李四', email: 'lisi@example.com', age: 30, status: 1, dept: '002' },
  { id: 3, name: '王五', email: 'wangwu@example.com', age: 28, status: 0, dept: '001' }
]

let nextId = 4

const mockDataSource = defineDataSource({
  async search(params) {
    const { page = 1, pageSize = 10, search = {} } = params
    
    // 过滤
    let filtered = users
    if (search.name) {
      filtered = filtered.filter(u => u.name.includes(search.name))
    }
    if (search.status !== undefined && search.status !== '') {
      filtered = filtered.filter(u => u.status === search.status)
    }
    
    // 排序
    if (params.sort) {
      filtered.sort((a, b) => {
        const { prop, order } = params.sort
        const aVal = a[prop]
        const bVal = b[prop]
        return order === 'asc' 
          ? (aVal > bVal ? 1 : -1)
          : (aVal < bVal ? 1 : -1)
      })
    }
    
    // 分页
    const start = (page - 1) * pageSize
    const end = start + pageSize
    const list = filtered.slice(start, end)
    
    // 模拟网络延迟
    await new Promise(resolve => setTimeout(resolve, 300))
    
    return {
      list,
      total: filtered.length
    }
  },
  
  async detail(id) {
    await new Promise(resolve => setTimeout(resolve, 200))
    return users.find(u => u.id === id)
  },
  
  async create(data) {
    await new Promise(resolve => setTimeout(resolve, 500))
    const user = { ...data, id: nextId++ }
    users.push(user)
    return user
  },
  
  async update(id, data) {
    await new Promise(resolve => setTimeout(resolve, 500))
    const index = users.findIndex(u => u.id === id)
    if (index !== -1) {
      users[index] = { ...users[index], ...data }
      return users[index]
    }
    throw new Error('用户不存在')
  },
  
  async delete(id) {
    await new Promise(resolve => setTimeout(resolve, 500))
    const index = users.findIndex(u => u.id === id)
    if (index !== -1) {
      users.splice(index, 1)
    }
  },
  
  async bulkDelete(ids) {
    await new Promise(resolve => setTimeout(resolve, 500))
    users = users.filter(u => !ids.includes(u.id))
  }
})
```

### 真实 API 集成示例

```typescript
import axios from 'axios'
import { defineDataSource } from 'vectra-crud'

const apiClient = axios.create({
  baseURL: '/api',
  timeout: 10000
})

// 请求拦截器
apiClient.interceptors.request.use(config => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// 响应拦截器
apiClient.interceptors.response.use(
  response => response.data,
  error => {
    console.error('API Error:', error)
    return Promise.reject(error)
  }
)

const userDataSource = defineDataSource({
  async search(params) {
    const response = await apiClient.post('/users/search', params)
    return {
      list: response.data,
      total: response.total
    }
  },
  
  async detail(id) {
    const response = await apiClient.get(`/users/${id}`)
    return response.data
  },
  
  async create(data) {
    const response = await apiClient.post('/users', data)
    return response.data
  },
  
  async update(id, data) {
    const response = await apiClient.put(`/users/${id}`, data)
    return response.data
  },
  
  async delete(id) {
    await apiClient.delete(`/users/${id}`)
  },
  
  async bulkDelete(ids) {
    await apiClient.post('/users/bulk-delete', { ids })
  }
})
```

### 完整的用户管理示例

```vue
<template>
  <div class="user-management">
    <CrudPage
      ref="crudRef"
      :schema="userSchema"
      :data-source="userDataSource"
      :plugins="plugins"
      :permissions="permissions"
      :table-props="tableProps"
      :form-props="formProps"
      :export-config="exportConfig"
      :import-config="importConfig"
      @create-success="onCreateSuccess"
      @update-success="onUpdateSuccess"
      @delete-success="onDeleteSuccess"
    >
      <template #toolbar-left>
        <el-button @click="handleCustomAction">自定义操作</el-button>
      </template>
      
      <template #toolbar-right>
        <el-button @click="handleRefresh">刷新</el-button>
      </template>
    </CrudPage>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { CrudPage, defineDict, setPermissionChecker } from 'vectra-crud'
import { ElMessage } from 'element-plus'

// 定义字典
defineDict('userStatus', [
  { label: '正常', value: 1, type: 'success' },
  { label: '禁用', value: 0, type: 'danger' }
])

defineDict('department', async () => {
  const response = await fetch('/api/departments')
  return response.json()
})

defineDict('role', async () => {
  const response = await fetch('/api/roles')
  return response.json()
})

// 配置权限检查
setPermissionChecker((permission) => {
  const userPermissions = ['user:view', 'user:create', 'user:update', 'user:delete', 'user:export']
  return userPermissions.includes(permission)
})

const crudRef = ref()

// Schema 配置
const userSchema = {
  columns: [
    {
      prop: 'id',
      label: 'ID',
      type: 'number',
      tableProps: { width: 80, fixed: 'left' },
      formProps: { disabled: true }
    },
    {
      prop: 'avatar',
      label: '头像',
      type: 'upload',
      uploadProps: {
        action: '/api/upload',
        accept: 'image/*',
        maxSize: 2
      },
      render: (value) => {
        return h('img', {
          src: value,
          style: { width: '40px', height: '40px', borderRadius: '50%' }
        })
      }
    },
    {
      prop: 'name',
      label: '姓名',
      type: 'string',
      required: true,
      searchable: true,
      rules: [
        { required: true, message: '请输入姓名' },
        { min: 2, max: 20, message: '长度在 2 到 20 个字符' }
      ]
    },
    {
      prop: 'email',
      label: '邮箱',
      type: 'string',
      required: true,
      searchable: true,
      rules: [
        { required: true, message: '请输入邮箱' },
        { type: 'email', message: '请输入正确的邮箱地址' }
      ]
    },
    {
      prop: 'phone',
      label: '手机号',
      type: 'string',
      rules: [
        { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号' }
      ]
    },
    {
      prop: 'age',
      label: '年龄',
      type: 'number',
      formProps: { min: 1, max: 150 }
    },
    {
      prop: 'gender',
      label: '性别',
      type: 'dict',
      dict: 'gender',
      searchable: true
    },
    {
      prop: 'department',
      label: '部门',
      type: 'dict',
      dict: 'department',
      searchable: true,
      required: true
    },
    {
      prop: 'role',
      label: '角色',
      type: 'dict',
      dict: 'role',
      dictProps: { multiple: true }
    },
    {
      prop: 'status',
      label: '状态',
      type: 'dict',
      dict: 'userStatus',
      searchable: true,
      defaultValue: 1
    },
    {
      prop: 'remark',
      label: '备注',
      type: 'textarea',
      formProps: { rows: 4 },
      tableProps: { showOverflowTooltip: true }
    },
    {
      prop: 'createTime',
      label: '创建时间',
      type: 'datetime',
      formProps: { disabled: true },
      searchable: true,
      searchProps: { type: 'daterange' }
    },
    {
      prop: 'updateTime',
      label: '更新时间',
      type: 'datetime',
      formProps: { disabled: true }
    }
  ],
  hooks: {
    beforeCreate: async (data) => {
      console.log('创建用户前:', data)
      return data
    },
    afterCreate: (response) => {
      ElMessage.success('用户创建成功')
    },
    beforeUpdate: async (id, data) => {
      console.log('更新用户前:', id, data)
      return data
    },
    afterUpdate: () => {
      ElMessage.success('用户更新成功')
    },
    beforeDelete: async (id) => {
      // 可以在这里添加额外的确认逻辑
      return true
    },
    afterDelete: () => {
      ElMessage.success('用户删除成功')
    }
  }
}

// 数据源
const userDataSource = {
  async search(params) {
    const response = await fetch('/api/users/search', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params)
    })
    return response.json()
  },
  async detail(id) {
    const response = await fetch(`/api/users/${id}`)
    return response.json()
  },
  async create(data) {
    const response = await fetch('/api/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    })
    return response.json()
  },
  async update(id, data) {
    const response = await fetch(`/api/users/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    })
    return response.json()
  },
  async delete(id) {
    await fetch(`/api/users/${id}`, {
      method: 'DELETE'
    })
  },
  async bulkDelete(ids) {
    await fetch('/api/users/bulk-delete', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ids })
    })
  }
}

// 插件配置
const plugins = [
  'columnPersist',
  'export',
  'import',
  'inlineEdit',
  'bulkActions',
  'permissions'
]

// 权限配置
const permissions = {
  create: 'user:create',
  update: 'user:update',
  delete: 'user:delete',
  export: 'user:export',
  import: 'user:import'
}

// 表格配置
const tableProps = {
  stripe: true,
  border: true,
  size: 'default'
}

// 表单配置
const formProps = {
  labelWidth: '100px',
  layout: 'horizontal'
}

// 导出配置
const exportConfig = {
  filename: '用户列表',
  format: 'xlsx'
}

// 导入配置
const importConfig = {
  template: '/templates/user-import.xlsx',
  onSuccess: (result) => {
    ElMessage.success(`成功导入 ${result.success} 条记录`)
    crudRef.value.refresh()
  }
}

// 事件处理
const onCreateSuccess = () => {
  console.log('创建成功')
}

const onUpdateSuccess = () => {
  console.log('更新成功')
}

const onDeleteSuccess = () => {
  console.log('删除成功')
}

const handleCustomAction = () => {
  console.log('自定义操作')
}

const handleRefresh = () => {
  crudRef.value.refresh()
}
</script>

<style scoped>
.user-management {
  padding: 20px;
}
</style>
```

## 🛠️ 开发指南

### 本地开发

```bash
# 克隆仓库
git clone https://github.com/kowyzhux/vectra-crud.git

# 安装依赖
cd vectra-crud
pnpm install

# 启动开发服务器
pnpm dev

# 构建
pnpm build

# 运行测试
pnpm test

# 代码检查
pnpm lint
```

### 目录结构

```
vectra-crud/
├── packages/
│   ├── core/              # 核心包
│   │   ├── src/
│   │   │   ├── components/   # 组件
│   │   │   ├── composables/  # 组合式函数
│   │   │   ├── plugins/      # 插件
│   │   │   ├── types/        # 类型定义
│   │   │   └── utils/        # 工具函数
│   │   └── package.json
│   ├── element-plus/      # Element Plus 适配器
│   ├── ant-design-vue/    # Ant Design Vue 适配器
│   └── naive-ui/          # Naive UI 适配器
├── examples/              # 示例
├── docs/                  # 文档
└── package.json
```

### 贡献指南

我们欢迎所有形式的贡献!

1. Fork 本仓库
2. 创建特性分支 (`git checkout -b feature/amazing-feature`)
3. 提交更改 (`git commit -m 'Add some amazing feature'`)
4. 推送到分支 (`git push origin feature/amazing-feature`)
5. 创建 Pull Request

请确保:
- 代码符合 ESLint 规范
- 添加必要的测试
- 更新相关文档

## 📚 API 参考

### CrudPage Props

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| schema | Schema | - | Schema 配置 |
| dataSource | DataSource | - | 数据源 |
| plugins | string[] | [] | 启用的插件列表 |
| permissions | object | {} | 权限配置 |
| tableProps | object | {} | 表格组件属性 |
| formProps | object | {} | 表单组件属性 |
| searchProps | object | {} | 搜索组件属性 |
| formContainer | 'dialog' \| 'drawer' \| 'page' | 'dialog' | 表单容器类型 |
| dialogProps | object | {} | 对话框属性 |
| drawerProps | object | {} | 抽屉属性 |

### CrudPage Events

| 事件 | 参数 | 说明 |
|------|------|------|
| create-success | (data) | 创建成功 |
| update-success | (data) | 更新成功 |
| delete-success | (id) | 删除成功 |
| search | (params) | 搜索 |
| selection-change | (selection) | 选择变化 |

### CrudPage Methods

| 方法 | 参数 | 说明 |
|------|------|------|
| refresh | () | 刷新数据 |
| openCreate | () | 打开创建表单 |
| openEdit | (id) | 打开编辑表单 |
| openView | (id) | 打开查看表单 |
| delete | (id) | 删除记录 |
| exportData | (options) | 导出数据 |

### SchemaTable Props

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| schema | Schema | - | Schema 配置 |
| data | any[] | [] | 表格数据 |
| loading | boolean | false | 加载状态 |
| pagination | Pagination | - | 分页配置 |
| selection | boolean | false | 是否显示选择列 |

### SchemaForm Props

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| schema | Schema | - | Schema 配置 |
| modelValue | object | {} | 表单数据 |
| mode | 'create' \| 'edit' \| 'view' | 'create' | 表单模式 |
| layout | 'horizontal' \| 'vertical' \| 'inline' | 'horizontal' | 表单布局 |
| labelWidth | string \| number | '100px' | 标签宽度 |

### SchemaSearch Props

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| schema | Schema | - | Schema 配置 |
| modelValue | object | {} | 搜索参数 |
| collapsed | boolean | false | 是否折叠 |
| collapseCount | number | 3 | 折叠时显示的数量 |

## 🤝 社区与支持

- [GitHub Issues](https://github.com/kowyzhux/vectra-crud/issues)
- [GitHub Discussions](https://github.com/kowyzhux/vectra-crud/discussions)
- [更新日志](./CHANGELOG.md)

## 📄 许可证

[MIT License](./LICENSE)

Copyright (c) 2026 kowyzhux

## ❤️ 鸣谢

感谢所有为 Vectra CRUD 做出贡献的开发者!

---

如果这个项目对你有帮助,请给我们一个 ⭐️ Star!
