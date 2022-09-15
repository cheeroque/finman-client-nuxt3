<template>
  <nav class="navbar">
    <UiButton icon="menu-24" icon-size="24" class="navbar-link" @click="emit('toggle:drawer')">
      {{ useString('menu') }}
    </UiButton>
    <UiButton
      v-for="(link, index) in menuLinks"
      :key="`menu-link-${index}`"
      :icon="link.icon"
      :to="link.link"
      icon-size="24"
      :class="getLinkClasses(link)"
    >
      {{ link.text }}
    </UiButton>
  </nav>
</template>

<script lang="ts" setup>
type NavBottomLink = {
  icon: string
  link: string
  text: string
}

const emit = defineEmits(['toggle:drawer'])

const { path } = useRoute()

const menuLinks: NavBottomLink[] = [
  { icon: 'home-24', link: '/', text: useString('home') },
  { icon: 'expenses-24', link: '/expenses', text: useString('expenses') },
  { icon: 'incomes-24', link: '/incomes', text: useString('incomes') },
]

function getLinkClasses(link: NavBottomLink): string[] {
  const classes = ['navbar-link']
  if ((link.link === '/' && path === '/') || (link.link !== '/' && path.startsWith(link.link))) {
    classes.push('active')
  }
  return classes
}
</script>

<style lang="scss" scoped>
.navbar {
  display: flex;
  gap: 0 $grid-gap;
  padding: 0.625rem 0.75rem;
  color: var(--on-surface);
  background-color: var(--surface);
}

.navbar-link {
  @extend .fs-14;

  display: flex;
  flex-direction: column;
  flex: 1 1 0;
  padding: 0;
  line-height: 1.5rem;
  border: none;

  :deep(.nuxt-icon) {
    align-self: stretch;
    margin-bottom: 0.25rem;
    padding: 0.25rem;
    border-radius: 99rem;
    transition: $transition;
    transition-property: background-color;
  }

  &:not(:disabled):not(.disabled) {
    &:hover {
      text-decoration: none;
      color: var(--primary);
      background-color: transparent;
      filter: none;
    }

    &:focus {
      color: var(--secondary);
      background-color: transparent;
      filter: none;
    }

    &.active {
      :deep(.nuxt-icon) {
        background-color: var(--primary-container);
      }
    }
  }
}
</style>
