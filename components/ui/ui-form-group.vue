<template>
  <div v-uid ref="formGroup" :class="componentClasses">
    <label v-if="hasLabel" :for="controlId" :class="labelClass" class="form-label">
      <slot name="label">
        {{ label }}
      </slot>
    </label>
    <slot />
    <p v-if="feedback" :class="feedbackClasses">
      {{ feedback }}
    </p>
  </div>
</template>

<script lang="ts" setup>
const props = defineProps<{
  disabled?: boolean
  invalidFeedback?: string
  label?: string
  labelClass?: string
  state?: ControlState
  validFeedback?: string
}>()
const slots = useSlots()

const formGroup = ref()

/* Provided to children */
const controlId = computed(() => `${formGroup?.value?.id}-control`)
provide('controlId', controlId)
const disabled = computed(() => props.disabled)
provide('disabled', disabled)
const state = computed(() => props.state)
provide('state', state)

const hasLabel = computed(() => Boolean(props.label || slots.label))

const componentClasses = computed(() => {
  const classes = ['form-group']
  if (hasLabel.value) {
    classes.push('floating-label')
  }
  if (disabled.value) {
    classes.push('disabled')
  }
  if (state.value === true) {
    classes.push('is-valid')
  }
  if (state.value === false) {
    classes.push('is-invalid')
  }
  return classes
})

const feedback = computed(
  () => (state.value === true && props.validFeedback) || (state.value === false && props.invalidFeedback)
)
const feedbackClasses = computed(() => {
  const classes = ['form-feedback']
  if (state.value === true) {
    classes.push('form-feedback-valid')
  }
  if (state.value === false) {
    classes.push('form-feedback-invalid')
  }
  return classes
})
</script>
