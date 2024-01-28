<template>
  <NuxtIcon
    :class="{ 'nuxt-icon-fixed': size }"
    :fill="fill"
    :name="name"
    :style="{ '--nuxt-icon-size': size && `${size}px` }"
  />
</template>

<script setup lang="ts">
type UiIconProps = {
  fill?: boolean
  name: string
  size?: number | string
}

const props = defineProps<UiIconProps>()
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
