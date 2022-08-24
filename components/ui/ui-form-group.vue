<template>
  <fieldset
    v-uid
    ref="fieldset"
    :class="{ 'is-invalid': state === false, 'is-valid': state === true }"
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
  </fieldset>
</template>

<script lang="ts" setup>
const props = defineProps<{
  disabled?: boolean
  form?: string
  label?: string
  legend?: string
  valid?: boolean
  validated?: boolean
}>()
const slots = useSlots()

const fieldset = ref(null)

const hasLegend = computed(() => Boolean(props.legend || slots.legend))
const hasLabel = computed(() => Boolean(props.label || slots.label))
const state = computed(() => (props.validated ? props.valid : null))

const controlId = computed(() => `${fieldset?.value?.id}-control`)

onMounted(() => {
  if (hasLabel) {
    const control = fieldset?.value?.querySelector('input, output, select, textarea')
    control?.setAttribute('id', controlId.value)
  }
})
</script>
