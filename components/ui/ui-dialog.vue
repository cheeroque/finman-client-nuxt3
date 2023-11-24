<template>
  <Teleport to="body">
    <Transition name="dialog" @after-leave="handleAfterLeave" @before-enter="handleBeforeEnter">
      <div v-if="modelValue" :class="componentClasses">
        <div class="dialog-content">
          <div v-if="hasHeader" class="dialog-header">
            <slot :close="handleClose" name="header">
              <h5 class="dialog-title">
                {{ title }}
                <UiSpinner v-if="loading" variant="primary" />
              </h5>

              <UiButton
                :aria-label="useString('close')"
                :title="useString('close')"
                class="btn-close"
                icon="close-16"
                icon-size="16"
                variant="primary-muted"
                @click="handleClose"
              />
            </slot>
          </div>

          <div class="dialog-body">
            <slot :close="handleClose" />
          </div>

          <div v-if="hasFooter" class="dialog-footer">
            <slot :close="handleClose" name="footer">
              <UiButton class="ms-auto" variant="secondary" @click="handleClose"> OK </UiButton>
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

const bodyEl = ref<HTMLElement | undefined>()

const bodyFixed = useScrollLock(bodyEl)
const slots = useSlots()

const hasHeader = computed(() => useSlotHasContent(slots.header) || Boolean(props.title))
const hasFooter = computed(() => useSlotHasContent(slots.footer))

const componentClasses = computed(() => {
  const classes = ['dialog']

  if (props.size) {
    classes.push(`dialog-${props.size}`)
  } else {
    classes.push('dialog-md')
  }

  return classes
})

onMounted(() => {
  bodyEl.value = document.body
})

function handleAfterLeave() {
  toggleBodyFixed(false)
  emit('closed')
}

function handleBeforeEnter() {
  toggleBodyFixed(true)
}

function handleClose() {
  emit('update:modelValue', false)
}

function toggleBodyFixed(isFixed: boolean) {
  /* Disable body scrolling when dialog is open */
  if (!process.client) return

  bodyFixed.value = isFixed
}
</script>
