<template>
  <UiButton :class="componentClasses" :icon="`${page.key}-24`" :to="page.link" icon-size="24">
    <span class="caption">{{ useString(page.key) }}</span>
  </UiButton>
</template>

<script setup lang="ts">
interface DrawerPage {
  key: string
  link: string
}

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
