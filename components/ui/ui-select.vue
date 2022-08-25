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

<script lang="ts" setup>
type SelectValue = number | string | null

type SelectOption = {
  disabled: boolean
  text: string
  value: SelectValue
}

interface SelectInputEventTarget extends EventTarget {
  value: string
}

interface SelectInputEvent extends InputEvent {
  target: SelectInputEventTarget
}

const props = defineProps<{
  disabled?: boolean
  form?: string
  modelValue?: SelectValue | SelectValue[]
  name?: string
  options?: SelectOption[]
  required?: boolean
  size?: string
  valid?: boolean
  validated?: boolean
}>()
const emit = defineEmits(['update:modelValue'])

const select = ref(null)

const state = computed(() => (props.validated ? props.valid : null))

function onInput(event: SelectInputEvent): void {
  emit('update:modelValue', event.target.value)
}
</script>
