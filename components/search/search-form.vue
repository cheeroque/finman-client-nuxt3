<template>
  <form action="/search" method="get" class="search-form">
    <UiInput v-model="q" :placeholder="useString('searchPlaceholder')" name="q" size="lg" type="search">
      <template #append>
        <UiButton icon="search-24" icon-size="24" type="submit" variant="link" class="form-control-icon" />
      </template>
    </UiInput>
  </form>
</template>

<script lang="ts" setup>
const q = ref()
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
