<template>
  <div class="datepicker">
    <div class="datepicker-header">
      <slot
        name="header"
        :month="selectedMonth"
        :set-next-month="setNextMonth"
        :set-next-year="setNextYear"
        :set-prev-month="setPrevMonth"
        :set-prev-year="setPrevYear"
        :year="selectedYear"
      >
        <UiButton class="datepicker-nav btn-prev-year" no-text @click="setPrevYear">
          <slot name="btn-prev-year">
            <UiIcon name="chevron-double-left-24" size="24" />
          </slot>
        </UiButton>

        <UiButton class="datepicker-nav btn-prev-month" no-text @click="setPrevMonth">
          <slot name="btn-prev-month">
            <UiIcon name="chevron-left-24" size="24" />
          </slot>
        </UiButton>

        <span class="datepicker-title">{{ title }}</span>

        <UiButton class="datepicker-nav btn-next-month" no-text @click="setNextMonth">
          <slot name="btn-next-month">
            <UiIcon name="chevron-right-24" size="24" />
          </slot>
        </UiButton>

        <UiButton class="datepicker-nav btn-next-year" no-text @click="setNextYear">
          <slot name="btn-next-year">
            <UiIcon name="chevron-double-right-24" size="24" />
          </slot>
        </UiButton>
      </slot>
    </div>

    <div class="datepicker-body">
      <div class="datepicker-weekdays">
        <div
          v-for="(weekday, index) in weekdays"
          :key="`weekday-${index}`"
          :class="`datepicker-weekday datepicker-weekday-${index}`"
        >
          {{ weekday }}
        </div>
      </div>

      <div class="datepicker-month">
        <button
          v-for="(day, index) in monthdays"
          :key="`monthday-${index}`"
          :class="getDayClasses(day)"
          type="button"
          @click="setDate(day)"
        >
          {{ day.day }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { DateTime, Info } from 'luxon'

type UiDatepickerProps = {
  locale?: string
  modelValue?: Date
  titleFormat?: string
}

const props = defineProps<UiDatepickerProps>()

const emit = defineEmits(['click:day', 'update:modelValue'])

const luxonDate = ref(DateTime.fromJSDate(props.modelValue ?? new Date()).set({ day: 1 }))

const locale = computed(() => props.locale ?? useLocale())
const titleFormat = computed(() => props.titleFormat || 'LLLL y')

const weekdays = Info.weekdays('short', { locale: locale.value })

const selectedDay = computed(() => DateTime.fromJSDate(props.modelValue ?? new Date()).day)
const selectedMonth = computed(() => luxonDate.value.month)
const selectedYear = computed(() => luxonDate.value.year)

const title = computed(() => luxonDate.value.toFormat(titleFormat.value, { locale: locale.value }))

const monthdays = computed(() => {
  let days = []

  const leftPad = luxonDate.value.weekday - 1
  const rightPad = 7 - luxonDate.value.plus({ months: 1 }).minus({ days: 1 }).weekday
  const monthLength = luxonDate.value.daysInMonth ?? 0

  for (let i = -leftPad; i < monthLength + rightPad; i++) {
    days.push(luxonDate.value.plus({ days: i }))
  }

  return days
})

function getDayClasses(day: DateTime): string[] {
  const classes = ['datepicker-day']

  if (day.day === selectedDay.value && day.month === selectedMonth.value) {
    classes.push('active')
  }

  if (day.month !== selectedMonth.value) {
    classes.push('not-current-month')
  }

  if (day.day === DateTime.now().day && day.month === DateTime.now().month) {
    classes.push('today')
  }

  return classes
}

function setNextMonth() {
  luxonDate.value = luxonDate.value.plus({ months: 1 })
}

function setNextYear() {
  luxonDate.value = luxonDate.value.plus({ years: 1 })
}

function setPrevMonth() {
  luxonDate.value = luxonDate.value.minus({ months: 1 })
}

function setPrevYear() {
  luxonDate.value = luxonDate.value.minus({ years: 1 })
}

function setDate(date: DateTime) {
  emit('click:day')
  emit('update:modelValue', date.toJSDate())
}
</script>
