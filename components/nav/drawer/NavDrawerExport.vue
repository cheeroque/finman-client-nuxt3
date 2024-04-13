<template>
  <UiButton :loading="loading" class="drawer-item" icon="export-24" icon-size="24" @click="handleClick">
    <span class="caption">{{ useString('exportData') }}</span>
  </UiButton>
</template>

<script setup lang="ts">
const config = useRuntimeConfig()

const loading = ref(false)

async function handleClick() {
  loading.value = true

  try {
    const { result } = await $fetch('/api/export')

    if (result.file) {
      const file = result.file
      const link = document.createElement('a')

      link.href = `${config.public.staticUrl}${file.path}`
      link.target = '_blank'

      document.body.appendChild(link)
      link.click()
    } else {
      throw new Error()
    }
  } catch (error) {
    useShowToast({
      message: useString('exportFailed'),
      variant: 'danger',
    })
  }

  loading.value = false
}
</script>
