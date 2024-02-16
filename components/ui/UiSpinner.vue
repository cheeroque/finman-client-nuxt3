<template>
  <span
    :aria-label="useString('loading')"
    :class="variant ? `spinner-${variant}` : null"
    :style="{ '--spinner-size': spinnerSize }"
    class="spinner"
    role="status"
  />
</template>

<script setup lang="ts">
type SpinnerProps = {
  size?: number | string
  variant?: string
}

const props = defineProps<SpinnerProps>()

const spinnerSize = computed(() => {
  if (!props.size) return

  if (!isNaN(Number(props.size))) {
    /* If size prop is number, add `px` */
    return `${props.size}px`
  }

  return props.size
})
</script>
