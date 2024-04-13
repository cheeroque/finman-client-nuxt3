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
      @input="handleInput($event as InputEvent)"
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
import type { ControlSize } from '~/types'

type InputProps = {
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
  state?: boolean | null
  step?: number | string
  type?: string
}

const props = withDefaults(defineProps<InputProps>(), {
  state: null,
  type: 'text',
})

const emit = defineEmits(['blur', 'click', 'focus', 'input', 'update:modelValue'])

const slots = useSlots()

/* Injects from parent */
const id = inject(
  'controlId',
  computed(() => undefined)
)
const parentDisabled = inject(
  'disabled',
  computed(() => false)
)
const parentState = inject(
  'state',
  computed(() => null)
)

const input = ref<HTMLInputElement>()
const observer = ref<IntersectionObserver>()
const wasFocused = ref(false)

const disabled = computed(() => props.disabled || parentDisabled.value)
const state = computed(() => props.state ?? parentState.value)

const hasAppend = computed(() => useSlotHasContent(slots.append) || Boolean(props.append))

const componentClasses = computed(() => {
  const classes = ['form-control']

  if (props.size) {
    classes.push(`form-control-${props.size}`)
  }

  if (disabled.value) {
    classes.push('disabled')
  }

  if (hasAppend.value) {
    classes.push('has-append')
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

function handleInput(event: InputEvent) {
  const target = event.target
  if (!(target instanceof HTMLInputElement)) return

  emit('input', event)
  emit('update:modelValue', target.value)
}

function setObserver() {
  if (!process.client || !input.value) return

  if ('IntersectionObserver' in window) {
    observer.value = new IntersectionObserver(([{ isIntersecting }]) => {
      if (!wasFocused.value && input.value && isIntersecting) {
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
