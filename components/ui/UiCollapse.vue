<template>
  <Transition
    :name="transition"
    @after-enter="hanfleAfterEnter"
    @after-leave="handleAfterLeave"
    @before-enter="handleBeforeEnter"
    @before-leave="handleBeforeLeave"
    @enter="handleEnter"
    @leave="handleLeave"
  >
    <div v-if="modelValue" :class="collapseClass">
      <slot :close="close" />
    </div>
  </Transition>
</template>

<script setup lang="ts">
type CollapseProps = {
  collapseClass?: string
  modelValue?: boolean
  transition?: string
}

const props = withDefaults(defineProps<CollapseProps>(), {
  collapseClass: 'collapse',
  transition: 'collapse',
})

const emit = defineEmits(['update:modelValue', 'hidden'])

function close() {
  emit('update:modelValue', false)
}

function getContentHeight(el: Element): number {
  let height = 0

  for (let i = 0; i < el.children.length; i++) {
    height += (el.children[i] as HTMLElement).offsetHeight
  }

  return height
}

function hanfleAfterEnter(el: Element) {
  if (el instanceof HTMLElement) {
    el.style.height = ''
  }
}

function handleAfterLeave(el: Element) {
  if (el instanceof HTMLElement) {
    el.style.height = ''
  }

  emit('hidden')
}

function handleBeforeEnter(el: Element) {
  if (el instanceof HTMLElement) {
    el.style.height = '0'
  }
}

function handleBeforeLeave(el: Element) {
  if (el instanceof HTMLElement) {
    el.style.height = `${getContentHeight(el)}px`
  }
}

function handleEnter(el: Element) {
  if (el instanceof HTMLElement) {
    el.style.height = `${getContentHeight(el)}px`
  }
}

function handleLeave(el: Element) {
  if (el instanceof HTMLElement) {
    el.style.height = '0'
  }
}
</script>

<style lang="scss" scoped>
.collapse {
  overflow: hidden;
}
</style>
