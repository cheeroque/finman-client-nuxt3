<template>
  <UiButton :loading="loading" class="drawer-item" icon="export-24" icon-size="24" @click="handleClick">
    <span class="caption">{{ useString('exportData') }}</span>
  </UiButton>
</template>

<script setup lang="ts">
import { useMutation } from '@urql/vue'

import RECORDS_EXPORT_MUTATION from '~/graphql/RecordsExport.gql'

interface RecordsExportData {
  result: {
    file: {
      path: string
      size: number
    }
  }
}

const { executeMutation } = useMutation<RecordsExportData>(RECORDS_EXPORT_MUTATION)

const loading = ref(false)

async function handleClick() {
  loading.value = true

  const config = useRuntimeConfig()

  try {
    const { data } = await executeMutation()

    if (data?.result) {
      const filePath = data.result.file.path
      const link = document.createElement('a')

      link.href = `${config.public.staticUrl}${filePath}`
      link.target = '_blank'

      document.body.appendChild(link)
      link.click()
    } else {
      throw new Error(useString('exportFailed'))
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
