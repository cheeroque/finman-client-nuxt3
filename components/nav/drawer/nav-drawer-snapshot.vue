<template>
  <UiButton
    :loading="pending || recordsStore.loading"
    class="drawer-item"
    icon="datetime-24"
    icon-size="24"
    @click="emit('action')"
  >
    <span class="caption">{{ caption }}</span>
  </UiButton>
</template>

<script setup lang="ts">
import { DateTime } from 'luxon'
import { useRecordsStore } from '~/store/records'

const emit = defineEmits(['action'])

const recordsStore = useRecordsStore()

const caption = computed(() => {
  const snapshot = recordsStore.snapshot

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

const { pending } = await useAsyncData('latest-snapshot', () => recordsStore.fetchSnapshot())
</script>
