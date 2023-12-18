<template>
  <ChartWrapper>
    <div ref="chart" :style="{ '--ct-bar-width': barWidth }" class="chart-container" />
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
const barWidth = ref('3rem')

onMounted(() => {
  if (chart.value instanceof HTMLElement) {
    new BarChart(chart.value, props.data, props.options)
  }

  handleResize()

  window.addEventListener('resize', handleResize, { passive: true })
})

function handleResize() {
  if (chart.value instanceof HTMLElement) {
    const gridEl = chart.value.querySelector('.ct-grids')
    const boundary = gridEl ?? chart.value

    const { width } = boundary.getBoundingClientRect()

    const barCount = Number(props.data?.labels?.length) || 1

    barWidth.value = `${Math.floor((width * 0.7) / barCount)}px`
  }
}
</script>
