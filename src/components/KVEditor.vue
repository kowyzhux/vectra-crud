<template>
  <div class="kv-editor">
    <div v-for="(item, index) in items" :key="index" class="kv-item">
      <component
        :is="adapter.form.Input"
        v-model="item.key"
        :placeholder="keyPlaceholder"
        class="kv-key"
        @input="handleChange"
      />
      <component
        :is="adapter.form.Input"
        v-model="item.value"
        :placeholder="valuePlaceholder"
        class="kv-value"
        @input="handleChange"
      />
      <component :is="adapter.feedback.Button" type="danger" text @click="removeItem(index)">
        删除
      </component>
    </div>
    <component :is="adapter.feedback.Button" type="primary" text @click="addItem"> 添加 </component>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { useAdapter } from '@/adapters'

interface KVItem {
  key: string
  value: string
}

const props = withDefaults(
  defineProps<{
    modelValue?: KVItem[]
    keyPlaceholder?: string
    valuePlaceholder?: string
  }>(),
  {
    modelValue: () => [],
    keyPlaceholder: '键',
    valuePlaceholder: '值',
  }
)

const emit = defineEmits<{
  'update:modelValue': [value: KVItem[]]
}>()

const adapter = useAdapter()
const items = ref<KVItem[]>([])

// Sync with modelValue
watch(
  () => props.modelValue,
  (value) => {
    items.value = value ? [...value] : []
  },
  { immediate: true }
)

function addItem() {
  items.value.push({ key: '', value: '' })
  handleChange()
}

function removeItem(index: number) {
  items.value.splice(index, 1)
  handleChange()
}

function handleChange() {
  emit('update:modelValue', [...items.value])
}
</script>

<style scoped>
.kv-editor {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.kv-item {
  display: flex;
  gap: 8px;
  align-items: center;
}

.kv-key,
.kv-value {
  flex: 1;
}
</style>
