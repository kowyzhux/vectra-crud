<template>
  <component :is="adapter.layout.Card" class="schema-search">
    <component :is="adapter.form.Form" ref="formRef" :model="formData" inline>
      <component :is="adapter.layout.Row" :gutter="20">
        <component
          :is="adapter.layout.Col"
          v-for="field in schema"
          :key="field.prop"
          :span="field.props?.span || 6"
        >
          <component :is="adapter.form.FormItem" :label="field.label" :prop="field.prop">
            <!-- Custom slot rendering -->
            <slot v-if="field.slot" :name="field.slot" :field="field" :model="formData" />
            <!-- Custom render function -->
            <component
              :is="() => field.render?.(formData[field.prop], formData)"
              v-else-if="field.render"
            />
            <!-- Default field rendering -->
            <component
              :is="getFieldComponent(field)"
              v-else
              v-model="formData[field.prop]"
              :placeholder="field.placeholder || `请输入${field.label}`"
              v-bind="field.props"
            >
              <!-- Options for select -->
              <template v-if="field.type === 'select' && field.options">
                <component
                  :is="adapter.form.Option"
                  v-for="option in field.options"
                  :key="option.value"
                  :label="option.label"
                  :value="option.value"
                />
              </template>
            </component>
          </component>
        </component>

        <!-- Action buttons -->
        <component :is="adapter.layout.Col" :span="6">
          <component :is="adapter.form.FormItem">
            <component :is="adapter.feedback.Button" type="primary" @click="handleSearch">
              查询
            </component>
            <component :is="adapter.feedback.Button" @click="handleReset"> 重置 </component>
          </component>
        </component>
      </component>
    </component>
  </component>
</template>

<script setup lang="ts">
import { ref, reactive, watch } from 'vue'
import { SearchFieldSchema } from '@/types/schema'
import { useAdapter } from '@/adapters'

const props = defineProps<{
  schema: SearchFieldSchema[]
  modelValue?: Record<string, any>
}>()

const emit = defineEmits<{
  'update:modelValue': [value: Record<string, any>]
  search: [value: Record<string, any>]
  reset: []
}>()

const adapter = useAdapter()
const formRef = ref()
const formData = reactive<Record<string, any>>({})

// Initialize form data
watch(
  () => props.schema,
  (schema) => {
    schema.forEach((field) => {
      if (field.defaultValue !== undefined && formData[field.prop] === undefined) {
        formData[field.prop] = field.defaultValue
      }
    })
  },
  { immediate: true }
)

// Sync with modelValue
watch(
  () => props.modelValue,
  (value) => {
    if (value) {
      Object.assign(formData, value)
    }
  },
  { immediate: true }
)

// Get field component based on type
function getFieldComponent(field: SearchFieldSchema) {
  switch (field.type) {
    case 'select':
      return adapter.form.Select
    case 'date':
    case 'daterange':
      return adapter.form.DatePicker
    case 'number':
      return adapter.form.InputNumber
    default:
      return adapter.form.Input
  }
}

function handleSearch() {
  emit('update:modelValue', { ...formData })
  emit('search', { ...formData })
}

function handleReset() {
  formRef.value?.resetFields()
  // Reset to default values
  props.schema.forEach((field) => {
    if (field.defaultValue !== undefined) {
      formData[field.prop] = field.defaultValue
    } else {
      delete formData[field.prop]
    }
  })
  emit('reset')
  emit('update:modelValue', { ...formData })
}

// Expose methods
defineExpose({
  reset: handleReset,
  search: handleSearch,
})
</script>

<style scoped>
.schema-search {
  margin-bottom: 16px;
}
</style>
