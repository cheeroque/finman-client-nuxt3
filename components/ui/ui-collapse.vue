<template>
  <Transition
    :name="transition"
    @before-enter="onBeforeEnter"
    @enter="onEnter"
    @after-enter="onAfterEnter"
    @before-leave="onBeforeLeave"
    @leave="onLeave"
    @after-leave="onAfterLeave"
  >
    <div v-if="modelValue" :class="collapseClass">
      <slot :close="close"></slot>
    </div>
  </Transition>
</template>

<script setup>
const props = defineProps({
  collapseClass: { type: String, default: 'collapse' },
  modelValue: Boolean,
  transition: { type: String, default: 'collapse' },
})
const emit = defineEmits(['update:modelValue', 'hidden'])

function close() {
  emit('update:modelValue', false)
}

function getContentHeight(el) {
  let height = 0
  for (let i = 0; i < el?.children?.length; i++) {
    height += el?.children[i]?.offsetHeight
  }
  return height
}

function onBeforeEnter(el) {
  el.style.height = 0
}

function onEnter(el) {
  el.style.height = `${getContentHeight(el)}px`
}

function onAfterEnter(el) {
  el.style.height = null
}

function onBeforeLeave(el) {
  el.style.height = `${getContentHeight(el)}px`
}

function onLeave(el) {
  el.style.height = 0
}

function onAfterLeave(el) {
  el.style.height = null
  emit('hidden')
}
</script>

<style lang="scss" scoped>
.collapse {
  overflow: hidden;
}
</style>
