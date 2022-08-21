<template>
  <select
    ref="select"
    :class="{ 'is-invalid': state === false, 'is-valid': state === true }"
    :disabled="disabled"
    :form="form"
    :name="name"
    :required="required"
    :value="modelValue"
    autocomplete="off"
    class="form-control form-select"
    @input="onInput"
  >
    <option
      v-for="(option, index) in options"
      :key="`option-${index}`"
      :disabled="option.disabled"
      :selected="option.value === modelValue"
      :value="option.value"
    >
      {{ option.text }}
    </option>
  </select>
</template>

<script setup>
const props = defineProps({
  disabled: Boolean,
  form: String,
  modelValue: [Array, Number, Object, String],
  name: String,
  options: { type: Array, default: () => [] },
  required: Boolean,
  size: String,
  state: { type: Boolean, default: null },
})
const emit = defineEmits(['update:modelValue'])

const select = ref(null)

function onInput(event) {
  emit('update:modelValue', event?.target?.value)
}
</script>
