<template>
  <div class="crud-page">
    <schema-search
      v-if="searchSchema && searchSchema.length > 0"
      :schema="searchSchema"
      @search="handleSearch"
      @reset="handleReset"
    />

    <div class="crud-toolbar">
      <div class="toolbar-left">
        <slot name="toolbar-left">
          <el-button type="primary" @click="handleAdd">Add</el-button>
          <el-button
            v-for="action in toolbarActions"
            :key="action.key"
            :type="action.type"
            @click="action.handler"
          >
            {{ action.label }}
          </el-button>
        </slot>
      </div>
      <div class="toolbar-right">
        <slot name="toolbar-right" />
      </div>
    </div>

    <schema-table
      ref="tableRef"
      :data="tableData"
      :schema="tableSchema"
      :loading="loading"
      :pagination="pagination"
      :total="total"
      :page="currentPage"
      :page-size="pageSize"
      :show-selection="showSelection"
      :show-index="showIndex"
      :show-expand="!!$slots.expand"
      :hidden-columns="hiddenColumns"
      @page-change="handlePageChange"
      @size-change="handleSizeChange"
      @selection-change="handleSelectionChange"
      @sort-change="handleSortChange"
      @filter-change="handleFilterChange"
    >
      <template v-if="$slots.expand" #expand="{ row }">
        <slot name="expand" :row="row" />
      </template>

      <template #actions="{ row, index }">
        <slot name="row-actions" :row="row" :index="index">
          <el-button type="primary" text size="small" @click="handleEdit(row)">Edit</el-button>
          <el-button type="danger" text size="small" @click="handleDelete(row)">Delete</el-button>
        </slot>
      </template>

      <template v-for="column in tableSchema" :key="column.prop" #[`column-${column.prop}`]="scope">
        <slot :name="`column-${column.prop}`" v-bind="scope" />
      </template>
    </schema-table>

    <schema-form
      v-model="formVisible"
      :schema="formSchema"
      :title="formTitle"
      :data="currentRow"
      @submit="handleFormSubmit"
      @cancel="handleFormCancel"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { ElButton, ElMessageBox, ElMessage } from 'element-plus'
import SchemaSearch from './SchemaSearch.vue'
import SchemaTable from './SchemaTable.vue'
import SchemaForm from './SchemaForm.vue'
import { useCrudProvider, createLifecycleHooks } from '../core/provider'
import { createPluginContext } from '../core/plugins'
import type {
  IDataSource,
  SearchFieldSchema,
  TableColumnSchema,
  FormFieldSchema,
  ActionSchema
} from '../types'

interface Props {
  dataSource: IDataSource
  searchSchema?: SearchFieldSchema[]
  tableSchema: TableColumnSchema[]
  formSchema: FormFieldSchema[]
  pageKey?: string
  pagination?: boolean
  showSelection?: boolean
  showIndex?: boolean
  toolbarActions?: ActionSchema[]
}

const props = withDefaults(defineProps<Props>(), {
  searchSchema: () => [],
  pagination: true,
  showSelection: false,
  showIndex: true,
  toolbarActions: () => []
})

const emit = defineEmits<{
  (e: 'search', params: any): void
  (e: 'add'): void
  (e: 'edit', row: any): void
  (e: 'delete', row: any): void
  (e: 'save', data: any): void
  (e: 'selection-change', selection: any[]): void
}>()

const provider = useCrudProvider()
const hooks = createLifecycleHooks(provider)

const tableRef = ref()
const tableData = ref<any[]>([])
const loading = ref(false)
const currentPage = ref(1)
const pageSize = ref(20)
const total = ref(0)
const searchParams = ref<Record<string, any>>({})
const selectedRows = ref<any[]>([])
const hiddenColumns = ref<string[]>([])

const formVisible = ref(false)
const formTitle = ref('Add')
const currentRow = ref<Record<string, any> | undefined>(undefined)

const pluginContext = computed(() =>
  createPluginContext({
    dataSource: props.dataSource,
    searchSchema: props.searchSchema,
    tableSchema: props.tableSchema,
    formSchema: props.formSchema,
    actions: props.toolbarActions,
    pageKey: props.pageKey
  })
)

onMounted(async () => {
  if (provider) {
    await provider.install(pluginContext.value)
    await provider.runPluginHook('beforeMountTable', pluginContext.value)
  }
  await loadData()
})

const loadData = async () => {
  loading.value = true
  try {
    if (hooks.beforeSearch) {
      await hooks.beforeSearch(searchParams.value)
    }

    const params = {
      pagination: props.pagination
        ? { page: currentPage.value, pageSize: pageSize.value }
        : undefined,
      filters: searchParams.value
    }

    const result = await props.dataSource.list(params)
    tableData.value = result.data
    total.value = result.total

    if (hooks.afterSearch) {
      await hooks.afterSearch(result)
    }
  } catch (error) {
    console.error('Failed to load data:', error)
    ElMessage.error('Failed to load data')
  } finally {
    loading.value = false
  }
}

const handleSearch = (params: Record<string, any>) => {
  searchParams.value = params
  currentPage.value = 1
  emit('search', params)
  loadData()
}

const handleReset = () => {
  searchParams.value = {}
  currentPage.value = 1
  loadData()
}

const handlePageChange = (page: number) => {
  currentPage.value = page
  loadData()
}

const handleSizeChange = (size: number) => {
  pageSize.value = size
  currentPage.value = 1
  loadData()
}

const handleSelectionChange = (selection: any[]) => {
  selectedRows.value = selection
  emit('selection-change', selection)
}

const handleSortChange = (event: any) => {
  loadData()
}

const handleFilterChange = (event: any) => {
  loadData()
}

const handleAdd = () => {
  formTitle.value = 'Add'
  currentRow.value = undefined
  formVisible.value = true
  emit('add')
}

const handleEdit = (row: any) => {
  formTitle.value = 'Edit'
  currentRow.value = { ...row }
  formVisible.value = true
  emit('edit', row)
}

const handleDelete = async (row: any) => {
  try {
    await ElMessageBox.confirm('Are you sure to delete this record?', 'Confirm', {
      type: 'warning'
    })

    if (hooks.beforeRemove) {
      await hooks.beforeRemove(row)
    }

    await props.dataSource.remove(row.id)

    if (hooks.afterRemove) {
      await hooks.afterRemove(row)
    }

    ElMessage.success('Deleted successfully')
    emit('delete', row)
    await loadData()
  } catch (error) {
    if (error !== 'cancel') {
      console.error('Failed to delete:', error)
      ElMessage.error('Failed to delete')
    }
  }
}

const handleFormSubmit = async (data: Record<string, any>) => {
  try {
    if (hooks.beforeSave) {
      await hooks.beforeSave(data)
    }

    await props.dataSource.save(data)

    if (hooks.afterSave) {
      await hooks.afterSave(data)
    }

    ElMessage.success('Saved successfully')
    emit('save', data)
    formVisible.value = false
    await loadData()
  } catch (error) {
    console.error('Failed to save:', error)
    ElMessage.error('Failed to save')
  }
}

const handleFormCancel = () => {
  formVisible.value = false
}

const refresh = () => {
  loadData()
}

defineExpose({
  refresh,
  loadData,
  getTableRef: () => tableRef.value,
  getSelectedRows: () => selectedRows.value
})
</script>

<style scoped>
.crud-page {
  width: 100%;
}

.crud-toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  background: #fff;
  border-radius: 4px;
  margin-bottom: 16px;
}

.toolbar-left {
  display: flex;
  gap: 8px;
}

.toolbar-right {
  display: flex;
  gap: 8px;
}
</style>
