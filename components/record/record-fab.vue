<template>
  <div>
    <Transition name="fade">
      <UiButton v-if="show" icon="edit-24" icon-size="24" variant="tertiary" class="btn-fab" @click="onFabClick" />
    </Transition>
    <RecordDialog v-model="dialogVisible" />
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  show?: boolean
}>()

const dialogVisible = ref(false)

function onFabClick() {
  dialogVisible.value = true
}
</script>
