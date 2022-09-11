<template>
  <div :class="componentClasses">
    <select
      v-model="modelValue"
      :id="id"
      :disabled="disabled"
      :name="name"
      :required="required"
      autocomplete="off"
      class="form-control-el"
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
      <span class="form-select-indicator" aria-hidden="true">
        <UiIcon name="select-indicator" />
      </span>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ComputedRef } from 'vue'

type SelectValue = number | string | null

type SelectOption = {
  disabled?: boolean
  text: string
  value: SelectValue
}

const props = defineProps<{
  disabled?: boolean
  modelValue?: SelectValue
  name?: string
  options?: SelectOption[]
  required?: boolean
  size?: ControlSize
  state?: ControlState
}>()

/* Injects from parent */
const id: ComputedRef<string> | null = inject('controlId', null)
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
</script>
