<template>
  <nav class="nav nav-page-transactions">
    <UiButton
      v-for="(link, index) in navLinks"
      :key="`nav-link-${index}`"
      :class="getLinkClasses(link)"
      :icon="link.icon"
      :to="link.link"
      icon-size="24"
    >
      {{ link.text }}
    </UiButton>
  </nav>
</template>

<script setup lang="ts">
import type { NavLink } from '~/types'

const route = useRoute()

const navLinks: NavLink[] = [
  { icon: 'home-24', link: '/', text: useString('allTransactions') },
  { icon: 'expenses-24', link: '/view/expense', text: useString('expensesOnly') },
  { icon: 'incomes-24', link: '/view/income', text: useString('incomesOnly') },
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
.nav-page-transactions {
  display: flex;
  border-top: $border-width solid var(--primary-outline);
}

.navbar-link {
  flex: 1 1 auto;
  padding: 0.75rem 1rem;
  font-family: $font-family-base;
  font-size: $font-size-base * 0.875;
  white-space: nowrap;
  border-radius: 0;
  border: none;
  color: var(--on-background);

  &:not(:disabled):not(.disabled) {
    &:hover,
    &:focus {
      color: var(--primary);
      background-color: transparent;
    }

    &.active {
      color: var(--on-primary);
      background-color: var(--primary);

      &:hover {
        color: var(--on-primary);
        background-color: var(--primary-active);
      }
    }
  }
}

@include media-min-width(xl) {
  .navbar-link {
    flex: 1 1 0;
  }
}

@include media-min-width(xxl) {
  .nav-page-transactions {
    gap: 0 0.75rem;
    border-top: none;
  }

  .navbar-link {
    padding-left: 1.25rem;
    padding-right: 1.25rem;
    border-radius: 99rem;
  }
}
</style>
