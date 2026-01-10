<template>
  <el-select
    v-model="currentValue"
    :placeholder="placeholder"
    :multiple="multiple"
    :disabled="disabled"
    :loading="loading"
    :clearable="clearable"
    @change="handleChange"
  >
    <el-option
      v-for="item in items"
      :key="item.value"
      :label="item.label"
      :value="item.value"
      :disabled="item.disabled"
    />
  </el-select>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'
import { ElSelect, ElOption } from 'element-plus'
import { useDict } from '../../core/dict'
import type { DictItem } from '../../types'

interface Props {
  modelValue?: string | number | string[] | number[]
  dictCode?: string
  options?: DictItem[]
  placeholder?: string
  multiple?: boolean
  disabled?: boolean
  clearable?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  placeholder: 'Please select',
  clearable: true
})

const emit = defineEmits<{
  (e: 'update:modelValue', value: string | number | string[] | number[] | undefined): void
  (e: 'change', value: string | number | string[] | number[] | undefined): void
}>()

const currentValue = ref(props.modelValue)
const items = ref<DictItem[]>(props.options || [])
const loading = ref(false)

watch(
  () => props.modelValue,
  (val) => {
    currentValue.value = val
  }
)

watch(
  () => props.options,
  (val) => {
    if (val) {
      items.value = val
    }
  }
)

const handleChange = (value: string | number | string[] | number[] | undefined) => {
  emit('update:modelValue', value)
  emit('change', value)
}

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
