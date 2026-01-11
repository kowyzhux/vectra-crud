<template>
  <div class="subform-container">
    <div v-for="(item, index) in items" :key="index" class="subform-item">
      <div class="subform-item-header">
        <span class="subform-item-title">Item {{ index + 1 }}</span>
        <el-button type="danger" size="small" text @click="removeItem(index)">
          Remove
        </el-button>
      </div>
      <el-form :model="item" label-width="120px" class="subform-item-form">
        <el-form-item
          v-for="field in fields"
          :key="field.prop"
          :label="field.label"
          :prop="field.prop"
        >
          <component
            :is="getFieldComponent(field)"
            v-model="item[field.prop]"
            :placeholder="field.placeholder"
            :disabled="field.disabled"
          />
        </el-form-item>
      </el-form>
    </div>
    <el-button type="primary" plain @click="addItem">Add Item</el-button>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { ElButton, ElForm, ElFormItem, ElInput } from 'element-plus'
import type { FormFieldSchema } from '../../types'

interface Props {
  modelValue?: any[]
  fields?: FormFieldSchema[]
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: () => [],
  fields: () => []
})

const emit = defineEmits<{
  (e: 'update:modelValue', value: any[]): void
  (e: 'change', value: any[]): void
}>()

const items = ref<any[]>([...(props.modelValue || [])])

watch(
  () => props.modelValue,
  (val) => {
    items.value = [...(val || [])]
  }
)

watch(
  items,
  (val) => {
    emit('update:modelValue', val)
    emit('change', val)
  },
  { deep: true }
)

const addItem = () => {
  const newItem: any = {}
  props.fields.forEach((field) => {
    newItem[field.prop] = field.defaultValue || null
  })
  items.value.push(newItem)
}

const removeItem = (index: number) => {
  items.value.splice(index, 1)
}

const getFieldComponent = (field: FormFieldSchema) => {
  return ElInput
}
</script>

<style scoped>
.subform-container {
  width: 100%;
}

.subform-item {
  border: 1px solid #e4e7ed;
  border-radius: 4px;
  padding: 16px;
  margin-bottom: 12px;
}

.subform-item-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.subform-item-title {
  font-weight: 600;
}

.subform-item-form {
  margin-top: 12px;
}
</style>
