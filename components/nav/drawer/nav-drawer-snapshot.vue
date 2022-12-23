<template>
  <UiButton icon="datetime-24" icon-size="24" class="drawer-item" @click="emit('click')">
    <span class="caption">{{ caption }}</span>
  </UiButton>
</template>

<script lang="ts" setup>
import { DateTime } from 'luxon'
import { useRecordsStore } from '~/store/records'

const emit = defineEmits(['click'])

const recordsStore = useRecordsStore()
const caption = computed(() => {
  const snapshot = recordsStore.snapshot
  if (!snapshot?.balance) {
    return useString('createSnapshot')
  }
  const strings = [`${useNumberFormat(snapshot.balance)} ₽`]
  if (snapshot.created_at) {
    strings.push(
      DateTime.fromISO(snapshot.created_at).toLocaleString(
        { day: '2-digit', month: '2-digit', year: 'numeric' },
        { locale: useLocale() }
      )
    )
  }
  return strings.join(', ')
})
</script>
