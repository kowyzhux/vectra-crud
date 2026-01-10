<template>
  <div class="crud-page">
    <!-- Search area -->
    <SchemaSearch
      v-if="schema.search"
      ref="searchRef"
      :schema="schema.search"
      :model-value="searchParams"
      @search="handleSearch"
      @reset="handleReset"
    >
      <!-- Forward search slots -->
      <template v-for="(_, name) in searchSlots" #[name]="slotProps">
        <slot :name="`search-${name}`" v-bind="slotProps" />
      </template>
    </SchemaSearch>

    <!-- Toolbar -->
    <component :is="adapter.layout.Card" class="crud-toolbar">
      <component
        :is="adapter.feedback.Button"
        v-for="action in toolbarActions"
        :key="action.key"
        :type="action.type"
        @click="handleAction(action)"
      >
        {{ action.label }}
      </component>
      <slot name="toolbar" />
    </component>

    <!-- Table area -->
    <component :is="adapter.layout.Card" class="crud-table">
      <SchemaTable
        v-if="schema.table"
        ref="tableRef"
        :schema="schema.table"
        :data="tableData"
        :table-props="tableProps"
      >
        <!-- Forward table slots -->
        <template v-for="(_, name) in tableSlots" #[name]="slotProps">
          <slot :name="`table-${name}`" v-bind="slotProps" />
        </template>

        <!-- Actions column -->
        <template #actions>
          <component
            :is="adapter.table.TableColumn"
            label="操作"
            :width="actionsWidth"
            fixed="right"
          >
            <template #default="scope">
              <component
                :is="adapter.feedback.Button"
                v-for="action in rowActions"
                :key="action.key"
                :type="action.type || 'text'"
                size="small"
                @click="handleAction(action, scope.row)"
              >
                {{ action.label }}
              </component>
              <slot name="row-actions" :row="scope.row" />
            </template>
          </component>
        </template>
      </SchemaTable>

      <!-- Pagination -->
      <component
        :is="adapter.pagination.Pagination"
        v-if="pagination"
        v-model:current-page="currentPage"
        v-model:page-size="pageSize"
        :total="total"
        :page-sizes="[10, 20, 50, 100]"
        layout="total, sizes, prev, pager, next, jumper"
        class="crud-pagination"
        @size-change="handlePageChange"
        @current-change="handlePageChange"
      />
    </component>

    <!-- Form dialog -->
    <component
      :is="adapter.layout.Dialog"
      v-model="dialogVisible"
      :title="dialogTitle"
      width="600px"
    >
      <SchemaForm
        v-if="schema.form"
        ref="formRef"
        :schema="schema.form"
        :model-value="formData"
        @update:model-value="(value) => (formData = value)"
      >
        <!-- Forward form slots -->
        <template v-for="(_, name) in formSlots" #[name]="slotProps">
          <slot :name="`form-${name}`" v-bind="slotProps" />
        </template>
      </SchemaForm>
      <template #footer>
        <component :is="adapter.feedback.Button" @click="dialogVisible = false"> 取消 </component>
        <component :is="adapter.feedback.Button" type="primary" @click="handleSave">
          确定
        </component>
      </template>
    </component>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted, useSlots } from 'vue'
import { CrudSchema } from '@/types/schema'
import { ActionConfig } from '@/types/action'
import { IDataSource } from '@/types/datasource'
import { useAdapter } from '@/adapters'
import { useCrudContext } from '@/composables/useCrud'
import { useAction } from '@/composables/useAction'
import SchemaSearch from './SchemaSearch.vue'
import SchemaTable from './SchemaTable.vue'
import SchemaForm from './SchemaForm.vue'

const props = withDefaults(
  defineProps<{
    schema: CrudSchema
    dataSource?: IDataSource
    toolbarActions?: ActionConfig[]
    rowActions?: ActionConfig[]
    pagination?: boolean
    tableProps?: Record<string, any>
    actionsWidth?: number
  }>(),
  {
    dataSource: undefined,
    toolbarActions: () => [],
    rowActions: () => [],
    pagination: true,
    tableProps: () => ({}),
    actionsWidth: 200,
  }
)

const adapter = useAdapter()
const context = useCrudContext()
const { runAction } = useAction()
const slots = useSlots()

// Refs
const searchRef = ref()
const tableRef = ref()
const formRef = ref()

// Data
const searchParams = reactive<Record<string, any>>({})
const tableData = ref<any[]>([])
const currentPage = ref(1)
const pageSize = ref(20)
const total = ref(0)
const dialogVisible = ref(false)
const dialogTitle = ref('新增')
const formData = ref<Record<string, any>>({})

