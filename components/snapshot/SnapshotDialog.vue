<template>
  <UiDialog
    :loading="loading"
    :model-value="modelValue"
    :title="useString('newSnapshot')"
    @update:modelValue="emit('update:modelValue', $event)"
  >
    <SnapshotForm :id="formId" :snapshot="snapshot" @submit="handleSubmit" />

    <template #footer="{ close }">
      <div class="row flex-fill g-8">
        <div class="col-12 col-md-auto order-md-2 ms-md-auto">
          <UiButton :form="formId" type="submit" variant="primary" block>
            {{ useString('save') }}
          </UiButton>
        </div>

        <div class="col-12 col-md-auto order-md-1">
          <UiButton variant="neutral-muted" block @click="close">
            {{ useString('cancel') }}
          </UiButton>
        </div>
      </div>
    </template>
  </UiDialog>
</template>

<script setup lang="ts">
import type { Revise } from '~/gen/gql/graphql'

type SnapshotDialogProps = {
  modelValue?: boolean
  snapshot?: Revise
}

const props = defineProps<SnapshotDialogProps>()

const emit = defineEmits(['success', 'update:modelValue'])

const formId = useId()

const loading = ref(false)

/* Create new snapshot. Show toast on success or error */

async function handleSubmit(snapshot: Revise) {
  const { balance, created_at, note } = snapshot
  const query = { balance, created_at, note }

  loading.value = true

  try {
    const { result } = await $fetch('/api/snapshot', { method: 'POST', query })

    if (result) {
      useShowToast({ message: useString('snapshotSaved', `#${result.id}`) })

      emit('success')
      emit('update:modelValue', false)
    } else {
      throw new Error()
    }
  } catch (error: any) {
    useShowToast({
      message: error.value?.message ?? useString('error'),
      variant: 'danger',
    })
  }

  loading.value = false
}
</script>
