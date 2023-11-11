<template>
  <nav class="pagination-nav">
    <ul class="pagination">
      <li v-if="!hideFirstLast" class="pagination-item pagination-item-first" role="presentation">
        <UiButton
          :disabled="isBeginning"
          :to="getLink(1)"
          icon="chevron-double-left-24"
          icon-size="24"
          class="pagination-link"
          @click="handleClickFirst"
        />
      </li>

      <li v-if="!hidePrevNext" class="pagination-item pagination-item-previous" role="presentation">
        <UiButton
          :disabled="isBeginning"
          :to="getLink('previous')"
          icon="chevron-left-24"
          icon-size="24"
          class="pagination-link"
          @click="handleClickPrevious"
        />
      </li>

      <li v-for="page in pages" :key="`page-${page}`" class="pagination-item" role="presentation">
        <UiButton
          :to="getLink(page)"
          :class="{ active: page === currentPage }"
          class="pagination-link"
          @click="handleClickPage(page)"
        >
          {{ page }}
        </UiButton>
      </li>

      <li v-if="!hidePrevNext" class="pagination-item pagination-item-next" role="presentation">
        <UiButton
          :disabled="isEnd"
          :to="getLink('next')"
          icon="chevron-right-24"
          icon-size="24"
          class="pagination-link"
          @click="handleClickNext"
        />
      </li>

      <li v-if="!hideFirstLast" class="pagination-item pagination-item-last" role="presentation">
        <UiButton
          :to="getLink(totalPages)"
          :disabled="isEnd"
          icon="chevron-double-right-24"
          icon-size="24"
          class="pagination-link"
          @click="handleClickLast"
        />
      </li>
    </ul>
  </nav>
</template>

<script setup lang="ts">
import type { RouteLocationRaw } from 'vue-router'

const props = defineProps<{
  disabled?: boolean
  hideFirstLast?: boolean
  hidePrevNext?: boolean
  limit?: number | string
  modelValue?: number | string
  noLinks?: boolean
  size?: string
  totalPages?: number | string
}>()

const emit = defineEmits(['update:modelValue'])

const currentPage = computed(() => {
  const route = useRoute()
  const routePage = Number(route.query.page || 1)

  return Number(props.modelValue ?? routePage ?? 1)
})

const limit = computed(() => Number(props.limit ?? 5))

const totalPages = computed(() => Number(props.totalPages ?? 1))

const isBeginning = computed(() => currentPage.value <= 1)

const isEnd = computed(() => currentPage.value >= totalPages.value)

const pages = computed(() => {
  const pages = []

  let start = 1
  let end = Math.min(limit.value, totalPages.value)

  if (totalPages.value > limit.value) {
    const beforeCount = Math.floor((limit.value - 1) / 2)
    start = currentPage.value > beforeCount + 1 ? currentPage.value - beforeCount : 1
    end = start + limit.value - 1
    if (end > totalPages.value) {
      const shift = end - totalPages.value
      end -= shift
      start -= shift
    }
  }

  for (let i = start; i <= end; i++) {
    pages.push(i)
  }

  return pages
})

function getLink(page: number | string): RouteLocationRaw | undefined {
  if (props.noLinks) return

  let newPage = page

  if (newPage === 'next') {
    newPage = Math.min(currentPage.value + 1, totalPages.value)
  } else if (newPage === 'previous') {
    newPage = Math.max(currentPage.value - 1, 1)
  }

  const route = useRoute()
  const query = { ...route.query }

  if (Number(newPage) > 1) {
    query.page = `${newPage}`
  } else {
    delete query.page
  }

  return { query }
}

function handleClickPage(event: number) {
  emit('update:modelValue', event)
}

function handleClickFirst() {
  emit('update:modelValue', 1)
}

function handleClickPrevious() {
  if (currentPage.value > 1) {
    emit('update:modelValue', currentPage.value - 1)
  }
}

function handleClickNext() {
  if (currentPage.value < totalPages.value) {
    emit('update:modelValue', currentPage.value + 1)
  }
}

function handleClickLast() {
  emit('update:modelValue', totalPages.value)
}
</script>
