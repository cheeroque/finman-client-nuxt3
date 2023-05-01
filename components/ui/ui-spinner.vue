<template>
  <span
    :aria-label="useString('loading')"
    :class="variant ? `spinner-${variant}` : null"
    :style="{ '--spinner-size': parsedSize }"
    class="spinner"
    role="status"
  />
</template>

<script setup lang="ts">
const props = defineProps<{
  size?: number | string
  variant?: string
}>()

const parsedSize = computed(() => {
  if (!props.size) return

  const isNumber = typeof props.size === 'number' || `${props.size}` === `${parseInt(props.size || '')}`

  return isNumber ? `${props.size}px` : props.size
})
</script>
