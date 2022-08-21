<template>
  <div v-uid ref="checkbox" class="form-check">
    <input
      :checked="checked"
      :id="controlId"
      :class="{ 'is-invalid': state === false, 'is-valid': state === true }"
      :disabled="disabled"
      :form="form"
      :name="name"
      :required="required"
      :value="modelValue"
      autocomplete="off"
      class="form-check-input"
      type="checkbox"
      @input="onInput"
    />
    <label :for="controlId" class="form-check-label">
      <slot></slot>
    </label>
  </div>
</template>

<script setup>
const props = defineProps({
  disabled: Boolean,
  form: String,
  modelValue: [Array, Boolean, Number, String],
  name: String,
  required: Boolean,
  size: String,
  state: { type: Boolean, default: null },
  uncheckedValue: { type: [Boolean, Number, String], default: false },
  value: { type: [Boolean, Number, String], default: true },
})
const emit = defineEmits(['update:modelValue'])

const checkbox = ref(null)

const controlId = computed(() => `${checkbox?.value?.id}-control`)
const checked = computed(() =>
  Array.isArray(props.modelValue)
    ? props.modelValue.includes(props.value)
    : Boolean(props.value) === Boolean(props.modelValue)
)

function addValue(value, array) {
  if (array?.indexOf(value) < 0) {
    return array.concat([value])
  } else {
    return array
  }
}

function removeValue(value, array) {
  return array?.filter((el) => el !== value)
}

function onInput(event) {
  const checked = event?.target?.checked
  let payload
  if (Array.isArray(props.modelValue)) {
    if (checked) {
      payload = addValue(props.value, props.modelValue)
    } else {
      payload = removeValue(props.value, props.modelValue)
    }
  } else {
    payload = checked ? props.value : props.uncheckedValue
  }
  emit('update:modelValue', payload)
}
</script>
