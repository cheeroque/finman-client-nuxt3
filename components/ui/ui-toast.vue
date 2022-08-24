<template>
  <Teleport to="body">
    <Transition name="toast">
      <div v-if="modelValue" :class="variant && `toast-${variant}`" class="toast">
        <div class="toast-header">
          <slot name="header" :close="close">
            {{ title }}
            <UiButton class="btn-close" @click="close">
              <NuxtIcon name="close-24" />
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
  modelValue: boolean
  title?: string
  variant?: string
}>()
const emit = defineEmits(['update:modelValue'])

const autohide = computed(() => props.autohide || 3000)

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

<style lang="scss" scoped>
.toast {
  position: fixed;
  right: 2rem;
  bottom: 2rem;
}
</style>
