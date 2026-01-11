<template>
  <div class="schema-table">
    <vxe-table
      ref="tableRef"
      :data="data"
      :loading="loading"
      border
      stripe
      highlight-hover-row
      :row-config="{ keyField: 'id' }"
      :column-config="{ resizable: true }"
      :edit-config="editConfig"
      :expand-config="expandConfig"
      :scroll-y="scrollY"
      @checkbox-change="handleSelectionChange"
      @checkbox-all="handleSelectionChange"
      @sort-change="handleSortChange"
      @filter-change="handleFilterChange"
    >
      <vxe-column v-if="showSelection" type="checkbox" width="60" fixed="left" />
      <vxe-column v-if="showExpand" type="expand" width="60" fixed="left">
        <template #content="{ row }">
          <slot name="expand" :row="row" />
        </template>
      </vxe-column>
      <vxe-column v-if="showIndex" type="seq" title="#" width="60" />

      <vxe-column
        v-for="column in visibleColumns"
        :key="column.prop"
        :field="column.prop"
        :title="column.label"
        :width="column.width"
        :min-width="column.minWidth"
        :fixed="column.fixed"
        :sortable="column.sortable"
        :filters="column.filterable ? [] : undefined"
      >
        <template #default="{ row, $rowIndex }">
          <slot :name="`column-${column.prop}`" :row="row" :column="column" :index="$rowIndex">
            <template v-if="column.render">
              <component :is="column.render" :row="row" :column="column" :$index="$rowIndex" />
            </template>
            <template v-else-if="column.type === 'dict'">
              <dict-tag :model-value="row[column.prop]" :dict-code="column.dictCode" />
            </template>
            <template v-else-if="column.formatter">
              {{ column.formatter(row, column, row[column.prop]) }}
            </template>
            <template v-else>
              {{ row[column.prop] }}
            </template>
          </slot>
        </template>
      </vxe-column>

      <vxe-column v-if="$slots.actions" title="Actions" width="150" fixed="right">
        <template #default="{ row, $rowIndex }">
          <slot name="actions" :row="row" :index="$rowIndex" />
        </template>
      </vxe-column>
    </vxe-table>

    <div v-if="pagination" class="table-pagination">
      <el-pagination
        v-model:current-page="currentPage"
        v-model:page-size="pageSize"
        :total="total"
        :page-sizes="[10, 20, 50, 100]"
        layout="total, sizes, prev, pager, next, jumper"
        @current-change="handlePageChange"
        @size-change="handleSizeChange"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { ElPagination } from 'element-plus'
import VXETable from 'vxe-table'
import DictTag from './common/DictTag.vue'
import type { TableColumnSchema } from '../types'

const { VxeTable, VxeColumn } = VXETable

interface Props {
  data: any[]
  schema: TableColumnSchema[]
  loading?: boolean
  pagination?: boolean
  total?: number
  page?: number
  pageSize?: number
  showSelection?: boolean
  showIndex?: boolean
  showExpand?: boolean
  editConfig?: any
  expandConfig?: any
  scrollY?: any
  hiddenColumns?: string[]
}

const props = withDefaults(defineProps<Props>(), {
  data: () => [],
  schema: () => [],
  loading: false,
  pagination: true,
  total: 0,
  page: 1,
  pageSize: 20,
  showSelection: false,
  showIndex: true,
  showExpand: false
})

const emit = defineEmits<{
  (e: 'page-change', page: number): void
  (e: 'size-change', size: number): void
  (e: 'selection-change', selection: any[]): void
  (e: 'sort-change', event: any): void
  (e: 'filter-change', event: any): void
  (e: 'column-change', columns: TableColumnSchema[]): void
}>()

const tableRef = ref()
const currentPage = ref(props.page)
const pageSize = ref(props.pageSize)

watch(
  () => props.page,
  (val) => {
    currentPage.value = val
  }
)

watch(
  () => props.pageSize,
  (val) => {
    pageSize.value = val
  }
)

const visibleColumns = computed(() => {
  if (!props.hiddenColumns || props.hiddenColumns.length === 0) {
    return props.schema
  }
  return props.schema.filter((col) => !props.hiddenColumns?.includes(col.prop))
})

const handlePageChange = (page: number) => {
  emit('page-change', page)
}

const handleSizeChange = (size: number) => {
  emit('size-change', size)
}

const handleSelectionChange = () => {
  const selection = tableRef.value?.getCheckboxRecords()
  emit('selection-change', selection || [])
}

const handleSortChange = (event: any) => {
  emit('sort-change', event)
}

const handleFilterChange = (event: any) => {
  emit('filter-change', event)
}

const getTableRef = () => tableRef.value

defineExpose({
  getTableRef
})
</script>

<style scoped>
.schema-table {
  background: #fff;
  border-radius: 4px;
  padding: 16px;
}

.table-pagination {
  margin-top: 16px;
  display: flex;
  justify-content: flex-end;
}
</style>
