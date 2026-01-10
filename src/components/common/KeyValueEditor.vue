<template>
  <div class="keyvalue-editor">
    <div v-for="(item, index) in pairs" :key="index" class="keyvalue-row">
      <el-input v-model="item.key" placeholder="Key" class="keyvalue-key" />
      <el-input v-model="item.value" placeholder="Value" class="keyvalue-value" />
      <el-button type="danger" size="small" text @click="removePair(index)">
        Remove
      </el-button>
    </div>
    <el-button type="primary" plain size="small" @click="addPair">Add Pair</el-button>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { ElButton, ElInput } from 'element-plus'

interface KeyValuePair {
  key: string
  value: string
}

interface Props {
  modelValue?: Record<string, string> | KeyValuePair[]
}

const props = defineProps<Props>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: Record<string, string>): void
  (e: 'change', value: Record<string, string>): void
}>()

const pairs = ref<KeyValuePair[]>([])

const initPairs = (value?: Record<string, string> | KeyValuePair[]) => {
  if (!value) {
    pairs.value = []
    return
  }

  if (Array.isArray(value)) {
    pairs.value = [...value]
  } else {
    pairs.value = Object.entries(value).map(([key, value]) => ({ key, value }))
  }
}

watch(
  () => props.modelValue,
  (val) => {
    initPairs(val)
  },
  { immediate: true }
)

watch(
  pairs,
  (val) => {
    const obj: Record<string, string> = {}
    val.forEach((pair) => {
      if (pair.key) {
        obj[pair.key] = pair.value
      }
    })
    emit('update:modelValue', obj)
    emit('change', obj)
  },
  { deep: true }
)

const addPair = () => {
  pairs.value.push({ key: '', value: '' })
}

const removePair = (index: number) => {
  pairs.value.splice(index, 1)
}
</script>

<style scoped>
.keyvalue-editor {
  width: 100%;
}

.keyvalue-row {
  display: flex;
  gap: 8px;
  margin-bottom: 8px;
  align-items: center;
}

.keyvalue-key {
  flex: 1;
}

.keyvalue-value {
  flex: 2;
}
</style>
