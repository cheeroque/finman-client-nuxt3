<template>
  <div class="icon-wrapper">
    <UiSpinner v-if="loading" />

    <UiIcon v-else v-bind="{ name, size }" :aria-hidden="iconAriaLabel ? undefined : true" />
  </div>
</template>

<script setup lang="ts">
type ButtonIconProps = {
  iconAriaLabel?: string
  loading?: boolean
  name: string
  size?: number | string
}

const props = defineProps<ButtonIconProps>()

const wrapperSize = computed(() => getCSSUnit(props.size))
</script>

<style scoped>
.icon-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  width: v-bind(wrapperSize);
  height: v-bind(wrapperSize);
}

:deep(.spinner) {
  width: calc(v-bind(wrapperSize) * 0.75);
  height: calc(v-bind(wrapperSize) * 0.75);
}
</style>
