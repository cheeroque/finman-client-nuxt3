<template>
  <div class="datepicker">
    <div class="datepicker-header">
      <slot
        name="header"
        :month="currentMonth"
        :set-next-month="setNextMonth"
        :set-next-year="setNextYear"
        :set-prev-month="setPrevMonth"
        :set-prev-year="setPrevYear"
        :year="currentYear"
      >
        <UiButton class="btn-prev-year" @click="setPrevYear">
          <slot name="btn-prev-year"> &lt;&lt; </slot>
        </UiButton>
        <UiButton class="btn-prev-month" @click="setPrevMonth">
          <slot name="btn-prev-month">&lt;</slot>
        </UiButton>
        <span class="datepicker-title">{{ title }}</span>
        <UiButton class="btn-next-month" @click="setNextMonth">
          <slot name="btn-next-month"> &gt; </slot>
        </UiButton>
        <UiButton class="btn-next-year" @click="setNextYear">
          <slot name="btn-next-year"> &gt;&gt; </slot>
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
          :class="{ 'not-current-month': day.month !== currentMonth }"
          class="datepicker-day"
          @click="setDate(day)"
        >
          {{ day.day }}
        </button>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { DateTime, Info } from 'luxon'

const props = defineProps<{
  locale?: string
  modelValue: Date
  titleFormat?: string //{ type: String; default: 'LLLL y' }
}>()
const emit = defineEmits(['click:day', 'update:modelValue'])

const locale = props.locale
const titleFormat = computed(() => props.titleFormat || 'LLLL y')

const weekdays = Info.weekdays('short', { locale })

const modelValueDate = DateTime.fromJSDate(props.modelValue)

/* luxon DateObjectUnits doesn't work here for some reason */
const currentDate = ref(
  DateTime.fromObject({
    year: modelValueDate.year,
    month: modelValueDate.month,
  } as any)
)

const currentMonth = computed(() => currentDate.value.month)
const currentYear = computed(() => currentDate.value.year)
const title = computed(() => currentDate.value.toFormat(titleFormat.value, { locale }))

const monthdays = computed(() => {
  let days = []
  const leftPad = currentDate.value.weekday - 1
  const rightPad = 7 - currentDate.value.plus({ months: 1 }).minus({ days: 1 }).weekday
  const monthLength = currentDate.value.daysInMonth
  for (let i = -leftPad; i < monthLength + rightPad; i++) {
    days.push(currentDate.value.plus({ days: i }))
  }
  return days
})

function setNextMonth() {
  currentDate.value = currentDate.value.plus({ months: 1 })
}
function setNextYear() {
  currentDate.value = currentDate.value.plus({ years: 1 })
}
function setPrevMonth() {
  currentDate.value = currentDate.value.minus({ months: 1 })
}
function setPrevYear() {
  currentDate.value = currentDate.value.minus({ years: 1 })
}

function setDate(date) {
  emit('click:day')
  emit('update:modelValue', date.toJSDate())
}
</script>

<style lang="scss" scoped>
.datepicker-header {
  display: flex;
}

.datepicker-weekdays,
.datepicker-month {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
}

.datepicker-weekday,
.datepicker-day {
  text-align: center;
}

.datepicker-title {
  flex: 1 1 auto;
  text-align: center;
}
</style>
