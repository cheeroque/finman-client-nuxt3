<template>
  <div :class="cardClasses">
    <NuxtLink :to="monthLink" class="transaction-date">
      {{ formatDate(transactionFragment.created_at ?? '') }}
    </NuxtLink>

    <UiButton class="transaction-sum" variant="link" @click="emit('edit')">
      {{ useNumberFormat(transactionFragment.sum) }}&nbsp;₽
    </UiButton>

    <NuxtLink :to="categoryLink" class="transaction-category">
      {{ categoryName }}
    </NuxtLink>

    <p class="transaction-note">
      <span class="caption">{{ transactionFragment.note }}</span>
      <UiButton class="transaction-edit" icon="edit-24" icon-size="24" variant="link" no-text @click="emit('edit')" />
    </p>
  </div>
</template>

<script setup lang="ts">
import { DateTime } from 'luxon'
import { readFragment, CategoryFragment, TransactionFragment } from '~/graphql'
import type { FragmentOf } from '~/graphql'
import type { ViewMode } from '~/types'

type Transaction = FragmentOf<typeof TransactionFragment> & {
  category?: FragmentOf<typeof CategoryFragment>
}

type TransactionCardProps = {
  transaction: Transaction
  viewMode?: ViewMode
}

const props = defineProps<TransactionCardProps>()

const emit = defineEmits(['edit'])

const transactionFragment = computed(() => readFragment(TransactionFragment, props.transaction))
const categoryFragment = computed(() => readFragment(CategoryFragment, props.transaction?.category))

const categoryLink = computed(() => `/categories/${categoryFragment.value?.slug}`)
const categoryName = computed(() => categoryFragment.value?.name)

const cardClasses = computed(() => {
  const classes = ['transaction-card']

  if (!props.viewMode && categoryFragment.value?.is_income) {
    classes.push('transaction-card-income')
  }

  return classes
})

const monthLink = computed(() => {
  if (!transactionFragment.value.created_at) return

  const date = DateTime.fromFormat(transactionFragment.value.created_at, 'yyyy-LL-dd HH:mm:ss').toFormat('yyyy-LL')
  return `/months/${date}`
})

function formatDate(datestring: string): string {
  return DateTime.fromFormat(datestring, 'yyyy-LL-dd HH:mm:ss').toLocaleString(
    { dateStyle: 'long', timeStyle: 'short' },
    { locale: useLocale() }
  )
}
</script>

<style lang="scss" scoped>
.transaction-card {
  line-height: 1.2;

  &.transaction-card-income {
    color: var(--on-success-bg);
    background-color: var(--success-bg);
  }
}

.transaction-date {
  .transaction-card-income & {
    &:hover {
      color: var(--success);
    }
  }
}

.transaction-category {
  color: var(--outline);

  &:hover {
    color: var(--primary);
  }

  .transaction-card-income & {
    color: var(--success);

    &:hover {
      color: var(--success-active);
    }
  }
}

.transaction-sum {
  font-family: $font-family-alternate;

  .transaction-card-income & {
    color: var(--success);

    &:hover {
      color: var(--success-active);
    }
  }
}

.transaction-note {
  margin-bottom: 0;
}

@include media-max-width(xl) {
  .transaction-card {
    display: grid;
    grid-template-columns: 1fr min-content;
    grid-template-rows: repeat(3, auto);
    gap: 0.25rem $grid-gap;
    padding: $card-padding-y $card-padding-x;
    font-size: $font-size-base * 0.875;
    color: var(--on-background);
    background-color: var(--background);
  }

  .transaction-date {
    justify-self: start;
    font-family: $font-family-alternate;
    font-weight: $font-weight-medium;
  }

  .transaction-sum {
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

  .transaction-category {
    justify-self: start;
  }

  .transaction-note {
    grid-column: 1 / span 1;
  }

  .transaction-edit {
    display: none;
  }
}

@include media-max-width(lg) {
  .transaction-card {
    border-radius: $card-border-radius;
  }
}

@include media-min-width(lg) {
  .transaction-card {
    &:nth-child(odd) {
      color: var(--on-surface);
      background-color: var(--surface);

      &.transaction-card-income {
        color: var(--on-success-bg);
        background-color: var(--success-outline);
      }
    }
  }
}

@include media-min-width(xl) {
  .transaction-card {
    display: flex;
    gap: 0;
  }

  .transaction-date,
  .transaction-sum,
  .transaction-category,
  .transaction-note {
    padding: $table-padding-y $table-padding-x;
    line-height: $line-height-base * $font-size-base;
  }

  .transaction-sum {
    font-size: $font-size-base * 1.25;
    font-weight: $font-weight-medium;
    text-align: right;
  }

  .transaction-note {
    display: flex;
    align-items: center;

    .caption {
      flex: 1 1 auto;
    }
  }

  .transaction-edit {
    flex: 0 0 auto;
    justify-content: flex-end;
    margin: (-$control-padding-y) (-$control-padding-y) (-$control-padding-y) auto;
    text-align: right;
    color: var(--primary-outline);

    .transaction-card-income & {
      color: var(--success-outline);

      &:hover {
        color: var(--success);
      }
    }
  }
}
</style>
