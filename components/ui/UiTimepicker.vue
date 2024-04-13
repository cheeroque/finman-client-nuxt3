<template>
  <div class="timepicker">
    <div v-if="!hideHeader" class="timepicker-header">
      <slot name="header">
        {{ title }}
      </slot>
    </div>

    <div class="timepicker-body">
      <div class="timepicker-hours">
        <button
          v-for="hourIndex in 24"
          :key="`hour-${hourIndex}`"
          :class="{ active: currentHour === hourIndex - 1 }"
          class="timepicker-hour"
          type="button"
          @click="setHour(hourIndex - 1)"
        >
          {{ formatUnit(hourIndex - 1) }}
        </button>
      </div>

      <div class="timepicker-minutes">
        <button
          v-for="minuteIndex in minuteCount"
          :key="`minute-${minuteIndex}`"
          :class="{ active: currentMinute === minuteIndex - 1 }"
          class="timepicker-minute"
          type="button"
          @click="setMinute((minuteIndex - 1) * stepMinutes)"
        >
          {{ formatUnit((minuteIndex - 1) * stepMinutes) }}
        </button>
      </div>

      <div v-if="showSeconds" class="timepicker-seconds">
        <button
          v-for="secondIndex in secondCount"
          :key="`second-${secondIndex}`"
          :class="{ active: currentSecond === secondIndex - 1 }"
          class="timepicker-second"
          type="button"
          @click="setSecond((secondIndex - 1) * stepSeconds)"
        >
          {{ formatUnit((secondIndex - 1) * stepSeconds) }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { DateTime } from 'luxon'

type TimepickerProps = {
  hideHeader?: boolean
  locale?: string
  modelValue?: Date
  showSeconds?: boolean
  stepMinutes?: number | string
  stepSeconds?: number | string
}

const props = defineProps<TimepickerProps>()

const emit = defineEmits(['click:hours', 'click:minutes', 'click:seconds', 'update:modelValue'])

const currentHour = ref()
const currentMinute = ref()
const currentSecond = ref()

const locale = computed(() => props.locale ?? useLocale())

const stepMinutes = computed(() => Number(props.stepMinutes) || 5)
const stepSeconds = computed(() => Number(props.stepSeconds) || 5)

const luxonDate = computed(() => DateTime.fromJSDate(props.modelValue ?? new Date()))
const minuteCount = computed(() => Math.round(60 / stepMinutes.value))
const secondCount = computed(() => Math.round(60 / stepSeconds.value))

const titleFormat = computed(() => `HH:mm${props.showSeconds ? ':ss' : ''}`)
const title = computed(() => luxonDate.value.toFormat(titleFormat.value, { locale: locale.value }))

function formatUnit(unit: number) {
  return unit.toString().padStart(2, '0')
}

function setHour(hour: number) {
  emit('click:hours')

  currentHour.value = hour
  const clickedLast = currentMinute.value !== undefined && (currentSecond.value !== undefined || !props.showSeconds)

  if (clickedLast) {
    setValue()
  }
}

function setMinute(minute: number) {
  emit('click:minutes')

  currentMinute.value = minute

  const clickedLast = currentHour.value !== undefined && (currentSecond.value !== undefined || !props.showSeconds)
  if (clickedLast) {
    setValue()
  }
}

function setSecond(second: number) {
  emit('click:seconds')

  currentSecond.value = second

  const clickedLast = currentHour.value !== undefined && currentMinute.value !== undefined
  if (clickedLast) {
    setValue()
  }
}

function setValue() {
  const date = DateTime.fromObject({
    hour: currentHour.value,
    minute: currentMinute.value,
    second: currentSecond.value,
  }).toJSDate()

  emit('update:modelValue', date)

  currentHour.value = undefined
  currentMinute.value = undefined
  currentSecond.value = undefined
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
