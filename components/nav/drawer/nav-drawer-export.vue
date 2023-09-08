<template>
  <UiButton :loading="loading" icon="export-24" icon-size="24" class="drawer-item" @click="handleClick">
    <span class="caption">{{ useString('exportData') }}</span>
  </UiButton>
</template>

<script setup lang="ts">
import RECORDS_EXPORT_MUTATION from '@/graphql/RecordsExport.gql'

interface RecordsExportData {
  result: RecordsExportDataOutput
}

interface RecordsExportDataOutput {
  file: RecordsExportDataOutputFile
}

interface RecordsExportDataOutputFile {
  path: string
  size: number
}

const loading = ref(false)

async function handleClick() {
  loading.value = true

  const config = useRuntimeConfig()

  const { mutate } = useMutation<RecordsExportData>(RECORDS_EXPORT_MUTATION)

  try {
    const response = await mutate()

    if (response?.data?.result) {
      const filePath = response.data.result.file.path
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
