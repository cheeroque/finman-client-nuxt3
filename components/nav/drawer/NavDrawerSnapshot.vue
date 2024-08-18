<template>
  <UiButton :loading="loading" class="drawer-item" icon="datetime-24" icon-size="24" @click="emit('click')">
    <span class="caption">{{ caption }}</span>
  </UiButton>
</template>

<script setup lang="ts">
import { DateTime } from 'luxon'
import type { Snapshot } from '~/types'

type NavDrawerSnapshotProps = {
  loading?: boolean
  snapshot?: Snapshot
}

const props = defineProps<NavDrawerSnapshotProps>()

const emit = defineEmits(['click'])

const caption = computed(() => {
  if (!props.snapshot?.sum) {
    return useString('createSnapshot')
  }

  const strings = [`${useNumberFormat(props.snapshot.sum)} ₽`]

  if (props.snapshot.createdAt) {
    strings.push(
      DateTime.fromSQL(props.snapshot.createdAt).toLocaleString(
        { day: '2-digit', month: '2-digit', year: 'numeric' },
        { locale: useLocale() }
      )
    )
  }

  return strings.join(', ')
})
</script>
