<template>
  <div>
    <ChartBar
      :data="data"
      :label-formatter="formatLabel"
      :options="options"
      :responsive-options="responsiveOptions"
      clickable
      @click:bar="handleClickBar"
    />
  </div>
</template>

<script setup lang="ts">
import { DateTime } from 'luxon'

import type { BarChartData, BarChartOptions, ResponsiveOptions } from 'chartist'

interface CategoryChartProps {
  data: BarChartData
}

const props = defineProps<CategoryChartProps>()

const emit = defineEmits(['click:bar'])

const options = { reverseData: true }
const responsiveOptions: ResponsiveOptions<BarChartOptions> = [
  [
    'screen and (max-width: 767.99998px)',
    {
      axisX: { offset: 0, showLabel: false },
      axisY: { labelInterpolationFnc: (label) => formatDate(Number(label)) },
      horizontalBars: true,
      reverseData: false,
    },
  ],
  [
    'screen and (min-width: 768px)',
    {
      axisX: { labelInterpolationFnc: (label) => formatDate(Number(label), 'LL.yyyy') },
      axisY: { offset: 0, showLabel: false },
    },
  ],
]

function formatDate(timestamp: number, format = 'LL.yy'): string {
  return DateTime.fromMillis(timestamp).toFormat(format, { locale: useLocale() })
}

function formatLabel(value?: number) {
  return `${useNumberFormat(value)} ₽`
}

function handleClickBar(event: SVGElement) {
  const group = event.dataset.group
  emit('click:bar', group)
}
</script>
