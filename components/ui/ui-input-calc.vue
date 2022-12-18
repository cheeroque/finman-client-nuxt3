<template>
  <UiInput
    ref="input"
    :disabled="disabled"
    :model-value="modelValue"
    :name="name"
    :required="required"
    :size="size"
    :state="state"
    autocomplete="off"
    placeholder="0"
    prevent-native-input
    @blur="calculate"
    @focus="handleFocus"
    @input="handleInput"
    @keydown="handleKeydown"
  >
    <template #append>
      <slot name="append">
        <div class="form-control-icon">
          {{ append || '₽' }}
        </div>
      </slot>
    </template>
  </UiInput>
</template>

<script lang="ts" setup>
type FakeFocusEvent = {
  target: HTMLInputElement
}

const props = defineProps<{
  append?: string
  disabled?: boolean
  modelValue?: number | string
  name?: string
  required?: boolean
  size?: ControlSize
  state?: ControlState
}>()
const emit = defineEmits(['update:modelValue'])

const input = ref(null)
const hasTotal = ref(false)

const size = computed(() => props.size)

function calculate(event: FocusEvent | FakeFocusEvent) {
  const target = event.target as HTMLInputElement
  const matches: string[] = target.value.match(/([+-]{0,}\d{1,})/gi) || []
  const total = matches.reduce((total, match) => {
    total += Number(match)
    return total
  }, 0)
  emit('update:modelValue', total)
  hasTotal.value = true
}

function handleFocus(event: FocusEvent) {
  hasTotal.value = false
  /* Move caret to the end on input focus */
  const target = event.target as HTMLInputElement
  if (target.selectionEnd) {
    setTimeout(() => {
      target.setSelectionRange(target.selectionEnd, target.selectionEnd)
    }, 0)
  }
}

function handleInput() {
  hasTotal.value = false
}

function handleKeydown(event: KeyboardEvent) {
  const target = event.target as HTMLInputElement

  if (!event.key.match(/^[\d+-]$/)) {
    /* NOT number/plus/minus key pressed */
    if (event.key.length === 1 && !event.ctrlKey && !event.altKey && !event.metaKey) {
      /* Single letter key & no modifier pressed */
      event.preventDefault()
    }
  }

  if (event.key === 'Enter') {
    if (!hasTotal.value) {
      event.preventDefault()
      calculate({ target })
      /* Force input value update (for +0 situations) */
      target.value = props.modelValue?.toString() || ''
    }
  }
}
</script>
