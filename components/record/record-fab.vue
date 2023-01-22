<template>
  <div>
    <Transition name="fade">
      <UiButton v-if="show" icon="edit-24" icon-size="24" variant="tertiary" class="btn-fab" @click="handleFabClick" />
    </Transition>
    <RecordDialog v-model="dialogVisible" @record:update="emit('records:update')" />
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  show?: boolean
}>()

const emit = defineEmits(['records:update'])

const dialogVisible = ref(false)

function handleFabClick() {
  dialogVisible.value = true
}
</script>
