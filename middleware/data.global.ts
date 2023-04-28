import { useAuthStore } from '~/store/auth'
import { useRecordsStore } from '~/store/records'

export default defineNuxtRouteMiddleware(async (to) => {
  /* Fetch data only on pages that are not public */
  if (!to.meta.isPublic) {
    const authStore = useAuthStore()
    const recordsStore = useRecordsStore()

    if (authStore.user) {
      await Promise.all([
        recordsStore.fetchBalance(),
        recordsStore.fetchCategories(),
        recordsStore.fetchFirstRecord(),
        recordsStore.fetchMonthRecords(),
        recordsStore.fetchSnapshot(),
      ])
    }
  }
})
