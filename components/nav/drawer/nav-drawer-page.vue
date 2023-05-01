<template>
  <UiButton :to="page.link" :icon="`${page.key}-24`" icon-size="24" :class="componentClasses">
    <span class="caption">{{ useString(page.key) }}</span>
  </UiButton>
</template>

<script setup lang="ts">
import { DrawerPage } from '~~/types/drawer'

const props = defineProps<{
  page: DrawerPage
}>()

const componentClasses = computed(() => {
  const { path } = useRoute()
  const classes = ['drawer-item']

  if ((props.page.link === '/' && path === '/') || (props.page.link !== '/' && path.startsWith(props.page.link))) {
    classes.push('active')
  }

  return classes
})
</script>
