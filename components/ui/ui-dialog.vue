<template>
  <Teleport to="body">
    <Transition name="dialog" @after-leave="handleAfterLeave">
      <div v-if="modelValue" :class="dialogClasses">
        <div class="dialog-content">
          <div v-if="hasHeader" class="dialog-header">
            <slot name="header" :close="handleClose">
              <h5 class="dialog-title">
                {{ title }}
                <UiSpinner v-if="loading" variant="primary" />
              </h5>

              <UiButton
                :title="useString('close')"
                :aria-label="useString('close')"
                icon="close-16"
                icon-size="16"
                variant="primary-muted"
                class="btn-close"
                @click="handleClose"
              />
            </slot>
          </div>

          <div class="dialog-body">
            <slot :close="handleClose" />
          </div>

          <div v-if="hasFooter" class="dialog-footer">
            <slot name="footer" :close="handleClose">
              <UiButton variant="secondary" class="ms-auto" @click="handleClose"> OK </UiButton>
            </slot>
          </div>
        </div>

        <div class="dialog-backdrop" @click="handleClose" />
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
const props = defineProps<{
  loading?: boolean
  modelValue?: boolean
  size?: DialogSize
  title?: string
}>()

const emit = defineEmits(['closed', 'update:modelValue'])

const slots = useSlots()

const hasHeader = computed(() => Boolean(props.title || slots.header))
const hasFooter = computed(() => Boolean(slots.footer))

let dialogClasses = ['dialog']

if (props.size) {
  dialogClasses.push(`dialog-${props.size}`)
} else {
  dialogClasses.push('dialog-md')
}

function handleAfterLeave() {
  emit('closed')
}

function handleClose() {
  emit('update:modelValue', false)
}
</script>
