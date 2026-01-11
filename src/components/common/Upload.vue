<template>
  <div class="upload-stub">
    <el-upload
      :action="action"
      :multiple="multiple"
      :disabled="disabled"
      :file-list="fileList"
      :limit="limit"
      @change="handleChange"
    >
      <el-button type="primary">Click to Upload</el-button>
    </el-upload>
    <div class="upload-tip">
      <slot name="tip">Upload functionality placeholder - implement as needed</slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { ElUpload, ElButton } from 'element-plus'

interface Props {
  modelValue?: any[]
  action?: string
  multiple?: boolean
  disabled?: boolean
  limit?: number
}

const props = withDefaults(defineProps<Props>(), {
  action: '#',
  multiple: false,
  limit: 1
})

const emit = defineEmits<{
  (e: 'update:modelValue', value: any[]): void
  (e: 'change', value: any[]): void
}>()

const fileList = ref<any[]>(props.modelValue || [])

watch(
  () => props.modelValue,
  (val) => {
    fileList.value = val || []
  }
)

const handleChange = (file: any, files: any[]) => {
  emit('update:modelValue', files)
  emit('change', files)
}
</script>

<style scoped>
.upload-stub {
  width: 100%;
}

.upload-tip {
  margin-top: 8px;
  font-size: 12px;
  color: #909399;
}
</style>
