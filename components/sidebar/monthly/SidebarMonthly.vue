<template>
  <SidebarWidget :title="useString('thisMonth')" class="sidebar-widget-monthly">
    <p v-if="!data?.visibleCategories.length" class="text-center text-neutral mb-0">
      {{ useString('tableEmpty') }}
    </p>

    <ul v-if="data" class="list-unstyled">
      <li
        v-for="(group, index) in data.visibleCategories"
        :key="`group-${group.group}`"
        :class="{ 'mt-8': index > 0 }"
        role="presentation"
      >
        <SidebarMonthlyCategory
          :color="group.color"
          :max-total="data.maxTotal"
          :name="group.group"
          :slug="group.slug"
          :total="Number(group.subtotal)"
        />
      </li>
    </ul>

    <UiCollapse v-if="data?.hasCollapse" v-model="collapseOpen">
      <ul class="list-unstyled pt-8">
        <li
          v-for="(group, index) in data.hiddenCategories"
          :key="`group-hidden-${group.group}`"
          :class="{ 'mt-8': index > 0 }"
          role="presentation"
        >
          <SidebarMonthlyCategory
            :color="group.color"
            :max-total="data.maxTotal"
            :name="group.group"
            :slug="group.slug"
            :total="Number(group.subtotal)"
          />
        </li>
      </ul>
    </UiCollapse>

    <UiButton
      v-if="data?.hasCollapse"
      :class="{ expanded: collapseOpen }"
      :title="useString(collapseOpen ? 'collapse' : 'expand')"
      class="collapse-toggle"
      icon="caret"
      icon-size="10"
      variant="primary-muted"
      no-text
      @click="toggleCollapse"
    />
  </SidebarWidget>
</template>

<script setup lang="ts">
import { DateTime } from 'luxon'

const VISIBLE_LIMIT = 5

const { data, refresh } = await useAsyncData('sidebar-monthly', async () => {
  const period = DateTime.now().toFormat('yyyy-LL')
  const { transactions } = await useRequestFetch()(`/api/transactions/period/${period}`)

  const expenses = transactions.filter(({ isIncome }) => !isIncome)
  const visibleCategories = expenses.slice(0, VISIBLE_LIMIT)
  const hiddenCategories = expenses.slice(VISIBLE_LIMIT)
  const maxTotal = Number(expenses[0].subtotal) || 0

  return {
    hasCollapse: Boolean(hiddenCategories.length),
    hiddenCategories,
    maxTotal,
    visibleCategories,
  }
})

/* Refetch records if external trigger was set to true, then reset trigger */
const globalStore = useGlobalStore()
const { refreshTrigger } = storeToRefs(globalStore)

watch(
  () => refreshTrigger.value,

  async (event) => {
    if (event) {
      await refresh()
      refreshTrigger.value = false
    }
  }
)

const collapseOpen = ref(false)

function toggleCollapse() {
  collapseOpen.value = !collapseOpen.value
}
</script>

<style lang="scss" scoped>
.sidebar-widget-monthly {
  position: relative;

  .collapse-toggle {
    position: absolute;
    right: $card-padding-x;
    bottom: $card-padding-y;
    border-radius: 99rem;

    :deep(.nuxt-icon) {
      transform: rotate(0);
      transition: $transition;
      transition-property: transform;
    }

    &.expanded {
      :deep(.nuxt-icon) {
        transform: rotate(-180deg);
      }
    }
  }
}
</style>