// Compute slot names by category
const searchSlots = computed(() => {
  const result: Record<string, any> = {}
  Object.keys(slots).forEach((name) => {
    if (name.startsWith('search-')) {
      result[name.substring(7)] = slots[name]
    }
  })
  return result
})

const tableSlots = computed(() => {
  const result: Record<string, any> = {}
  Object.keys(slots).forEach((name) => {
    if (name.startsWith('table-')) {
      result[name.substring(6)] = slots[name]
    }
  })
  return result
})

const formSlots = computed(() => {
  const result: Record<string, any> = {}
  Object.keys(slots).forEach((name) => {
    if (name.startsWith('form-')) {
      result[name.substring(5)] = slots[name]
    }
  })
  return result
})

// Load data
async function loadData() {
  const dataSource = props.dataSource || context.config.dataSource
  if (!dataSource) {
    console.warn('No data source provided')
    return
  }

  try {
    // Execute before load hook
    const shouldContinue = await context.executeHook('beforeLoad', {
      ...searchParams,
      page: currentPage.value,
      pageSize: pageSize.value,
    })
    if (shouldContinue === false) {
      return
    }

    const loading = adapter.showLoading()
    try {
      const result = await dataSource.list({
        ...searchParams,
        page: currentPage.value,
        pageSize: pageSize.value,
      })
      tableData.value = result.data
      total.value = result.total

      // Execute after load hook
      await context.executeHook('afterLoad', result)
    } finally {
      adapter.hideLoading(loading)
    }
  } catch (error) {
    console.error('Failed to load data:', error)
    await context.executeHook('onError', error)
    adapter.showMessage('加载数据失败', 'error')
  }
}

// Search handlers
function handleSearch(params: Record<string, any>) {
  Object.assign(searchParams, params)
  currentPage.value = 1
  loadData()
}

function handleReset() {
  Object.keys(searchParams).forEach((key) => delete searchParams[key])
  currentPage.value = 1
  loadData()
}

// Pagination handlers
function handlePageChange() {
  loadData()
}

// Action handlers
function handleAction(action: ActionConfig, row?: any) {
  runAction(action, {
    row,
    data: tableData.value,
    refresh: loadData,
  })
}

// CRUD operations
function handleAdd() {
  dialogTitle.value = '新增'
  formData.value = {}
  dialogVisible.value = true
}

function handleEdit(row: any) {
  dialogTitle.value = '编辑'
  formData.value = { ...row }
  dialogVisible.value = true
}

async function handleSave() {
  const dataSource = props.dataSource || context.config.dataSource
  if (!dataSource) {
    console.warn('No data source provided')
    return
  }

  try {
    // Validate form
    await formRef.value?.validate()

    // Execute before save hook
    const shouldContinue = await context.executeHook('beforeSave', formData.value)
    if (shouldContinue === false) {
      return
    }

    const loading = adapter.showLoading()
    try {
      await dataSource.save(formData.value)
      adapter.showMessage('保存成功', 'success')
      dialogVisible.value = false

      // Execute after save hook
      await context.executeHook('afterSave', formData.value)

      // Reload data
      loadData()
    } finally {
      adapter.hideLoading(loading)
    }
  } catch (error) {
    console.error('Failed to save:', error)
    await context.executeHook('onError', error)
    adapter.showMessage('保存失败', 'error')
  }
}

async function handleDelete(row: any) {
  const dataSource = props.dataSource || context.config.dataSource
  if (!dataSource) {
    console.warn('No data source provided')
    return
  }

  const confirmed = await adapter.confirm('确认删除此项？')
  if (!confirmed) {
    return
  }

  try {
    // Execute before remove hook
    const shouldContinue = await context.executeHook('beforeRemove', row.id)
    if (shouldContinue === false) {
      return
    }

    const loading = adapter.showLoading()
    try {
      await dataSource.remove(row.id)
      adapter.showMessage('删除成功', 'success')

      // Execute after remove hook
      await context.executeHook('afterRemove', row.id)

      // Reload data
      loadData()
    } finally {
      adapter.hideLoading(loading)
    }
  } catch (error) {
    console.error('Failed to delete:', error)
    await context.executeHook('onError', error)
    adapter.showMessage('删除失败', 'error')
  }
}

// Expose methods
defineExpose({
  loadData,
  handleAdd,
  handleEdit,
  handleDelete,
  searchRef,
  tableRef,
  formRef,
})

// Load data on mount
onMounted(() => {
  loadData()
})
</script>

<style scoped>
.crud-page {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.crud-toolbar {
  display: flex;
  gap: 8px;
}

.crud-pagination {
  margin-top: 16px;
  display: flex;
  justify-content: flex-end;
}
</style>
