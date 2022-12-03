<template>
  <div :class="cardClasses">
    <NuxtLink :to="monthLink" class="record-date">
      {{ useDateFormat(record.created_at, { dateStyle: 'long', timeStyle: 'short' }) }}
    </NuxtLink>
    <UiButton variant="link" class="record-sum" @click="emit('edit')">
      {{ useNumberFormat(record.sum) }}&nbsp;₽
    </UiButton>
    <NuxtLink :to="categoryLink" class="record-category">
      {{ categoryName }}
    </NuxtLink>
    <p class="record-note">
      <span class="caption">{{ record.note }}</span>
      <UiButton icon="edit-24" icon-size="24" variant="link" class="record-edit" @click="emit('edit')" />
    </p>
  </div>
</template>

<script setup lang="ts">
import { DateTime } from 'luxon'

const props = defineProps<{
  record: RecordsItem
  viewMode?: ViewMode
}>()

const emit = defineEmits(['edit'])

const categoryLink = computed(() => `/categories/${props.record.category.slug}`)
const categoryName = computed(() => props.record.category.name)

const monthLink = computed(() => {
  const date = DateTime.fromISO(props.record.created_at).toJSDate()
  const y = date.getFullYear()
  const m = date.getMonth() + 1
  return `/months/${y}-${m.toString().padStart(2, '0')}`
})

const cardClasses = computed(() => {
  const classes = ['record-card']
  if (!props.viewMode && props.record.category.is_income) {
    classes.push('record-card-income')
  }
  return classes
})
</script>

<style lang="scss" scoped>
.record-card {
  line-height: 1.2;

  &.record-card-income {
    color: var(--on-success-bg);
    background-color: var(--success-bg);
  }
}

.record-date {
  .record-card-income & {
    &:hover {
      color: var(--success);
    }
  }
}

.record-category {
  color: var(--outline);

  &:hover {
    color: var(--primary);
  }

  .record-card-income & {
    color: var(--success);

    &:hover {
      color: var(--success-active);
    }
  }
}

.record-sum {
  font-family: $font-family-alternate;

  .record-card-income & {
    color: var(--success);

    &:hover {
      color: var(--success-active);
    }
  }
}

.record-note {
  margin-bottom: 0;
}

@include media-max-width(xl) {
  .record-card {
    display: grid;
    grid-template-columns: 1fr min-content;
    grid-template-rows: repeat(3, auto);
    gap: 0.25rem $grid-gap;
    padding: $card-padding-y $card-padding-x;
    font-size: $font-size-base * 0.875;
    color: var(--on-background);
    background-color: var(--background);
  }

  .record-date {
    justify-self: start;
    font-family: $font-family-alternate;
    font-weight: $font-weight-medium;
  }

  .record-sum {
    display: flex;
    align-items: flex-end;
    justify-content: flex-end;
    grid-column: 2 / span 1;
    grid-row: 1 / span 3;
    font-size: $font-size-base * 1.375;
    line-height: 1.2;
    text-align: right;
    color: var(--primary);
  }

  .record-category {
    justify-self: start;
  }

  .record-note {
    grid-column: 1 / span 1;
  }

  .record-edit {
    display: none;
  }
}

@include media-max-width(lg) {
  .record-card {
    border-radius: $card-border-radius;
  }
}

@include media-min-width(lg) {
  .record-card {
    &:nth-child(odd) {
      color: var(--on-surface);
      background-color: var(--surface);

      &.record-card-income {
        color: var(--on-success-bg);
        background-color: var(--success-outline);
      }
    }
  }
}

@include media-min-width(xl) {
  .record-card {
    display: flex;
    gap: 0;
  }

  .record-date,
  .record-sum,
  .record-category,
  .record-note {
    padding: $table-padding-y $table-padding-x;
    line-height: $line-height-base * $font-size-base;
  }

  .record-sum {
    font-size: $font-size-base * 1.25;
    font-weight: $font-weight-medium;
    text-align: right;
  }

  .record-note {
    display: flex;
    align-items: center;

    .caption {
      flex: 1 1 auto;
    }
  }

  .record-edit {
    flex: 0 0 auto;
    justify-content: flex-end;
    margin: (-$control-padding-y) (-$control-padding-y) (-$control-padding-y) auto;
    text-align: right;
    color: var(--primary-outline);

    .record-card-income & {
      color: var(--success-outline);

      &:hover {
        color: var(--success);
      }
    }
  }
}
</style>
