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
      <label
        :for="controlId"
        :style="{ backgroundColor: bgColor, color: iconColor }"
        class="form-control-icon colorpicker-label"
      >
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

type UiInputColorProps = {
  disabled?: boolean
  modelValue?: string
  name?: string
  placeholder?: string
  readonly?: boolean
  required?: boolean
  size?: ControlSize
  state?: boolean | null
}

const props = withDefaults(defineProps<UiInputColorProps>(), {
  state: null,
})

const emit = defineEmits(['update:modelValue'])

const baseId = useId()

const controlId = computed(() => `${baseId}-control`)

const bgColor = computed(() => props.modelValue ?? 'transparent')
const iconColor = computed(() => (props.modelValue ? useContrastColor(props.modelValue) : 'inherit'))
const placeholder = computed(() => props.placeholder ?? '#')

function handleInput(event: InputEvent) {
  const target = event.target

  if (target instanceof HTMLInputElement) {
    emit('update:modelValue', target.value)
  }
}
</script>
