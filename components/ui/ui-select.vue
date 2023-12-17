<template>
  <div :class="componentClasses">
    <select
      :id="id"
      :disabled="disabled"
      :name="name"
      :required="required"
      :value="modelValue"
      autocomplete="off"
      class="form-control-el"
      @input="handleInput"
    >
      <option
        v-for="(option, index) in options"
        :key="`option-${index}`"
        :disabled="option.disabled"
        :value="option.value"
      >
        <slot name="option-text" :option="option" :text="option.text">
          {{ option.text }}
        </slot>
      </option>
    </select>

    <div class="form-control-append">
      <span aria-hidden="true" class="form-select-indicator">
        <UiIcon name="select-indicator" />
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { ComputedRef } from 'vue'

type SelectValue = number | string | null

interface SelectOption {
  disabled?: boolean
  text: string
  value: SelectValue
}

interface UiSelectProps {
  disabled?: boolean
  modelValue?: SelectValue
  name?: string
  options?: SelectOption[]
  required?: boolean
  size?: ControlSize
  state?: ControlState
}

const props = defineProps<UiSelectProps>()

const emit = defineEmits(['input', 'update:modelValue'])

/* Injects from parent */
const id = inject<ComputedRef<string> | undefined>('controlId', undefined)

const parentDisabled = inject(
  'disabled',
  computed(() => false)
)

const parentState = inject(
  'state',
  computed(() => null)
)

const disabled = computed(() => props.disabled || parentDisabled.value)
const size = computed(() => props.size)
const state = computed(() => props.state ?? parentState.value)

const componentClasses = computed(() => {
  const classes = ['form-control form-control-select']

  if (disabled.value) {
    classes.push('disabled')
  }

  if (size.value) {
    classes.push(`form-control-${size.value}`)
  }

  if (state.value === true) {
    classes.push('is-valid')
  }

  if (state.value === false) {
    classes.push('is-invalid')
  }

  return classes
})

function handleInput(event: Event) {
  const target = event.target as HTMLSelectElement

  emit('input', event)
  emit('update:modelValue', target.value)
}
</script>
