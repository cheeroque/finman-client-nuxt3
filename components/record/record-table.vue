<template>
  <div class="record-table">
    <div class="record-table-head">
      <div class="record-table-th record-date">
        {{ useString('date') }}
      </div>
      <div class="record-table-th record-sum">
        {{ useString('sum') }}
      </div>
      <div class="record-table-th record-category">
        {{ useString('category') }}
      </div>
      <div class="record-table-th record-note">
        {{ useString('note') }}
      </div>
    </div>

    <div class="record-table-body">
      <RecordCardEmpty v-if="isEmpty" />

      <RecordCard
        v-for="record in records"
        :key="`record-${record.id}`"
        :record="record"
        :view-mode="viewMode"
        @edit="handleRecordEdit(record)"
      />
    </div>

    <RecordDialog
      v-model="dialogVisible"
      :record="currentRecord"
      @closed="handleDialogClosed"
      @record:delete="emit('records:update')"
      @record:update="emit('records:update')"
    />
  </div>
</template>

<script setup lang="ts">
import { RecordsItem } from '~~/types/records'

const props = defineProps<{
  records: RecordsItem[]
  viewMode?: ViewMode
}>()

const emit = defineEmits(['records:update'])

const currentRecord = ref<RecordsItem>()
const dialogVisible = ref(false)

const isEmpty = computed(() => !props.records.length)

function handleDialogClosed() {
  currentRecord.value = undefined
}

function handleRecordEdit(record: RecordsItem) {
  currentRecord.value = record
  dialogVisible.value = true
}
</script>

<style lang="scss" scoped>
@include media-max-width(lg) {
  .record-table-body {
    gap: 0.5rem 0;
  }
}

@include media-max-width(xl) {
  .record-table-head {
    display: none;
  }

  .record-table-body {
    display: flex;
    flex-direction: column;
  }
}

@include media-min-width(xl) {
  .record-table-head {
    display: flex;
    border-bottom: ($border-width * 2) solid var(--primary-outline);
  }

  .record-table-th {
    flex: 0 0 auto;
    padding: $table-padding-x $table-padding-x;
    font-family: $font-family-alternate;
    font-weight: $font-weight-medium;
    color: var(--primary);
  }

  :deep(.record-date) {
    width: 21%;
  }

  :deep(.record-sum) {
    justify-content: flex-end;
    width: 15%;
    text-align: right;
  }

  :deep(.record-category) {
    width: 27%;
  }

  :deep(.record-note) {
    width: 37%;
  }
}
</style>
