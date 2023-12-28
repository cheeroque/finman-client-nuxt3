<template>
  <div>
    <ChartPie :data="data" :options="options" />
  </div>
</template>

<script setup lang="ts">
import { DateTime } from 'luxon'

import type { PieChartData } from 'chartist'

interface MonthChartProps {
  data: PieChartData
}

const props = defineProps<MonthChartProps>()

const options = { chartPadding: 0, labelInterpolationFnc: formatLabel }

function formatDate(timestamp: number, format = 'LL.yy'): string {
  return DateTime.fromMillis(timestamp).toFormat(format, { locale: useLocale() })
}

function formatLabel(value: number, index: number) {
  return `${value}`
}
</script>
