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

    <div :style="{ transform: `translateX(${yearOffset * 100}%)` }" class="calendar-body">
      <nav v-for="item in calendarYears" :key="`year-${item.year}`" class="calendar-year">
        <ul class="list-unstyled calendar-months">
          <li v-for="month in item.months" :key="`${month}-${item.year}`" class="calendar-month">
            <span v-if="month.disabled" class="calendar-link disabled">
              {{ month.month }}
            </span>

            <NuxtLink
              v-else
              :class="{ active: month.link === activeMonthLink }"
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
import { useRecordsStore } from '~/store/records'

interface CalendarMonth {
  disabled?: boolean
  link: string
  month: string
}

interface CalendarYear {
  months: CalendarMonth[]
  year: number
}

const props = defineProps<{
  date?: Date
  numericMonths?: boolean
}>()

const recordsStore = useRecordsStore()

const calendarYears: CalendarYear[] = []

const startDate = recordsStore.firstRecord
  ? DateTime.fromFormat(recordsStore.firstRecord.created_at, 'yyyy-LL-dd HH:mm:ss')
  : DateTime.now()

const endDate = DateTime.now()

const monthFormat = props.numericMonths ? '2-digit' : 'long'

for (let y = startDate.year; y <= endDate.year; y++) {
  const months: CalendarMonth[] = []

  for (let m = 1; m <= 12; m++) {
    const date = DateTime.fromObject({ month: m, year: y })
    const month = date.toLocaleString({ month: monthFormat }, { locale: useLocale() })
    const link = date.toFormat('yyyy-LL')

    const isTooEarly = y <= startDate.year && m < startDate.month
    const isTooLate = y >= endDate.year && m > endDate.month

    months.push({
      month,
      link,
      disabled: isTooEarly || isTooLate,
    })
  }

  calendarYears.push({ year: y, months })
}

const currentDate = props.date || new Date()
const currentYear = ref(currentDate.getFullYear())

const isBeginning = computed(() => startDate.year >= currentYear.value)
const isEnd = computed(() => endDate.year <= currentYear.value)

const yearOffset = computed(() => startDate.year - currentYear.value)

const activeMonthLink = computed(() => {
  if (!props.date) return
  return DateTime.fromJSDate(props.date).toFormat('yyyy-LL')
})

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
