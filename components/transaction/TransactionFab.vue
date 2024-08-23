<template>
  <Transition name="fade">
    <UiButton
      v-if="show"
      icon="edit-24"
      icon-size="24"
      variant="tertiary"
      class="btn-fab"
      no-text
      @click="handleFabClick"
    />
  </Transition>

  <TransactionDialog v-model="dialogVisible" />
</template>

<script setup lang="ts">
type RecordFabProps = {
  show?: boolean
}

const props = defineProps<RecordFabProps>()

const dialogVisible = ref(false)

function handleFabClick() {
  dialogVisible.value = true
}
</script>

<style lang="scss" scoped>
.btn-fab {
  position: fixed;
  right: $grid-gap * 0.5;
  bottom: calc(#{$grid-gap * 0.5} + 3.5rem + 24px);
  padding: 1rem;
  border-radius: $fab-border-radius;
  border: none;
  box-shadow: $shadow-1;

  &:hover {
    box-shadow: $shadow-4;
  }

  @include media-min-width(lg) {
    right: 3rem;
    bottom: 3rem;
  }

  @include media-min-width(xxl) {
    right: 5rem;
    bottom: 5rem;
  }
}
</style>
