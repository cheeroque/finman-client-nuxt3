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

<script setup>
const props = defineProps({
  autohide: { type: [Boolean, Number, String], default: 3000 },
  message: String,
  modelValue: Boolean,
  title: String,
  variant: String,
})
const emit = defineEmits(['update:modelValue'])

let timeout

watch(
  () => props.modelValue,
  (event) => {
    if (event && props.autohide) {
      timeout = setTimeout(() => close(), parseInt(props.autohide))
    }
  }
)

function close() {
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
