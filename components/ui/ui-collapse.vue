<template>
  <Transition
    :name="transition"
    @before-enter="handleBeforeEnter"
    @enter="handleEnter"
    @after-enter="hanfleAfterEnter"
    @before-leave="handleBeforeLeave"
    @leave="handleLeave"
    @after-leave="handleAfterLeave"
  >
    <div v-if="modelValue" :class="collapseClass">
      <slot :close="close"></slot>
    </div>
  </Transition>
</template>

<script lang="ts" setup>
const props = defineProps<{
  collapseClass?: string
  modelValue?: boolean
  transition?: string
}>()
const emit = defineEmits(['update:modelValue', 'hidden'])

const collapseClass = props.collapseClass ?? 'collapse'
const transition = props.transition ?? 'collapse'

function close() {
  emit('update:modelValue', false)
}

function getContentHeight(el: HTMLElement): number {
  let height = 0
  for (let i = 0; i < el.children.length; i++) {
    height += (el.children[i] as HTMLElement).offsetHeight
  }
  return height
}

function handleBeforeEnter(el: HTMLElement) {
  el.style.height = '0'
}

function handleEnter(el: HTMLElement) {
  el.style.height = `${getContentHeight(el)}px`
}

function hanfleAfterEnter(el: HTMLElement) {
  el.style.height = ''
}

function handleBeforeLeave(el: HTMLElement) {
  el.style.height = `${getContentHeight(el)}px`
}

function handleLeave(el: HTMLElement) {
  el.style.height = '0'
}

function handleAfterLeave(el: HTMLElement) {
  el.style.height = ''
  emit('hidden')
}
</script>

<style lang="scss" scoped>
.collapse {
  overflow: hidden;
}
</style>
