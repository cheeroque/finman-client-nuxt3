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
      <nav v-for="item in calendarYears" :key="`year-${item.year}`" class="calendar-year">
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

type CalendarMonth = {
  disabled?: boolean
  link: string
  month: string
}

type MonthCalendarProps = {
  date?: Date
  numericMonths?: boolean
}

const props = defineProps<MonthCalendarProps>()

const LINK_FORMAT = 'yyyy-LL'

const startDate = useStartDate()

const currentDate = props.date ?? new Date()
const currentYear = ref(currentDate.getFullYear())

const startMonth = computed(() => startDate.value?.month ?? currentDate.getMonth() + 1)
const startYear = computed(() => startDate.value?.year ?? currentYear.value)
const endYear = computed(() => DateTime.now().year)

/* Array of calendar pages (years). Each page contains an array of 12 months.
 * Months that are before the earliest or after the latest transaction creation date
 * are disabled */

const calendarYears = computed(() => {
  const years = []

  const monthFormat = props.numericMonths ? '2-digit' : 'long'

  for (let y = startYear.value; y <= endYear.value; y++) {
    const months: CalendarMonth[] = []

    for (let m = 1; m <= 12; m++) {
      const date = DateTime.fromObject({ month: m, year: y })
      const month = date.toLocaleString({ month: monthFormat }, { locale: useLocale() })
      const link = date.toFormat(LINK_FORMAT)

      const isTooEarly = y <= startYear.value && m < startMonth.value
      const isTooLate = y >= endYear.value && m > DateTime.now().month

      months.push({
        month,
        link,
        disabled: isTooEarly || isTooLate,
      })
    }

    years.push({ year: y, months })
  }

  return years
})

/* Calendar beginning/end state to disable back/forward buttons */

const isBeginning = computed(() => Number(startYear.value) >= currentYear.value)
const isEnd = computed(() => Number(endYear.value) <= currentYear.value)

/* Percent value to translate current calendar page with CSS */

const translateOffset = computed(() => (Number(startYear.value) - currentYear.value || 0) * 100)

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
