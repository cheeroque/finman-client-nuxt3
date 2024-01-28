<template>
  <UiInput
    :key="inputKey"
    :autofocus="hasAutofocus"
    :disabled="disabled"
    :model-value="modelValue"
    :name="name"
    :required="required"
    :size="size"
    :state="state"
    autocomplete="off"
    placeholder="0"
    @blur="handleBlur"
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

<script setup lang="ts">
type UiInputCalcProps = {
  append?: string
  autofocus?: boolean
  disabled?: boolean
  modelValue?: number | string
  name?: string
  required?: boolean
  size?: ControlSize
  state?: ControlState
}

const props = defineProps<UiInputCalcProps>()

const emit = defineEmits(['update:modelValue'])

const hasAutofocus = ref(props.autofocus)
const hasTotal = ref(false)
const inputKey = ref('')

/* Split input value string to groups of digits with +- signs, find total sum
 * of all groups and emit it as new modelValue */

function calculate(target: HTMLInputElement) {
  const matches: string[] = target.value.match(/([+-]{0,}\d{1,})/gi) || []

  const total = matches.reduce((total, match) => {
    total += Number(match)
    return total
  }, 0)

  updateValue(total)

  hasTotal.value = true
}

function handleBlur(event: FocusEvent) {
  if (!(event.target instanceof HTMLInputElement)) return
  calculate(event.target)
}

/* Move caret to the end on input focus */

function handleFocus(event: FocusEvent) {
  hasTotal.value = false

  const target = event.target
  if (!(target instanceof HTMLInputElement)) return

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
  const target = event.target
  if (!(target instanceof HTMLInputElement)) return

  if (!event.key.match(/^[\d+-]$/)) {
    /* NOT number/plus/minus key pressed */
    if (event.key.length === 1 && !event.ctrlKey && !event.altKey && !event.metaKey) {
      /* Single letter key & no modifier pressed */
      event.preventDefault()
    }
  }

  /* When Enter is pressed for the FIRST TIME inside input, prevent default
   * and calculate modelValue */

  if (event.key === 'Enter') {
    if (!hasTotal.value) {
      event.preventDefault()

      calculate(target)
    }
  }
}

function updateValue(value: number) {
  emit('update:modelValue', value)

  /* If new calculated value is the same as current modelValue, displayed input
   * text will not change. For example, if you add "+0" to existing "100" in input,
   * modelValue will still be 100, and input will not redraw.
   * To prevent this, we update component key and force it to redraw.
   * We also disable autofocus, so that input will not steal focus on every update */

  if (value === props.modelValue) {
    hasAutofocus.value = false
    inputKey.value = String(new Date().valueOf())
  }
}
</script>
