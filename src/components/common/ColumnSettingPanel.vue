<template>
  <div class="column-setting-panel">
    <div class="panel-header">
      <span class="panel-title">Column Settings</span>
      <el-button text @click="resetColumns">Reset</el-button>
    </div>
    <div class="panel-content">
      <div v-for="column in localColumns" :key="column.prop" class="column-item">
        <el-checkbox v-model="column.visible" @change="handleColumnChange">
          {{ column.label }}
        </el-checkbox>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { ElCheckbox, ElButton } from 'element-plus'

interface ColumnConfig {
  prop: string
  label: string
  visible: boolean
}

interface Props {
  columns?: ColumnConfig[]
}

const props = defineProps<Props>()

const emit = defineEmits<{
  (e: 'change', columns: ColumnConfig[]): void
  (e: 'reset'): void
}>()

const localColumns = ref<ColumnConfig[]>(
  props.columns?.map((col) => ({ ...col })) || []
)

watch(
  () => props.columns,
  (val) => {
    if (val) {
      localColumns.value = val.map((col) => ({ ...col }))
    }
  }
)

const handleColumnChange = () => {
  emit('change', localColumns.value)
}

const resetColumns = () => {
  emit('reset')
}
</script>

<style scoped>
.column-setting-panel {
  padding: 16px;
  background: #fff;
  border-radius: 4px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}

.panel-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  padding-bottom: 12px;
  border-bottom: 1px solid #e4e7ed;
}

.panel-title {
  font-weight: 600;
  font-size: 14px;
}

.panel-content {
  max-height: 400px;
  overflow-y: auto;
}

.column-item {
  padding: 8px 0;
}
</style>
