<template>
  <UiButton :loading="loading" class="drawer-item" icon="export-24" icon-size="24" @click="handleClick">
    <span class="caption">{{ useString('exportData') }}</span>
  </UiButton>
</template>

<script setup lang="ts">
import RECORDS_EXPORT_MUTATION from '~/graphql/RecordsExport.gql'

interface RecordsExportResponse {
  result: {
    file: {
      path: string
      size: number
    }
  }
}

const { $urql } = useNuxtApp()
const config = useRuntimeConfig()

const loading = ref(false)

async function handleClick() {
  loading.value = true

  try {
    const { data, error } = await $urql.mutation<RecordsExportResponse>(RECORDS_EXPORT_MUTATION, {}).toPromise()

    if (data?.result) {
      const filePath = data.result.file.path
      const link = document.createElement('a')

      link.href = `${config.public.staticUrl}${filePath}`
      link.target = '_blank'

      document.body.appendChild(link)
      link.click()
    } else {
      throw new Error(error?.message ?? useString('exportFailed'))
    }
  } catch (error) {
    const toast = useToast()
    toast.value.modelValue = true
    toast.value.message = useString('exportFailed')
    toast.value.variant = 'danger'
  }

  loading.value = false
}
</script>
