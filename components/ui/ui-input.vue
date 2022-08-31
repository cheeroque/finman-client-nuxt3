<template>
  <input
    :id="id"
    :autocomplete="autocomplete"
    :class="componentClasses"
    :disabled="disabled"
    :max="max"
    :min="min"
    :name="name"
    :placeholder="placeholder"
    :readonly="readonly"
    :required="required"
    :step="step"
    :type="inputType"
    :value="modelValue"
    class="form-control"
    @input="onInput"
  />
</template>

<script lang="ts" setup>
import { ComputedRef } from 'vue'

interface InputInputEventTarget extends EventTarget {
  value: string
}

interface InputInputEvent extends InputEvent {
  target: InputInputEventTarget
}

const props = defineProps<{
  autocomplete?: string
  disabled?: boolean
  max?: number | string
  min?: number | string
  modelValue?: number | string
  name?: string
  placeholder?: string
  readonly?: boolean
  required?: boolean
  size?: string
  step?: number | string
  type?: string
  valid?: boolean
  validated?: boolean
}>()
const emit = defineEmits(['update:modelValue'])

const id: ComputedRef<string> | null = inject('control-id', null)
const inputType = computed(() => props.type ?? 'text')
const validationState = computed(() => (props.validated ? props.valid : null))

const groupSize: ComputedRef<string> = inject(
  'group-size',
  computed(() => '')
)
const size = computed(() => props.size || groupSize?.value)

const groupDisabled: ComputedRef<boolean> = inject(
  'group-disabled',
  computed(() => false)
)
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

function onInput(event: InputInputEvent): void {
  emit('update:modelValue', event.target.value)
}
</script>
