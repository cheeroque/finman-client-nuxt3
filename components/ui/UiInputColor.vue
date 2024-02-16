<template>
  <UiInput
    :disabled="disabled"
    :model-value="modelValue"
    :name="name"
    :placeholder="placeholder"
    :readonly="readonly"
    :required="required"
    :size="size"
    :state="state"
    autocomplete="off"
    @input="handleInput"
  >
    <template #append>
      <label :for="controlId" :style="labelStyles" class="form-control-icon colorpicker-label">
        <input
          :id="controlId"
          :value="modelValue"
          class="colorpicker-input"
          type="color"
          @input="handleInput($event as InputEvent)"
        />

        <UiIcon aria-hidden="true" name="eyedropper-24" size="16" />
      </label>
    </template>
  </UiInput>
</template>

<script setup lang="ts">
import type { ControlSize } from '~/types'

type InputColorProps = {
  disabled?: boolean
  modelValue?: string
  name?: string
  placeholder?: string
  readonly?: boolean
  required?: boolean
  size?: ControlSize
  state?: boolean | null
}

const props = withDefaults(defineProps<InputColorProps>(), {
  placeholder: '#',
  state: null,
})

const emit = defineEmits(['update:modelValue'])

const controlId = useId()

const labelStyles = computed(() => ({
  backgroundColor: props.modelValue ?? 'transparent',
  color: props.modelValue ? getContrastColor(props.modelValue) : 'inherit',
}))

function handleInput(event: InputEvent) {
  const target = event.target

  if (target instanceof HTMLInputElement) {
    emit('update:modelValue', target.value)
  }
}
</script>
