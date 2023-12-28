<template>
  <UiButton :aria-label="title" :class="{ active: modelValue }" :title="title" class="btn-chart" @click="handleClick">
    <span aria-hidden="true" class="icon">
      <span class="icon-bar" />
      <span class="icon-bar" />
      <span class="icon-bar" />
    </span>
  </UiButton>
</template>

<script setup lang="ts">
interface ChartButtonProps {
  modelValue?: boolean
}

const props = defineProps<ChartButtonProps>()

const emit = defineEmits(['update:modelValue'])

const title = computed(() => useString(props.modelValue ? 'hideChart' : 'showChart'))

function handleClick() {
  emit('update:modelValue', !props.modelValue)
}
</script>

<style lang="scss" scoped>
.icon {
  position: relative;
  width: 24px;
  height: 24px;
}

.icon-bar {
  position: absolute;
  bottom: 12.5%;
  left: 37.5%;
  width: 25%;
  height: 75%;
  border: 2px solid currentColor;
  background-color: transparent;
  transition: $transition;
  transition-property: height, background-color;

  &:first-child {
    left: 8.33333%;
    height: 33.33333%;
  }

  &:last-child {
    left: 66.66667%;
    height: 54.16667%;
  }
}

.active {
  .icon-bar {
    background-color: currentColor;

    &:first-child {
      height: 54.16667%;
    }

    &:last-child {
      height: 33.33333%;
    }
  }
}
</style>
