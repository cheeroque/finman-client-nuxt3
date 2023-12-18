<template>
  <ChartWrapper>
    <div ref="chart" class="chart-container" />
  </ChartWrapper>
</template>

<script setup lang="ts">
import { BarChart } from 'chartist'

import type { BarChartData, BarChartOptions } from 'chartist'

interface ChartBarProps {
  data: BarChartData
  options?: BarChartOptions
}

const props = defineProps<ChartBarProps>()

const chart = ref()

onMounted(() => {
  if (chart.value instanceof HTMLElement) {
    new BarChart(chart.value, props.data, props.options)
  }
})
</script>
