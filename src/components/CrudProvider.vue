<template>
  <slot />
</template>

<script setup lang="ts">
import { provideCrudContext } from '@/composables/useCrud'
import { CrudConfig } from '@/types/context'

const props = defineProps<{
  config?: CrudConfig
}>()

// Provide CRUD context to child components
provideCrudContext(props.config || {})
</script>
