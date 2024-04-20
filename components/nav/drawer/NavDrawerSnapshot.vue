<template>
  <UiButton :loading="loading" class="drawer-item" icon="datetime-24" icon-size="24" @click="emit('click')">
    <span class="caption">{{ caption }}</span>
  </UiButton>
</template>

<script setup lang="ts">
import { DateTime } from 'luxon'
import { readFragment, SnapshotFragment } from '~/graphql'
import type { FragmentOf } from '~/graphql'

type NavDrawerSnapshotProps = {
  loading?: boolean
  snapshot?: FragmentOf<typeof SnapshotFragment>
}

const props = defineProps<NavDrawerSnapshotProps>()

const emit = defineEmits(['click'])

const caption = computed(() => {
  const snapshot = readFragment(SnapshotFragment, props.snapshot)

  if (!snapshot?.balance) {
    return useString('createSnapshot')
  }

  const strings = [`${useNumberFormat(snapshot.balance)} ₽`]

  if (snapshot.created_at) {
    strings.push(
      DateTime.fromFormat(snapshot.created_at, 'yyyy-LL-dd HH:mm:ss').toLocaleString(
        { day: '2-digit', month: '2-digit', year: 'numeric' },
        { locale: useLocale() }
      )
    )
  }

  return strings.join(', ')
})
</script>
