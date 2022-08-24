<template>
  <input
    :autocomplete="autocomplete"
    :class="{ 'is-invalid': state === false, 'is-valid': state === true }"
    :disabled="disabled"
    :form="form"
    :max="max"
    :min="min"
    :name="name"
    :placeholder="placeholder"
    :readonly="readonly"
    :required="required"
    :step="step"
    :type="type"
    :value="modelValue"
    class="form-control"
    @input="onInput"
  />
</template>

<script lang="ts" setup>
interface InputInputEventTarget extends EventTarget {
  value: string
}

interface InputInputEvent extends InputEvent {
  target: InputInputEventTarget
}

const props = defineProps<{
  autocomplete?: string
  disabled?: boolean
  form?: string
  max?: number | string
  min?: number | string
  modelValue: number | string
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

const state = computed(() => (props.validated ? props.valid : null))
const type = computed(() => props.type ?? 'text')

function onInput(event: InputInputEvent): void {
  emit('update:modelValue', event.target.value)
}
</script>
