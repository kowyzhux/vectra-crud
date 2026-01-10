<template>
  <slot />
</template>

<script setup lang="ts">
import { provideDictContext, DictLoader } from '@/composables/useDict'

const props = defineProps<{
  loader?: DictLoader
}>()

// Provide dictionary context to child components
provideDictContext(props.loader)
</script>
