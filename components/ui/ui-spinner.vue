<template>
  <span
    :aria-label="useString('loading')"
    :class="variant ? `spinner-${variant}` : null"
    class="spinner"
    role="status"
  />
</template>

<script lang="ts" setup>
const props = defineProps<{
  variant?: string
}>()
</script>
