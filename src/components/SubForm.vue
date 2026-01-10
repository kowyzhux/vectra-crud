<template>
  <div class="sub-form">
    <div v-for="(item, index) in items" :key="index" class="sub-form-item">
      <component :is="adapter.layout.Card">
        <template #header>
          <div class="sub-form-header">
            <span>{{ itemLabel }} {{ index + 1 }}</span>
            <component :is="adapter.feedback.Button" type="danger" text @click="removeItem(index)">
              删除
            </component>
          </div>
        </template>
        <SchemaForm
          :schema="schema"
          :model-value="item"
          @update:model-value="(value) => updateItem(index, value)"
        >
          <!-- Forward all slots -->
          <template v-for="(_, name) in $slots" #[name]="slotProps">
            <slot :name="name" v-bind="slotProps" />
          </template>
        </SchemaForm>
      </component>
    </div>
    <component :is="adapter.feedback.Button" type="primary" @click="addItem">
      添加{{ itemLabel }}
    </component>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { FormFieldSchema } from '@/types/schema'
import { useAdapter } from '@/adapters'
import SchemaForm from './SchemaForm.vue'

const props = withDefaults(
  defineProps<{
    modelValue?: any[]
    schema: FormFieldSchema[]
    itemLabel?: string
  }>(),
  {
    modelValue: () => [],
    itemLabel: '项',
  }
)

const emit = defineEmits<{
  'update:modelValue': [value: any[]]
}>()

const adapter = useAdapter()
const items = ref<any[]>([])

// Sync with modelValue
watch(
  () => props.modelValue,
  (value) => {
    items.value = value ? [...value] : []
  },
  { immediate: true }
)

function addItem() {
  const newItem: any = {}
  // Initialize with default values
  props.schema.forEach((field) => {
    if (field.defaultValue !== undefined) {
      newItem[field.prop] = field.defaultValue
    }
  })
  items.value.push(newItem)
  handleChange()
}

function removeItem(index: number) {
  items.value.splice(index, 1)
  handleChange()
}

function updateItem(index: number, value: any) {
  items.value[index] = value
  handleChange()
}

function handleChange() {
  emit('update:modelValue', [...items.value])
}
</script>

<style scoped>
.sub-form {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.sub-form-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
