<template>
  <NuxtIcon
    :class="{ 'nuxt-icon-fixed': Boolean(size) }"
    :fill="fill"
    :name="name"
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

const iconSize = computed(() => {
  if (!props.size) return

  if (!isNaN(Number(props.size))) {
    /* If size prop is number, add `px` */
    return `${props.size}px`
  }

  return props.size
})
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
