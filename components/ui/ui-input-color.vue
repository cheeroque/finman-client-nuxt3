<template>
  <UiInput
    :disabled="disabled"
    :model-value="modelValue"
    :name="name"
    :placeholder="placeholder"
    :readonly="readonly"
    :required="required"
    :size="size"
    :state="state"
    autocomplete="off"
    @input="handleInput"
  >
    <template #append>
      <label
        :for="colorInput?.id"
        :style="{ backgroundColor: bgColor, color: iconColor }"
        class="form-control-icon colorpicker-label"
      >
        <input v-uid ref="colorInput" :value="modelValue" type="color" class="colorpicker-input" @input="handleInput" />

        <UiIcon name="eyedropper-24" size="16" aria-hidden="true" />
      </label>
    </template>
  </UiInput>
</template>

<script setup lang="ts">
const props = defineProps<{
  disabled?: boolean
  modelValue?: string
  name?: string
  placeholder?: string
  readonly?: boolean
  required?: boolean
  size?: ControlSize
  state?: ControlState
}>()

const emit = defineEmits(['update:modelValue'])

const colorInput = ref()

const bgColor = computed(() => props.modelValue ?? 'transparent')
const iconColor = computed(() => (props.modelValue ? useContrastColor(props.modelValue) : 'inherit'))
const placeholder = computed(() => props.placeholder ?? '#')

function handleInput(event: Event) {
  const target = event.target as HTMLInputElement
  emit('update:modelValue', target.value)
}
</script>
