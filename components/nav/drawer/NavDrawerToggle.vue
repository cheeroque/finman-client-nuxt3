<template>
  <UiButton
    :aria-label="buttonTitle"
    :class="{ open: open }"
    :title="buttonTitle"
    class="drawer-toggle"
    variant="link"
    @click="emit('click')"
  >
    <span class="drawer-toggle-icon">
      <span />
      <span />
      <span />
    </span>
  </UiButton>
</template>

<script setup lang="ts">
interface NavDrawerToggleProps {
  open?: boolean
}

const props = defineProps<NavDrawerToggleProps>()

const emit = defineEmits(['click'])

const buttonTitle = computed(() => useString(props.open ? 'collapseMenu' : 'expandMenu'))
</script>

<style lang="scss" scoped>
.drawer-toggle-icon {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: 24px;
  height: 24px;
  padding: 4px 3px;

  & > span {
    width: auto;
    height: 2px;
    background-color: currentColor;
    transform: scaleX(1);
    transform-origin: left;
    transition: $transition;
    transition-property: transform;
  }

  .open & {
    & > span {
      &:nth-child(2) {
        transform: scaleX(0.6);
      }

      &:nth-child(3) {
        transform: scaleX(0.85);
      }
    }
  }
}
</style>
