<template>
  <UiButton :loading="loading" class="drawer-item" icon="export-24" icon-size="24" @click="handleClick">
    <span class="caption">{{ useString('exportData') }}</span>
  </UiButton>
</template>

<script setup lang="ts">
import { DateTime } from 'luxon'

const loading = ref(false)

async function handleClick() {
  loading.value = true

  try {
    const response = await $fetch<Blob>('/api/export', { responseType: 'blob' })

    const url = URL.createObjectURL(response)
    const link = document.createElement('a')

    link.download = `transactions-${DateTime.now().toFormat('yyyy-LL-dd_HH-mm')}.xlsx`
    link.href = url
    link.target = '_blank'

    document.body.appendChild(link)
    link.click()
  } catch (error) {
    useShowToast({
      message: useString('exportFailed'),
      variant: 'danger',
    })
  }

  loading.value = false
}
</script>
