<template>
  <UiButton :loading="loading" icon="export-24" icon-size="24" class="drawer-item" @click="handleClick">
    <span class="caption">{{ useString('exportData') }}</span>
  </UiButton>
</template>

<script lang="ts" setup>
const loading = ref(false)

async function handleClick() {
  const headers = useRequestHeaders(['cookie'])
  const cookie = headers.cookie as string
  const fetchOptions = { method: 'GET', headers: { cookie } }

  loading.value = true

  try {
    const filePath = await $fetch<string>('/api/data/export', fetchOptions)
    const link = document.createElement('a')
    link.href = filePath
    link.target = '_blank'
    document.body.appendChild(link)
    link.click()
  } catch (error) {
    const toast = useToast()
    toast.value.modelValue = true
    toast.value.message = useString('exportFailed')
    toast.value.variant = 'danger'
  }

  loading.value = false
}
</script>
