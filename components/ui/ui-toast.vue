<template>
  <Teleport to="body">
    <Transition name="toast">
      <div v-if="modelValue" :class="toastClasses">
        <div class="toast-header">
          <slot name="header" :close="close">
            <h6 class="toast-title">{{ title }}</h6>
            <UiButton class="btn-close" @click="close">
              <UiIcon name="close-24" size="16" />
            </UiButton>
          </slot>
        </div>
        <div class="toast-body">
          <slot :close="close">
            {{ message }}
          </slot>
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

const autohide = computed(() => props.autohide ?? 3000)

let toastClasses = ['toast']
if (props.variant) toastClasses.push(`toast-${props.variant}`)

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
