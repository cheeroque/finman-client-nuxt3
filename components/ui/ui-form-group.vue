<template>
  <div v-uid ref="parent" :class="componentClasses">
    <label v-if="hasLabel" :for="controlId" class="form-label">
      <slot name="label">
        {{ label }}
      </slot>
    </label>
    <slot></slot>
    <p
      v-if="validationFeedback"
      :class="{ 'form-feedback-invalid': validationState === false, 'form-feedback-valid': validationState === true }"
      class="form-feedback"
      v-text="validationFeedback"
    />
  </div>
</template>

<script lang="ts" setup>
import { ComputedRef } from 'vue'

const props = defineProps<{
  disabled?: boolean
  floatingLabel?: boolean
  invalidFeedback?: string
  label?: string
  size?: ControlSize
  valid?: boolean
  validFeedback?: string
  validated?: boolean
}>()
const slots = useSlots()

const parent = ref(null)

const controlId = computed(() => `${parent?.value?.id}-control`)
const hasLabel = computed(() => Boolean(props.label || slots.label))

const validationState = computed(() => (props.validated ? props.valid : null))
const validationFeedback = computed(
  () =>
    (validationState.value === true && props.validFeedback) ||
    (validationState.value === false && props.invalidFeedback)
)

const size = computed(() => props.size)

const fieldsetDisabled: ComputedRef<boolean> = inject(
  'fieldset-disabled',
  computed(() => false)
)
const disabled = computed(() => props.disabled || fieldsetDisabled.value)

const componentClasses = computed(() => {
  const classes = ['form-group']
  if (props.floatingLabel) {
    classes.push('floating-label')
  }
  if (disabled.value) {
    classes.push('disabled')
  }
  if (size.value) {
    classes.push(`form-group-${props.size}`)
  }
  if (validationState.value === true) {
    classes.push('is-valid')
  }
  if (validationState.value === false) {
    classes.push('is-invalid')
  }
  return classes
})

provide('control-id', controlId)
provide('group-size', size)
provide('group-disabled', disabled)
</script>
