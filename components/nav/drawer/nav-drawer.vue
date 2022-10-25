<template>
  <div :class="drawerClasses" role="dialog" aria-modal="true">
    <nav class="nav nav-drawer">
      <ul class="drawer-group list-unstyled">
        <li role="presentation">
          <h5 class="drawer-heading">{{ useString('pages') }}</h5>
        </li>
        <li role="presentation" class="d-none d-lg-block">
          <NavDrawerToggle :open="open" @click="emit('toggle')" />
        </li>
        <li v-for="page in drawerPages" :key="`link-${page.key}`" role="presentation">
          <NavDrawerPage :page="page" @click="emit('close')" />
        </li>
      </ul>
      <ul class="drawer-group list-unstyled">
        <li role="presentation">
          <h5 class="drawer-heading">{{ useString('actions') }}</h5>
        </li>
        <li v-for="action in drawerActions" :key="`action-${action.key}`" role="presentation">
          <component :is="action.component" :action="action" />
        </li>
      </ul>

      <div class="d-lg-none mt-auto p-16">
        <SearchForm />
      </div>
    </nav>
  </div>
  <Transition name="fade">
    <div v-if="open" class="app-drawer-backdrop" aria-hidden="true" @click="emit('close')" />
  </Transition>
</template>

<script lang="ts" setup>
const props = defineProps<{
  open?: boolean
}>()

const emit = defineEmits(['close', 'toggle'])

const drawerActions: DrawerAction[] = [
  { key: 'snapshot', component: resolveComponent('NavDrawerSnapshot') },
  { key: 'export', component: resolveComponent('NavDrawerExport') },
  { key: 'logout', component: resolveComponent('NavDrawerLogout') },
]

const drawerPages: DrawerPage[] = [
  { key: 'home', link: '/' },
  { key: 'categories', link: '/categories' },
  { key: 'calendar', link: '/months' },
]

const drawerClasses = computed(() => {
  let classes = ['app-drawer']
  if (props.open) classes.push('open')
  return classes
})
</script>

<style lang="scss" scoped>
.app-drawer {
  display: flex;
  flex-direction: column;
}

.app-drawer-backdrop {
  position: fixed;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: $backdrop-color;
  cursor: pointer;
  z-index: $zindex-drawer - 1;
}

.nav-drawer {
  flex: 1 1 100%;
}

.drawer-group {
  &:not(:last-of-type) {
    position: relative;
    padding-bottom: calc(1rem + 1px);

    &::after {
      display: block;
      content: '';
      position: absolute;
      left: 1rem;
      right: 1rem;
      bottom: 0.5rem;
      height: 1px;
      background-color: var(--secondary);
      opacity: 0.25;
    }
  }
}

.drawer-heading,
.drawer-toggle,
.drawer-item {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  width: 100%;
  margin: 0;
  padding: 1rem;
  font-family: $font-family-base;
  border: none;
}

.drawer-heading {
  font-weight: $font-weight-medium;
  line-height: $line-height-base * $font-size-base;
}

.drawer-toggle,
.drawer-item {
  border-radius: $dialog-border-radius;
  color: inherit;

  &:not(:disabled):not(.disabled) {
    &:focus,
    &:hover {
      text-decoration: none;
      color: var(--secondary);
      background-color: transparent;
    }

    &:focus-visible {
      box-shadow: 0 0 0 $control-focus-outline-width var(--secondary-outline);
    }
  }
}

.drawer-item {
  :deep(.nuxt-icon) {
    margin-right: 0.75rem;
  }

  &.active {
    color: var(--on-secondary);
    background-color: var(--secondary);

    &:not(:disabled):not(.disabled) {
      &:focus,
      &:hover {
        color: var(--on-secondary);
        background-color: var(--secondary-active);
      }
    }
  }
}

:deep(.search-form) {
  .form-control {
    border-radius: $dialog-border-radius;
  }

  .form-control-el {
    border-radius: $dialog-border-radius;
    color: var(--on-surface-variant);
    background-color: var(--surface-variant);

    &::placeholder {
      color: var(--secondary);
    }
  }

  .form-control-append {
    color: var(--secondary);
  }
}

@include media-max-width(lg) {
  .app-drawer {
    position: fixed;
    left: 0;
    top: 0;
    width: 85%;
    height: 100%;
    padding: $grid-gap * 0.5;
    border-radius: 0 $dialog-border-radius $dialog-border-radius 0;
    color: $dialog-color;
    background-color: $dialog-bg;
    transform: translateX(-100%);
    transition: $transition;
    transition-property: transform;
    z-index: $zindex-drawer;

    &.open {
      transform: translateX(0);
    }
  }

  .nav-drawer {
    display: flex;
    flex-direction: column;
  }
}

@include media-min-width(lg) {
  .app-drawer {
    flex: 0 0 auto;
    padding: $grid-gap 0 $grid-gap $grid-gap;
  }

  .nav-drawer {
    width: calc(24px + 2rem);
    transition: $transition;
    transition-property: width;

    .open & {
      width: 240px;
    }
  }

  .drawer-group {
    &:not(:last-of-type) {
      &::after {
        left: 0;
        right: 0;
        background-color: var(--primary);
      }
    }
  }

  .drawer-toggle,
  .drawer-item {
    margin-bottom: 0.5rem;
    text-align: left;
    white-space: nowrap;
    overflow: hidden;

    &:not(:disabled):not(.disabled) {
      &:focus,
      &:hover {
        color: var(--primary);
        background-color: transparent;
      }

      &:focus-visible {
        box-shadow: 0 0 0 $control-focus-outline-width var(--primary-outline);
      }
    }
  }

  .drawer-item {
    :deep(.caption) {
      opacity: 0;
      transition: $transition;
      transition-property: opacity;
      .open & {
        opacity: 1;
      }
    }

    :deep(.nuxt-icon) {
      margin-right: 1rem;
    }

    &.active {
      color: var(--on-primary);
      background-color: var(--primary);

      &:not(:disabled):not(.disabled) {
        &:focus {
          color: var(--on-primary);
          background-color: var(--primary);
        }

        &:hover {
          color: var(--on-primary);
          background-color: var(--primary-active);
        }
      }
    }
  }

  .app-drawer-backdrop,
  .drawer-heading {
    display: none;
  }
}
</style>
