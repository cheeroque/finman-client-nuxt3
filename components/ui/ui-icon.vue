<template>
  <NuxtIcon
    :fill="fill"
    :name="name"
    :class="{ 'nuxt-icon-fixed': size }"
    :style="{ '--nuxt-icon-size': `${size}px` }"
  />
</template>

<script lang="ts" setup>
const props = defineProps<{
  fill?: boolean
  name: string
  size?: number | string
}>()
</script>

<style lang="scss" scoped>
.nuxt-icon-fixed {
  :deep(svg) {
    width: var(--nuxt-icon-size);
    height: var(--nuxt-icon-size);
    margin-bottom: 0;
  }
}
</style>
