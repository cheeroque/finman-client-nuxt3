<template>
  <Teleport to="body">
    <Transition name="dialog">
      <div v-if="modelValue" :class="dialogClasses">
        <div class="dialog-content">
          <div v-if="!hideHeader" class="dialog-header">
            <slot name="header" :close="close">
              <h5 class="dialog-title">{{ title }}</h5>
              <UiButton variant="neutral-muted" class="btn-close" @click="close">
                <UiIcon name="close-24" size="16" />
              </UiButton>
            </slot>
          </div>
          <div class="dialog-body">
            <slot :close="close" />
          </div>
          <div v-if="!hideFooter" class="dialog-footer">
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
type DialogSize = 'sm' | 'md' | 'lg' | null

const props = defineProps<{
  hideFooter?: boolean
  hideHeader?: boolean
  modelValue?: boolean
  size?: DialogSize
  title?: string
}>()
const emit = defineEmits(['update:modelValue'])
const slots = useSlots()

const hasTitle = computed(() => Boolean(props.title || slots.title))

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
