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
          class="timepicker-hour"
          @click="setHour(hourIndex - (use12Hours ? 0 : 1))"
        >
          {{ formatUnit(hourIndex - (use12Hours ? 0 : 1)) }}
        </button>
      </div>
      <div class="timepicker-minutes">
        <button
          v-for="minuteIndex in minuteCount"
          :key="`minute-${minuteIndex}`"
          class="timepicker-minute"
          @click="setMinute((minuteIndex - 1) * parseInt(stepMinutes))"
        >
          {{ formatUnit((minuteIndex - 1) * parseInt(stepMinutes)) }}
        </button>
      </div>
      <div v-if="showSeconds" class="timepicker-seconds">
        <button
          v-for="secondIndex in secondCount"
          :key="`second-${secondIndex}`"
          class="timepicker-second"
          @click="setSecond((secondIndex - 1) * parseInt(stepSeconds))"
        >
          {{ formatUnit((secondIndex - 1) * parseInt(stepSeconds)) }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { DateTime } from 'luxon'

const props = defineProps({
  hideHeader: Boolean,
  locale: String,
  modelValue: { type: Object, default: new Date() },
  showSeconds: Boolean,
  stepMinutes: { type: [Number, String], default: 1 },
  stepSeconds: { type: [Number, String], default: 1 },
})
const emit = defineEmits(['click:hours', 'click:meridiem', 'click:minutes', 'click:seconds', 'update:modelValue'])

const { locale } = props

const luxonDate = DateTime.fromJSDate(props.modelValue)

const minuteCount = computed(() => Math.round(60 / parseInt(props.stepMinutes)))
const secondCount = computed(() => Math.round(60 / parseInt(props.stepSeconds)))

const titleFormat = computed(() => `HH:mm${props.showSeconds ? ':ss' : ''}`)
const title = computed(() => luxonDate.toFormat(titleFormat.value, { locale }))

const currentHour = ref(null)
const currentMinute = ref(null)
const currentSecond = ref(null)

function formatUnit(unit) {
  return unit.toString().padStart(2, '0')
}

function setHour(hour) {
  emit('click:hours')
  currentHour.value = hour
  const clickedLast = currentMinute.value !== null && (currentSecond.value !== null || !props.showSeconds)
  if (clickedLast) {
    setValue()
  }
}

function setMinute(minute) {
  emit('click:minutes')
  currentMinute.value = minute
  const clickedLast = currentHour.value !== null && (currentSecond.value !== null || !props.showSeconds)
  if (clickedLast) {
    setValue()
  }
}

function setSecond(second) {
  emit('click:seconds')
  currentSecond.value = second
  const clickedLast = currentHour.value !== null && currentMinute.value !== null
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
  currentHour.value = null
  currentMinute.value = null
  currentSecond.value = null
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
