<template>
  <NuxtIcon
    :fill="fill"
    :name="name"
    :class="{ 'nuxt-icon-fixed': size }"
    :style="{ '--nuxt-icon-size': size && `${size}px` }"
  />
</template>

<script setup lang="ts">
const props = defineProps<{
  fill?: boolean
  name: string
  size?: number | string
}>()
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
