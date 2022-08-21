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

<script setup>
const props = defineProps({
  autocomplete: String,
  disabled: Boolean,
  form: String,
  max: [Number, String],
  min: [Number, String],
  modelValue: [Number, String],
  name: String,
  placeholder: String,
  readonly: Boolean,
  required: Boolean,
  size: String,
  state: { type: Boolean, default: null },
  step: [Number, String],
  type: { type: String, default: 'text' },
})
const emit = defineEmits(['update:modelValue'])

function onInput(event) {
  emit('update:modelValue', event?.target?.value)
}
</script>
