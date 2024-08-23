<template>
  <NuxtIcon
    v-bind="{ fill, name }"
    :class="{ 'nuxt-icon-fixed': Boolean(size) }"
    :style="{ '--nuxt-icon-size': iconSize }"
  />
</template>

<script setup lang="ts">
type IconProps = {
  fill?: boolean
  name: string
  size?: number | string
}

const props = defineProps<IconProps>()

const iconSize = computed(() => getCSSUnit(props.size))
</script>

<style lang="scss" scoped>
.nuxt-icon-fixed {
  line-height: 0;

  :deep(svg) {
    width: var(--nuxt-icon-size);
    height: var(--nuxt-icon-size);
    margin-bottom: 0;
  }
}
</style>
