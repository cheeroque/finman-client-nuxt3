<template>
  <Teleport to="body">
    <Transition name="toast">
      <div v-if="modelValue" :class="componentClasses">
        <div v-if="hasHeader" class="toast-header">
          <slot :close="close" name="header">
            <h6 class="toast-title">{{ title }}</h6>

            <UiButton class="btn-close" no-text @click="close">
              <UiIcon name="close-24" size="16" />
            </UiButton>
          </slot>
        </div>

        <div :class="{ 'no-header': !hasHeader }" class="toast-body">
          <slot :close="close">
            {{ message }}
          </slot>

          <UiButton v-if="!hasHeader" class="btn-close" no-text @click="close">
            <UiIcon name="close-24" size="16" />
          </UiButton>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import type { ToastState } from '~/types'

type ToastProps = ToastState

const props = withDefaults(defineProps<ToastProps>(), {
  autohide: 5000,
})

const emit = defineEmits(['hide', 'update:modelValue'])

const slots = useSlots()

const timeout = ref()

const hasHeader = computed(() => useSlotHasContent(slots.header) || Boolean(props.title))

const componentClasses = computed(() => {
  let classes = ['toast']

  if (props.variant) {
    classes.push(`toast-${props.variant}`)
  }

  return classes
})

watch(
  () => props.modelValue,

  (event) => {
    if (event && !isNaN(Number(props.autohide))) {
      timeout.value = setTimeout(() => close(), Number(props.autohide))
    }
  }
)

function close() {
  if (timeout.value) {
    clearTimeout(timeout.value)
  }

  emit('hide')
}
</script>
