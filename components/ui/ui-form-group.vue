<template>
  <component
    :is="hasLegend ? 'fieldset' : 'div'"
    v-uid
    ref="fieldset"
    :class="componentClasses"
    :disabled="disabled"
    :form="form"
    class="form-group"
  >
    <legend v-if="hasLegend">
      <slot name="legend">
        {{ legend }}
      </slot>
    </legend>
    <label v-if="hasLabel" :for="controlId">
      <slot name="label">
        {{ label }}
      </slot>
    </label>
    <slot></slot>
    <p
      v-if="feedback"
      :class="{ 'form-feedback-invalid': validationState === false, 'form-feedback-valid': validationState === true }"
      class="form-feedback"
      v-text="feedback"
    />
  </component>
</template>

<script lang="ts" setup>
const props = defineProps<{
  disabled?: boolean
  form?: string
  invalidFeedback?: string
  label?: string
  legend?: string
  size?: string
  valid?: boolean
  validFeedback?: string
  validated?: boolean
}>()
const slots = useSlots()

const fieldset = ref(null)

const hasLegend = computed(() => Boolean(props.legend || slots.legend))
const hasLabel = computed(() => Boolean(props.label || slots.label))
const validationState = computed(() => (props.validated ? props.valid : null))

const feedback = computed(
  () =>
    (validationState.value === true && props.validFeedback) ||
    (validationState.value === false && props.invalidFeedback)
)
const controlId = computed(() => `${fieldset?.value?.id}-control`)

const componentClasses = computed(() => {
  const classes = []
  if (props.size) {
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

onMounted(() => {
  if (hasLabel) {
    const control = fieldset?.value?.querySelector('input, output, select, textarea')
    control?.setAttribute('id', controlId.value)
    if (props.size) {
      control?.classList.add(`form-control-${props.size}`)
    }
  }
})
</script>
