<template>
  <NuxtLink :to="page.link" :class="componentClasses">
    <UiIcon :name="`${page.key}-24`" size="24" aria-hidden="true" />
    {{ useString(page.key) }}
  </NuxtLink>
</template>

<script lang="ts" setup>
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
