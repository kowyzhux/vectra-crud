<template>
  <component :is="adapter.table.Table" :data="data" v-bind="tableProps">
    <component
      :is="adapter.table.TableColumn"
      v-for="column in visibleColumns"
      :key="column.prop"
      :prop="column.prop"
      :label="column.label"
      :width="column.width"
      :min-width="column.minWidth"
      :fixed="column.fixed"
      :sortable="column.sortable"
      :align="column.align"
      :formatter="column.formatter"
    >
      <template #default="scope">
        <!-- Custom slot rendering -->
        <slot
          v-if="column.slot"
          :name="column.slot"
          :row="scope.row"
          :column="column"
          :index="scope.$index"
        />
        <!-- Custom render function -->
        <component
          :is="() => column.render?.(scope.row[column.prop], scope.row)"
          v-else-if="column.render"
        />
        <!-- Dict type -->
        <DictTag
          v-else-if="column.type === 'dict' && column.dictCode"
          :code="column.dictCode"
          :value="scope.row[column.prop]"
        />
        <!-- Default rendering -->
        <span v-else>{{ scope.row[column.prop] }}</span>
      </template>
    </component>

    <!-- Actions column slot -->
    <slot name="actions" />
  </component>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { TableColumnSchema } from '@/types/schema'
import { useAdapter } from '@/adapters'
import DictTag from './DictTag.vue'

const props = defineProps<{
  schema: TableColumnSchema[]
  data: any[]
  tableProps?: Record<string, any>
}>()

const adapter = useAdapter()

// Filter visible columns
const visibleColumns = computed(() => {
  return props.schema.filter((column) => {
    if (typeof column.hidden === 'function') {
      return !column.hidden(props.data)
    }
    return !column.hidden
  })
})
</script>
