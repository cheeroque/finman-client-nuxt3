<template>
  <div :class="componentClasses">
    <input
      ref="input"
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
      :value="modelValue"
      class="form-control-el"
      @blur="emit('blur', $event)"
      @click="emit('click', $event)"
      @focus="emit('focus', $event)"
      @input="handleInput"
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

<script setup lang="ts">
import { ComputedRef } from 'vue'

const props = defineProps<{
  append?: string
  autocomplete?: string
  autofocus?: boolean
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

const emit = defineEmits(['blur', 'click', 'focus', 'input', 'update:modelValue'])

const slots = useSlots()

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

const input = ref()
const observer = ref()
const wasFocused = ref(false)

const disabled = computed(() => props.disabled || parentDisabled.value)
const size = computed(() => props.size)
const state = computed(() => props.state ?? parentState.value)
const type = computed(() => props.type ?? 'text')

const hasAppend = computed(() => useSlotHasContent(slots.append) || Boolean(props.append))

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

watch(
  () => props.autofocus,
  (event) => {
    if (event) setObserver()
    else removeObserver()
  }
)

onMounted(() => {
  if (props.autofocus) {
    wasFocused.value = false
    setObserver()
  }
})

onUnmounted(() => {
  removeObserver()
})

function handleInput(event: Event) {
  const target = event.target as HTMLInputElement

  emit('input', event)
  emit('update:modelValue', target.value)
}

function setObserver() {
  if (!process.client) return

  if ('IntersectionObserver' in window) {
    observer.value = new IntersectionObserver(([{ isIntersecting }]) => {
      if (!wasFocused.value && isIntersecting) {
        /** Focus input ONCE when it's in viewport if autofocus prop set */
        input.value.focus()
        wasFocused.value = true
      }
    })
    observer.value.observe(input.value)
  }
}

function removeObserver() {
  if (input.value && observer.value instanceof IntersectionObserver) {
    observer.value.unobserve(input.value)
  }
}
</script>
