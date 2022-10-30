<template>
  <Teleport to="body">
    <Transition name="dialog">
      <div v-if="modelValue" :class="dialogClasses">
        <div class="dialog-content">
          <div v-if="hasHeader" class="dialog-header">
            <slot name="header" :close="close">
              <h5 class="dialog-title">{{ title }}</h5>
              <UiButton
                :title="useString('close')"
                :aria-label="useString('close')"
                icon="close-16"
                icon-size="16"
                variant="primary-muted"
                class="btn-close"
                @click="close"
              />
            </slot>
          </div>
          <div class="dialog-body">
            <slot :close="close" />
          </div>
          <div v-if="hasFooter" class="dialog-footer">
            <slot name="footer" :close="close">
              <UiButton variant="secondary" class="ms-auto" @click="close"> OK </UiButton>
            </slot>
          </div>
        </div>
        <div class="dialog-backdrop" @click="close" />
      </div>
    </Transition>
  </Teleport>
</template>

<script lang="ts" setup>
const props = defineProps<{
  modelValue?: boolean
  size?: DialogSize
  title?: string
}>()
const emit = defineEmits(['update:modelValue'])
const slots = useSlots()

const hasHeader = computed(() => Boolean(props.title || slots.header))
const hasFooter = computed(() => Boolean(slots.footer))

let dialogClasses = ['dialog']
if (props.size) {
  dialogClasses.push(`dialog-${props.size}`)
} else {
  dialogClasses.push('dialog-md')
}

function close(): void {
  emit('update:modelValue', false)
}
</script>
