<template>
  <ChartWrapper>
    <div ref="chartEl" class="chart-container" />
  </ChartWrapper>
</template>

<script setup lang="ts">
import { BarChart, Svg } from 'chartist'

import type { BarChartData, BarChartOptions, BarDrawEvent, DrawEvent } from 'chartist'

interface ChartBarProps {
  barBorderRadius?: number | string
  barRatio?: number
  data: BarChartData
  labelFormatter?: (value?: number) => string
  options?: BarChartOptions
}

const props = withDefaults(defineProps<ChartBarProps>(), {
  barBorderRadius: '0.25rem',
  barRatio: 0.7,
})

const chartEl = ref()
const chartInstance = ref()

const barCount = computed(() => props.data?.labels?.length ?? 1)

onMounted(() => {
  if (chartEl.value instanceof HTMLElement) {
    chartInstance.value = new BarChart(chartEl.value, props.data, props.options)

    chartInstance.value.on('draw', (data: DrawEvent) => {
      if (isBarData(data)) {
        const rect = getBarRect(data)
        const label = getBarLabel(data)

        data.element.replace(rect)
        data.group.append(label)
      }
    })
  }
})

function getBarLabel(data: BarDrawEvent) {
  let value

  const x = data.x1 - getBarWidth(data) / 2
  const y = data.y2

  if (typeof data.value === 'number') {
    value = data.value
  } else if ('y' in data.value) {
    value = data.value.y
  }

  const textEl = new Svg('text', { x, y }, 'ct-bar-label')
  const text = typeof props.labelFormatter === 'function' ? props.labelFormatter(value) : String(value)

  textEl.text(text)

  return textEl
}

function getBarRect(data: BarDrawEvent) {
  const width = getBarWidth(data)
  const height = Math.abs(data.y1 - data.y2)

  const x = data.x1 - width / 2
  const y = data.y2

  const rx = props.barBorderRadius

  return new Svg('rect', { x, y, width, height, rx, 'data-variant': 'primary' }, 'ct-bar')
}

function getBarWidth(data: BarDrawEvent) {
  const chartWidth = data.chartRect.width()

  return Math.floor((chartWidth * props.barRatio * 0.5) / barCount.value) * 2
}

function isBarData(data: DrawEvent): data is BarDrawEvent {
  return data.type === 'bar'
}
</script>
