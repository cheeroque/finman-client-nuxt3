<template>
  <UiButton :loading="loading" class="drawer-item" icon="export-24" icon-size="24" @click="handleClick">
    <span class="caption">{{ useString('exportData') }}</span>
  </UiButton>
</template>

<script setup lang="ts">
const config = useRuntimeConfig()
const toast = useToast()

const loading = ref(false)

async function handleClick() {
  loading.value = true

  try {
    const { data, error } = await useFetch('/api/export')

    if (data.value?.data?.result.file) {
      const file = data.value?.data.result.file
      const link = document.createElement('a')

      link.href = `${config.public.staticUrl}${file.path}`
      link.target = '_blank'

      document.body.appendChild(link)
      link.click()
    } else {
      throw new Error(error.value?.message ?? useString('exportFailed'))
    }
  } catch (error) {
    toast.value.modelValue = true
    toast.value.message = useString('exportFailed')
    toast.value.variant = 'danger'
  }

  loading.value = false
}
</script>
