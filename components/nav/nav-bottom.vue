<template>
  <nav class="nav nav-bottom">
    <UiButton icon="menu-24" icon-size="24" class="navbar-link" @click="emit('toggle:drawer')">
      {{ useString('menu') }}
    </UiButton>

    <UiButton
      v-for="(link, index) in menuLinks"
      :key="`menu-link-${index}`"
      :icon="link.icon"
      :to="link.link"
      :class="getLinkClasses(link)"
      icon-size="24"
    >
      {{ link.text }}
    </UiButton>
  </nav>
</template>

<script setup lang="ts">
import type { NavLink } from '~/types/nav'

const emit = defineEmits(['toggle:drawer'])

const route = useRoute()

const menuLinks: NavLink[] = [
  { icon: 'home-24', link: '/', text: useString('home') },
  { icon: 'expenses-24', link: '/view/expense', text: useString('expenses') },
  { icon: 'incomes-24', link: '/view/income', text: useString('incomes') },
]

function getLinkClasses(link: NavLink): string[] {
  const classes = ['navbar-link']

  if ((link.link === '/' && route.path === '/') || (link.link !== '/' && route.path.startsWith(link.link))) {
    classes.push('active')
  }

  return classes
}
</script>

<style lang="scss" scoped>
.nav-bottom {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  gap: 0 $grid-gap;
  padding: 0.625rem 0.75rem;
  color: var(--on-surface);
  background-color: var(--surface);
  z-index: $zindex-dropdown + 1;
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
    margin-right: 0;
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
    }

    &:focus {
      background-color: transparent;
    }

    &.active {
      :deep(.nuxt-icon) {
        background-color: var(--primary-bg);
      }
    }
  }
}

@include media-min-width(lg) {
  .nav-bottom {
    display: none;
  }
}
</style>
