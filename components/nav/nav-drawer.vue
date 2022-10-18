<template>
  <div :class="drawerClasses" role="dialog" aria-modal="true">
    <nav class="nav nav-drawer">
      <ul class="drawer-group list-unstyled">
        <li role="presentation">
          <h5 class="drawer-heading">{{ useString('pages') }}</h5>
        </li>
        <li v-for="page in drawerPages" :key="`link-${page.key}`" role="presentation">
          <NavDrawerPage :page="page" />
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

const emit = defineEmits(['close'])

const drawerActions: DrawerAction[] = [
  { key: 'snapshot', component: 'NavDrawerSnapshot' },
  { key: 'export', component: 'NavDrawerExport' },
  { key: 'logout', component: 'NavDrawerLogout' },
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

.app-drawer {
  display: flex;
  flex-direction: column;
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
.drawer-item {
  display: flex;
  align-items: center;
  width: 100%;
  margin: 0;
  padding: 1rem;
}

.drawer-heading {
  font-weight: $font-weight-medium;
  line-height: $line-height-base * $font-size-base;
}

.drawer-item {
  border-radius: $dialog-border-radius;
  color: inherit;

  :deep(.nuxt-icon) {
    margin-right: 0.75rem;
  }

  &:hover {
    text-decoration: none;
    color: var(--secondary);
  }

  &.active {
    color: var(--on-secondary);
    background-color: var(--secondary);
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
}

@include media-min-width(lg) {
  .app-drawer {
    flex: 0 0 auto;
    padding: $grid-gap 0 $grid-gap $grid-gap;
  }
}
</style>
