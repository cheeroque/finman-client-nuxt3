<template>
  <form action="/search" class="search-form" method="get" @submit.prevent="handleSubmit">
    <UiInput v-model="q" :placeholder="useString('searchPlaceholder')" name="q" size="lg" type="search">
      <template #append>
        <UiButton class="form-control-icon" icon="search-24" icon-size="24" type="submit" variant="link" />
      </template>
    </UiInput>
  </form>
</template>

<script setup lang="ts">
const emit = defineEmits(['submit'])

const q = ref('')

function handleSubmit() {
  if (!q.value.length) return

  emit('submit')

  return navigateTo({ path: '/search', query: { q: q.value } })
}
</script>

<style lang="scss" scoped>
:deep(.form-control) {
  border-radius: 99rem;

  .form-control-el {
    border-radius: 99rem;
  }

  .form-control-append {
    padding: 0;
  }

  .form-control-icon {
    padding: $control-padding-y-lg $control-padding-x-lg;
    border-radius: 99rem;
  }

  &::after {
    display: none;
  }
}
</style>
