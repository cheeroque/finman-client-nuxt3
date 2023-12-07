<template>
  <div class="calendar">
    <header class="calendar-header">
      <UiButton
        :aria-label="useString('previousYear')"
        :disabled="isBeginning"
        :title="useString('previousYear')"
        icon="chevron-double-left-24"
        icon-size="24"
        @click="setYearPrevious"
      />

      <span class="calendar-title">{{ currentYear }}</span>

      <UiButton
        :aria-label="useString('nextYear')"
        :disabled="isEnd"
        :title="useString('nextYear')"
        icon="chevron-double-right-24"
        icon-size="24"
        @click="setYearNext"
      />
    </header>

    <div :style="{ transform: `translateX(${translateOffset}%)` }" class="calendar-body">
      <nav v-for="item in data?.calendarYears" :key="`year-${item.year}`" class="calendar-year">
        <ul class="list-unstyled calendar-months">
          <li v-for="month in item.months" :key="`${month}-${item.year}`" class="calendar-month">
            <span v-if="month.disabled" class="calendar-link disabled">
              {{ month.month }}
            </span>

            <NuxtLink
              v-else
              :class="{ active: isLinkActive(month.link) }"
              :to="`/months/${month.link}`"
              class="calendar-link"
            >
              {{ month.month }}
            </NuxtLink>
          </li>
        </ul>
      </nav>
    </div>
  </div>
</template>

<script setup lang="ts">
import { DateTime } from 'luxon'

import RECORDS_QUERY from '~/graphql/Records.gql'

interface CalendarMonth {
  disabled?: boolean
  link: string
  month: string
}

const props = defineProps<{
  date?: Date
  numericMonths?: boolean
}>()

const LINK_FORMAT = 'yyyy-LL'

const { $urql } = useNuxtApp()

const currentDate = props.date ?? new Date()
const currentYear = ref(currentDate.getFullYear())

const { data } = await useAsyncData(() => fetchFirstRecord())

/* Calendar beginning/end state to disable back/forward buttons */

const isBeginning = computed(() => Number(data.value?.startYear) >= currentYear.value)
const isEnd = computed(() => Number(data.value?.endYear) <= currentYear.value)

/* Percent value to translate current calendar page with CSS */

const translateOffset = computed(() => (Number(data.value?.startYear) - currentYear.value || 0) * 100)

/* Fetch record with the earliest creation date to determine year and month
 * to start calendar from */

async function fetchFirstRecord() {
  const variables = {
    first: 1,
    orderBy: [{ column: 'CREATED_AT', order: 'ASC' }],
  }

  const { data } = await $urql.query(RECORDS_QUERY, variables).toPromise()

  const firstRecord = data?.records.data?.[0] ?? {}

  const dateTime = DateTime.fromFormat(firstRecord.created_at ?? '', 'yyyy-LL-dd HH:mm:ss')

  const endDate = DateTime.now()
  const endYear = endDate.year

  const startDate = dateTime.isValid ? dateTime : endDate
  const startYear = startDate.year

  const calendarYears = buildCalendar(startDate, endDate)

  return { calendarYears, endYear, startYear }
}

/* Build an array of calendar pages (years). Each page contains an array
 * of 12 months. Months that are before the earliest or after the latest record
 * creation date are disabled */

function buildCalendar(startDate: DateTime, endDate: DateTime) {
  const years = []

  const monthFormat = props.numericMonths ? '2-digit' : 'long'

  for (let y = startDate.year; y <= endDate.year; y++) {
    const months: CalendarMonth[] = []

    for (let m = 1; m <= 12; m++) {
      const date = DateTime.fromObject({ month: m, year: y })
      const month = date.toLocaleString({ month: monthFormat }, { locale: useLocale() })
      const link = date.toFormat(LINK_FORMAT)

      const isTooEarly = y <= startDate.year && m < startDate.month
      const isTooLate = y >= endDate.year && m > endDate.month

      months.push({
        month,
        link,
        disabled: isTooEarly || isTooLate,
      })
    }

    years.push({ year: y, months })
  }

  return years
}

function isLinkActive(link: string) {
  if (!props.date) return false

  return link === DateTime.fromJSDate(props.date).toFormat(LINK_FORMAT)
}

function setYearNext() {
  currentYear.value++
}

function setYearPrevious() {
  currentYear.value--
}
</script>

<style lang="scss" scoped>
.calendar {
  overflow: hidden;
}
.calendar-header {
  display: flex;
  align-items: center;
  padding-bottom: $card-padding-y;
  text-align: center;

  :deep(.btn) {
    padding: 0;
    border: none;
    color: var(--primary);
  }
}

.calendar-title {
  flex: 1 1 auto;
  font-family: $font-family-alternate;
  font-size: $font-size-base * 1.125;
  color: var(--primary);
}

.calendar-body {
  display: flex;
  margin-left: -$card-padding-x;
  margin-right: -$card-padding-x;
  transition: $transition;
  transition-property: transform;
}

.calendar-year {
  flex: 0 0 100%;
  padding-left: $card-padding-x;
  padding-right: $card-padding-x;
}

.calendar-months {
  display: grid;
  gap: 0.5rem;
  grid-template-columns: repeat(3, 1fr);
}

.calendar-month {
  position: relative;

  &::before {
    display: block;
    content: '';
    padding-bottom: 70%;
  }

  .calendar-link {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
  }
}

.calendar-link {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.5rem;
  font-family: $font-family-alternate;
  text-align: center;
  white-space: nowrap;
  text-overflow: ellipsis;
  border-radius: 0.25rem;
  overflow: hidden;
  transition: $transition;
  transition-property: color, background-color;

  &:not(.disabled) {
    color: var(--on-surface);
    background-color: var(--surface);

    &:hover {
      text-decoration: none;
      color: var(--on-primary-bg);
      background-color: var(--primary-bg);
    }

    &.active {
      color: var(--on-primary);
      background-color: var(--primary);

      &:hover {
        color: var(--on-primary);
        background-color: var(--primary-active);
      }
    }
  }

  &.disabled {
    color: var(--primary-bg);
  }
}
</style>
