<template>
  <UiButton :loading="loading" class="drawer-item" icon="datetime-24" icon-size="24" @click="emit('click')">
    <span class="caption">{{ caption }}</span>
  </UiButton>
</template>

<script setup lang="ts">
import { DateTime } from 'luxon'

import type { RecordsSnapshot } from '~/types'

interface NavDrawerSnapshotProps {
  loading?: boolean
  snapshot?: RecordsSnapshot
}

const props = defineProps<NavDrawerSnapshotProps>()

const emit = defineEmits(['click'])

const caption = computed(() => {
  if (!props.snapshot?.balance) {
    return useString('createSnapshot')
  }

  const strings = [`${useNumberFormat(props.snapshot.balance)} ₽`]

  if (props.snapshot.created_at) {
    strings.push(
      DateTime.fromFormat(props.snapshot.created_at, 'yyyy-LL-dd HH:mm:ss').toLocaleString(
        { day: '2-digit', month: '2-digit', year: 'numeric' },
        { locale: useLocale() }
      )
    )
  }

  return strings.join(', ')
})
</script>
