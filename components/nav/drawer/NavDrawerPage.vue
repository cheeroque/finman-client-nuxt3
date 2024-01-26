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

interface NavDrawerPageProps {
  page: DrawerPage
}

const props = defineProps<NavDrawerPageProps>()

const route = useRoute()

const componentClasses = computed(() => {
  const { path } = route
  const classes = ['drawer-item']

  if ((props.page.link === '/' && path === '/') || (props.page.link !== '/' && path.startsWith(props.page.link))) {
    classes.push('active')
  }

  return classes
})
</script>
