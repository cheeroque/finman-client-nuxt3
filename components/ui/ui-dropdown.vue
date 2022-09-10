<template>
  <div ref="dropdown" class="dropdown">
    <slot name="toggle" :hide="hide" :show="show" :toggle="toggle">
      <UiButton
        :block="block"
        :disabled="disabled"
        :icon="icon"
        :icon-right="iconRight"
        :size="size"
        :variant="variant"
        @click="toggle"
      >
        {{ text }}
      </UiButton>
    </slot>
    <UiCollapse
      :modelValue="localVisible"
      transition="dropdown"
      collapse-class="dropdown-menu"
      @hidden="$emit('hidden')"
      @update:modelValue="handleUpdate"
    >
      <template #default="{ close }">
        <slot :close="close"></slot>
      </template>
    </UiCollapse>
  </div>
</template>

<script lang="ts" setup>
const props = defineProps<{
  block?: boolean
  disabled?: boolean
  icon?: string
  iconRight?: boolean
  modelValue?: boolean
  size?: ControlSize
  text?: string
  variant?: string
}>()
const emit = defineEmits(['update:modelValue', 'hidden'])

const dropdown = ref(null)

const localVisible = computed({
  get: () => props.modelValue ?? false,
  set: (event) => {
    emit('update:modelValue', event)
    if (event) {
      document.addEventListener('click', handleClickOutside)
    } else {
      document.removeEventListener('click', handleClickOutside)
    }
  },
})

function handleClickOutside(event: InputEvent): void {
  if (!dropdown.value.contains(event.target)) {
    hide()
  }
}

function handleUpdate(event: boolean): void {
  localVisible.value = event
}

function hide() {
  handleUpdate(false)
}

function show() {
  handleUpdate(true)
}

function toggle() {
  handleUpdate(!localVisible.value)
}
</script>

<style lang="scss" scoped>
.dropdown {
  position: relative;
}

.dropdown-menu {
  position: absolute;
  left: 0;
  top: 100%;
  z-index: $zindex-dropdown;
}
</style>
