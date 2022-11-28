<template>
  <div :class="componentClasses">
    <input
      :value="modelValue"
      :id="id"
      :autocomplete="autocomplete"
      :disabled="disabled"
      :max="max"
      :min="min"
      :name="name"
      :placeholder="placeholder"
      :readonly="readonly"
      :required="required"
      :step="step"
      :type="type"
      class="form-control-el"
      @blur="emit('blur', $event)"
      @click="emit('click', $event)"
      @focus="emit('focus', $event)"
      @input="onInput"
    />
    <div v-if="hasAppend" class="form-control-append">
      <slot name="append">
        <span class="form-control-icon">
          {{ append }}
        </span>
      </slot>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ComputedRef } from 'vue'

const props = defineProps<{
  append?: string
  autocomplete?: string
  disabled?: boolean
  max?: number | string
  min?: number | string
  modelValue?: number | string
  name?: string
  placeholder?: string
  readonly?: boolean
  required?: boolean
  size?: ControlSize
  state?: ControlState
  step?: number | string
  type?: string
}>()
const slots = useSlots()
const emit = defineEmits(['blur', 'click', 'focus', 'input', 'update:modelValue'])

/* Injects from parent */
const id: ComputedRef<string> | undefined = inject('controlId', undefined)
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
const type = computed(() => props.type ?? 'text')

const hasAppend = computed(() => Boolean(props.append || slots.append))

const componentClasses = computed(() => {
  const classes = ['form-control']
  if (disabled.value) {
    classes.push('disabled')
  }
  if (hasAppend.value) {
    classes.push('has-append')
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

function onInput(event: InputEvent): void {
  const target = event.target as HTMLInputElement
  emit('input', event)
  emit('update:modelValue', target.value)
}
</script>
