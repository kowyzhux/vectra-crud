<template>
  <div class="schema-search">
    <el-form ref="formRef" :model="searchForm" label-width="120px" inline>
      <el-form-item
        v-for="field in schema"
        :key="field.prop"
        :label="field.label"
        :prop="field.prop"
      >
        <template v-if="field.render">
          <component :is="field.render" :field="field" :model-value="searchForm[field.prop]" />
        </template>
        <template v-else>
          <dict-select
            v-if="field.type === 'dict-select' || field.dictCode"
            v-model="searchForm[field.prop]"
            :dict-code="field.dictCode"
            :options="field.options"
            :placeholder="field.placeholder"
            :multiple="false"
          />
          <el-select
            v-else-if="field.type === 'select'"
            v-model="searchForm[field.prop]"
            :placeholder="field.placeholder"
            clearable
          >
            <el-option
              v-for="opt in field.options"
              :key="opt.value"
              :label="opt.label"
              :value="opt.value"
            />
          </el-select>
          <el-date-picker
            v-else-if="field.type === 'date'"
            v-model="searchForm[field.prop]"
            type="date"
            :placeholder="field.placeholder"
          />
          <el-date-picker
            v-else-if="field.type === 'datetime'"
            v-model="searchForm[field.prop]"
            type="datetime"
            :placeholder="field.placeholder"
          />
          <el-input
            v-else
            v-model="searchForm[field.prop]"
            :placeholder="field.placeholder"
            clearable
          />
        </template>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="handleSearch">Search</el-button>
        <el-button @click="handleReset">Reset</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, watch } from 'vue'
import { ElForm, ElFormItem, ElInput, ElSelect, ElOption, ElDatePicker, ElButton } from 'element-plus'
import DictSelect from './common/DictSelect.vue'
import type { SearchFieldSchema } from '../types'

interface Props {
  schema: SearchFieldSchema[]
  modelValue?: Record<string, any>
}

const props = withDefaults(defineProps<Props>(), {
  schema: () => []
})

const emit = defineEmits<{
  (e: 'update:modelValue', value: Record<string, any>): void
  (e: 'search', value: Record<string, any>): void
  (e: 'reset'): void
  (e: 'query-change', value: Record<string, any>): void
}>()

const formRef = ref()
const searchForm = reactive<Record<string, any>>(props.modelValue || {})

watch(
  () => props.modelValue,
  (val) => {
    if (val) {
      Object.assign(searchForm, val)
    }
  }
)

watch(
  searchForm,
  (val) => {
    emit('update:modelValue', val)
    emit('query-change', val)
  },
  { deep: true }
)

const handleSearch = () => {
  emit('search', searchForm)
}

const handleReset = () => {
  formRef.value?.resetFields()
  props.schema.forEach((field) => {
    searchForm[field.prop] = field.defaultValue || undefined
  })
  emit('reset')
  emit('search', searchForm)
}
</script>

<style scoped>
.schema-search {
  padding: 16px;
  background: #fff;
  border-radius: 4px;
  margin-bottom: 16px;
}
</style>
