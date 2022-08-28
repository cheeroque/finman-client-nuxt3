<template>
  <div :class="componentClasses" class="form-select">
    <select
      ref="select"
      :id="id"
      :class="componentClasses"
      :disabled="disabled"
      :name="name"
      :required="required"
      autocomplete="off"
      class="form-control"
      @input="onInput"
    >
      <option
        v-for="(option, index) in options"
        :key="`option-${index}`"
        :disabled="option.disabled"
        :selected="option.value === modelValue"
        :value="option.value"
      >
        {{ option.text }}
      </option>
    </select>
    <span class="form-select-indicator" aria-hidden="true">
      <UiIcon name="select-indicator" size="16" />
    </span>
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

interface SelectInputEventTarget extends EventTarget {
  value: string
}

interface SelectInputEvent extends InputEvent {
  target: SelectInputEventTarget
}

const props = defineProps<{
  disabled?: boolean
  modelValue?: SelectValue | SelectValue[]
  name?: string
  options?: SelectOption[]
  required?: boolean
  size?: string
  valid?: boolean
  validated?: boolean
}>()
const emit = defineEmits(['update:modelValue'])

const id: ComputedRef<string> = inject('control-id')
const validationState = computed(() => (props.validated ? props.valid : null))

const groupSize: ComputedRef<string> = inject('group-size')
const size = computed(() => props.size || groupSize?.value)

const groupDisabled: ComputedRef<boolean> = inject('group-disabled')
const disabled = computed(() => props.disabled || groupDisabled?.value)

const componentClasses = computed(() => {
  const classes = []
  if (disabled.value) {
    classes.push('disabled')
  }
  if (size.value) {
    classes.push(`form-control-${size.value}`)
  }
  if (validationState.value === true) {
    classes.push('is-valid')
  }
  if (validationState.value === false) {
    classes.push('is-invalid')
  }
  return classes
})

function onInput(event: SelectInputEvent): void {
  emit('update:modelValue', event.target.value)
}
</script>
