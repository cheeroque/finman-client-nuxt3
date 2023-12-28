<template>
  <ChartWrapper>
    <div ref="chartEl" :class="{ 'chart-container-clickable': clickable }" class="chart-container" />
  </ChartWrapper>
</template>

<script setup lang="ts">
import { BarChart, Svg } from 'chartist'

import type { BarChartData, BarChartOptions, BarDrawEvent, DrawEvent, ResponsiveOptions } from 'chartist'

export interface ChartBarProps {
  barBorderRadius?: number | string
  barRatio?: number
  clickable?: boolean
  data: BarChartData
  labelFormatter?: (value?: number) => string
  options?: BarChartOptions
  responsiveOptions?: ResponsiveOptions<BarChartOptions>
}

const props = withDefaults(defineProps<ChartBarProps>(), {
  barBorderRadius: '0.25rem',
  barRatio: 0.7,
})

const emit = defineEmits(['click:bar'])

const chartEl = ref()
const chartInstance = ref()

const barCount = computed(() => props.data?.labels?.length ?? 1)

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
    chartInstance.value = new BarChart(chartEl.value, props.data, props.options, props.responsiveOptions)

    chartInstance.value.on('draw', (data: DrawEvent) => {
      if (isBarData(data)) {
        const { label, rect } = getBarElements(data)

        data.element.replace(rect)
        data.group.append(label)
      }
    })

    chartEl.value.addEventListener('click', handleChartClick)
  }
})

onBeforeUnmount(() => {
  if (chartEl.value instanceof HTMLElement) {
    chartEl.value.removeEventListener('click', handleChartClick)
  }
})

function getBarElements(data: BarDrawEvent) {
  const isHorizontal = isHorizontalBars()

  const chartHeight = data.chartRect.height()
  const chartWidth = data.chartRect.width()

  const barSizeBase = isHorizontal ? chartHeight : chartWidth
  const barSize = Math.floor((barSizeBase * props.barRatio * 0.5) / barCount.value) * 2

  /* Bar rect SVG element */

  const rectX = isHorizontal ? data.x1 : data.x1 - barSize / 2
  const rectY = isHorizontal ? data.y2 - barSize / 2 : data.y2
  const rectWidth = isHorizontal ? Math.abs(data.x1 - data.x2) : barSize
  const rectHeight = isHorizontal ? barSize : Math.abs(data.y1 - data.y2)

  const dataGroup = data.meta.group

  const rectAttributes = {
    x: rectX,
    y: rectY,
    width: rectWidth,
    height: rectHeight,
    rx: props.barBorderRadius,
    'data-group': dataGroup,
  }

  const rect = new Svg('rect', rectAttributes, 'ct-bar')

  /* Bar label text SVG element */

  const labelX = isHorizontal ? rectX + rectWidth + 8 : rectX
  const labelY = isHorizontal ? rectY + rectHeight / 2 : rectY - 8

  const labelAttributes = {
    x: labelX,
    y: labelY,
  }

  const label = new Svg('text', labelAttributes, 'ct-bar-label')

  const dataValue = data.value as { x?: number; y?: number }
  const labelValue = isHorizontal ? dataValue.x : dataValue.y

  const caption = typeof props.labelFormatter === 'function' ? props.labelFormatter(labelValue) : String(labelValue)

  label.text(caption)

  return { label, rect }
}

function handleChartClick(event: MouseEvent) {
  const target = event.target

  if (target instanceof SVGElement) {
    if (target.classList.contains('ct-bar')) {
      emit('click:bar', target)
    }
  }
}

function isBarData(data: DrawEvent): data is BarDrawEvent {
  return data.type === 'bar'
}

function isHorizontalBars() {
  let result = false

  if (chartEl.value instanceof HTMLElement) {
    const chartSvg = chartEl.value.querySelector('.ct-chart-bar')
    result = Boolean(chartSvg?.classList.contains('ct-horizontal-bars'))
  }

  return result
}
</script>

<style lang="scss" scoped>
.chart-container-clickable {
  :deep(.ct-bar) {
    cursor: pointer;
  }
}

@include media-max-width(md) {
  :deep(.ct-bar-label) {
    font-size: 0.8125rem;
    transform: translateY(0.4em);
  }
}
</style>
