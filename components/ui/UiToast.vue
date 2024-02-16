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
type UiToastProps = {
  autohide?: boolean | number | string
  message?: string
  modelValue?: boolean
  title?: string
  variant?: string
}

const props = defineProps<UiToastProps>()

const emit = defineEmits(['update:modelValue'])

const slots = useSlots()

const timeout = ref()

const hasHeader = computed(() => useSlotHasContent(slots.header) || Boolean(props.title))
const autohide = computed(() => props.autohide ?? 5000)

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
    if (event && autohide.value) {
      timeout.value = setTimeout(() => close(), Number(autohide.value))
    }
  }
)

function close() {
  if (timeout.value) {
    clearTimeout(timeout.value)
  }
  emit('update:modelValue', false)
}
</script>
