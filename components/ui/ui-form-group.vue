<template>
  <div v-uid ref="formGroup" :class="componentClasses">
    <label v-if="hasLabel" :class="labelClass" :for="controlId" class="form-label">
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

<script setup lang="ts">
interface UiFormGroupProps {
  disabled?: boolean
  invalidFeedback?: string
  label?: string
  labelClass?: string
  state?: ControlState
  validFeedback?: string
}

const props = defineProps<UiFormGroupProps>()

const slots = useSlots()

const formGroup = ref()

/* Provided to children */
const controlId = computed(() => `${formGroup?.value?.id}-control`)
provide('controlId', controlId)

const disabled = computed(() => props.disabled)
provide('disabled', disabled)

const state = computed(() => props.state)
provide('state', state)

const hasLabel = computed(() => useSlotHasContent(slots.label) || Boolean(props.label))

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
