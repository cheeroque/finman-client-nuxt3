<template>
  <span
    :aria-label="useString('loading')"
    :class="variant && `spinner-${variant}`"
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

const spinnerSize = computed(() => getCSSUnit(props.size))
</script>
