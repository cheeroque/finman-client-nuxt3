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
