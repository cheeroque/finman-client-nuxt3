<template>
  <SidebarWidget :title="useString('thisMonth')" class="sidebar-widget-monthly">
    <p v-if="isEmpty" class="text-center text-neutral mb-0">
      {{ useString('tableEmpty') }}
    </p>

    <ul class="list-unstyled">
      <li
        v-for="(group, index) in visibleCategories"
        :key="`group-${group.category?.id}`"
        :class="{ 'mt-8': index > 0 }"
        role="presentation"
      >
        <SidebarMonthlyCategory :category="group.category" :max-total="maxTotal" :total="group.subtotal" />
      </li>
    </ul>

    <UiCollapse v-if="hasCollapse" v-model="collapseOpen">
      <ul class="list-unstyled pt-8">
        <li
          v-for="(group, index) in hiddenCategories"
          :key="`group-hidden-${index}`"
          :class="{ 'mt-8': index > 0 }"
          role="presentation"
        >
          <SidebarMonthlyCategory :category="group.category" :max-total="maxTotal" :total="group.subtotal" />
        </li>
      </ul>
    </UiCollapse>

    <UiButton
      v-if="hasCollapse"
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

const refetchTrigger = useRefetchTrigger()

const collapseOpen = ref(false)

const now = DateTime.now()
const from = now.set({ hour: 0, minute: 0, second: 0, day: 1 })
const to = from.plus({ month: 1 }).minus({ second: 1 })

const query = {
  from: from.toFormat('yyyy-LL-dd HH:mm:ss'),
  to: to.toFormat('yyyy-LL-dd HH:mm:ss'),
}

const { data, refresh } = await useFetch('/api/month', { query, pick: ['tableItems'] })

const groups = computed(() =>
  data.value?.tableItems
    .filter((group) => !group.category?.is_income)
    .sort((a, b) => Number(b.subtotal) - Number(a.subtotal))
)

const visibleCategories = computed(() => groups.value?.slice(0, VISIBLE_LIMIT))
const hiddenCategories = computed(() => groups.value?.slice(VISIBLE_LIMIT))
const hasCollapse = computed(() => Boolean(hiddenCategories.value?.length))
const isEmpty = computed(() => !groups.value?.length)
const maxTotal = computed(() => groups.value?.[0].subtotal)

watch(
  /* Refetch records if external trigger was set to true, then reset trigger */

  () => refetchTrigger.value,

  async (event) => {
    if (event) {
      await refresh()
      refetchTrigger.value = false
    }
  }
)

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
