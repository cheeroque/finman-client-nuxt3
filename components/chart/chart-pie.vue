<template>
  <ChartWrapper>
    <div ref="chartEl" class="chart-container" />
  </ChartWrapper>
</template>

<script setup lang="ts">
import { PieChart } from 'chartist'

import type { DrawEvent, PieChartData, PieChartOptions, ResponsiveOptions } from 'chartist'

export interface ChartPieProps {
  data: PieChartData
  options?: PieChartOptions
  responsiveOptions?: ResponsiveOptions<PieChartOptions>
}

const props = defineProps<ChartPieProps>()

const chartEl = ref()
const chartInstance = ref()

/* Force chart update when data changes */

watch(
  () => props.data,
  (event) => {
    if (event && typeof chartInstance.value?.update === 'function') {
      chartInstance.value.update(event)
    }
  }
)

onMounted(() => {
  if (chartEl.value instanceof HTMLElement) {
    chartInstance.value = new PieChart(chartEl.value, props.data, props.options, props.responsiveOptions)

    chartInstance.value.on('draw', (data: DrawEvent) => {
      console.log(data)
    })
  }
})
</script>
