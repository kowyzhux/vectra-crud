<template>
  <component
    :is="adapter.form.Upload"
    v-bind="uploadProps"
    :file-list="fileList"
    :on-change="handleChange"
    :on-remove="handleRemove"
  >
    <component :is="adapter.feedback.Button" type="primary"> 上传文件 </component>
  </component>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { useAdapter } from '@/adapters'

interface FileItem {
  name: string
  url?: string
  [key: string]: any
}

const props = withDefaults(
  defineProps<{
    modelValue?: FileItem[]
    uploadProps?: Record<string, any>
  }>(),
  {
    modelValue: () => [],
    uploadProps: () => ({}),
  }
)

const emit = defineEmits<{
  'update:modelValue': [value: FileItem[]]
}>()

const adapter = useAdapter()
const fileList = ref<FileItem[]>([])

// Sync with modelValue
watch(
  () => props.modelValue,
  (value) => {
    fileList.value = value ? [...value] : []
  },
  { immediate: true }
)

function handleChange(file: any, files: any[]) {
  fileList.value = files
  emit('update:modelValue', [...files])
}

function handleRemove(file: any, files: any[]) {
  fileList.value = files
  emit('update:modelValue', [...files])
}
</script>
