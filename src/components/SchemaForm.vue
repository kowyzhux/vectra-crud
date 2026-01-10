<template>
  <component
    :is="adapter.form.Form"
    ref="formRef"
    :model="formData"
    :rules="formRules"
    v-bind="formProps"
  >
    <component
      :is="adapter.form.FormItem"
      v-for="field in visibleFields"
      :key="field.prop"
      :label="field.label"
      :prop="field.prop"
      :rules="field.rules"
    >
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
        :disabled="getFieldDisabled(field)"
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
        <!-- Options for radio -->
        <template v-if="field.type === 'radio' && field.options">
          <component
            :is="adapter.form.Radio"
            v-for="option in field.options"
            :key="option.value"
            :label="option.value"
          >
            {{ option.label }}
          </component>
        </template>
        <!-- Options for checkbox -->
        <template v-if="field.type === 'checkbox' && field.options">
          <component
            :is="adapter.form.Checkbox"
            v-for="option in field.options"
            :key="option.value"
            :label="option.value"
          >
            {{ option.label }}
          </component>
        </template>
      </component>
    </component>
  </component>
</template>

<script setup lang="ts">
import { ref, reactive, computed, watch } from 'vue'
import { FormFieldSchema } from '@/types/schema'
import { useAdapter } from '@/adapters'

const props = defineProps<{
  schema: FormFieldSchema[]
  modelValue?: Record<string, any>
  formProps?: Record<string, any>
}>()

const emit = defineEmits<{
  'update:modelValue': [value: Record<string, any>]
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

// Sync changes back to parent
watch(
  formData,
  (value) => {
    emit('update:modelValue', { ...value })
  },
  { deep: true }
)

// Filter visible fields
const visibleFields = computed(() => {
  return props.schema.filter((field) => {
    if (typeof field.hidden === 'function') {
      return !field.hidden(formData)
    }
    return !field.hidden
  })
})

// Compute form rules
const formRules = computed(() => {
  const rules: Record<string, any[]> = {}
  props.schema.forEach((field) => {
    if (field.required || field.rules) {
      const fieldRules = field.rules || []
      if (field.required) {
        fieldRules.unshift({
          required: true,
          message: `请输入${field.label}`,
          trigger: 'blur',
        })
      }
      rules[field.prop] = fieldRules
    }
  })
  return rules
})

// Get field component based on type
function getFieldComponent(field: FormFieldSchema) {
  switch (field.type) {
    case 'textarea':
      return adapter.form.Input
    case 'select':
      return adapter.form.Select
    case 'radio':
      return adapter.form.RadioGroup
    case 'checkbox':
      return adapter.form.CheckboxGroup
    case 'date':
      return adapter.form.DatePicker
    case 'number':
      return adapter.form.InputNumber
    case 'switch':
      return adapter.form.Switch
    case 'upload':
      return adapter.form.Upload
    default:
      return adapter.form.Input
  }
}

// Get field disabled state
function getFieldDisabled(field: FormFieldSchema) {
  if (typeof field.disabled === 'function') {
    return field.disabled(formData)
  }
  return field.disabled
}

// Validate form
async function validate() {
  return formRef.value?.validate()
}

// Reset form
function reset() {
  formRef.value?.resetFields()
}

// Expose methods
defineExpose({
  validate,
  reset,
  formRef,
})
</script>
