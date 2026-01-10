<template>
  <component :is="adapter.feedback.Tag" v-if="item" :type="item.color || 'info'">
    {{ item.label }}
  </component>
  <span v-else>{{ value }}</span>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useDict } from '@/composables/useDict'
import { useAdapter } from '@/adapters'

const props = defineProps<{
  code: string
  value: any
}>()

const adapter = useAdapter()
const { getItem, load } = useDict(props.code)

// Load dictionary on mount
onMounted(() => {
  load(props.code)
})

// Get dictionary item
const item = computed(() => getItem(props.value))
</script>
