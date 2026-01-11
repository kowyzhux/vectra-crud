<template>
  <el-tag v-if="label" :type="tagType" :color="color">
    {{ label }}
  </el-tag>
  <span v-else>{{ modelValue }}</span>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, computed } from 'vue'
import { ElTag } from 'element-plus'
import { useDict } from '../../core/dict'
import type { DictItem } from '../../types'

interface Props {
  modelValue?: string | number
  dictCode?: string
  options?: DictItem[]
}

const props = defineProps<Props>()

const items = ref<DictItem[]>(props.options || [])
const loading = ref(false)

const currentItem = computed(() => {
  return items.value.find((item) => item.value === props.modelValue)
})

const label = computed(() => currentItem.value?.label || String(props.modelValue || ''))
const color = computed(() => currentItem.value?.color)
const tagType = computed(() => {
  const item = currentItem.value
  return (item as any)?.type || 'info'
})

watch(
  () => props.options,
  (val) => {
    if (val) {
      items.value = val
    }
  }
)

onMounted(async () => {
  if (props.dictCode && !props.options) {
    const dict = useDict(props.dictCode)
    loading.value = true
    await dict.load()
    items.value = dict.items.value
    loading.value = false
  }
})
</script>
