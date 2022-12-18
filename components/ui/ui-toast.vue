<template>
  <Teleport to="body">
    <Transition name="toast">
      <div v-if="modelValue" :class="toastClasses">
        <div v-if="hasHeader" class="toast-header">
          <slot name="header" :close="close">
            <h6 class="toast-title">{{ title }}</h6>
            <UiButton class="btn-close" @click="close">
              <UiIcon name="close-24" size="16" />
            </UiButton>
          </slot>
        </div>
        <div :class="{ 'no-header': !hasHeader }" class="toast-body">
          <slot :close="close">
            {{ message }}
          </slot>
          <UiButton v-if="!hasHeader" class="btn-close" @click="close">
            <UiIcon name="close-24" size="16" />
          </UiButton>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script lang="ts" setup>
const props = defineProps<{
  autohide?: boolean | number | string
  message?: string
  modelValue?: boolean
  title?: string
  variant?: string
}>()
const emit = defineEmits(['update:modelValue'])

const slots = useSlots()
const hasHeader = computed(() => Boolean(slots.header || props.title))

const autohide = computed(() => props.autohide ?? 5000)

const toastClasses = computed(() => {
  let classes = ['toast']
  if (props.variant) {
    classes.push(`toast-${props.variant}`)
  }
  return classes
})

let timeout: NodeJS.Timeout

watch(
  () => props.modelValue,
  (event) => {
    if (event && autohide.value) {
      timeout = setTimeout(() => close(), Number(autohide.value))
    }
  }
)

function close(): void {
  clearTimeout(timeout)
  emit('update:modelValue', false)
}
</script>
