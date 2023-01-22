import { useRecordsStore } from '~/store/records'

export default defineNuxtRouteMiddleware(async (to) => {
  /* Skip middleware on page with isPublic flag (i.e. login page) */
  if (!to.meta.isPublic) {
    const { $auth } = useNuxtApp()
    const recordsStore = useRecordsStore()

    try {
      await Promise.all([
        recordsStore.fetchBalance(),
        recordsStore.fetchCategories(),
        recordsStore.fetchFirstRecord(),
        recordsStore.fetchMonthRecords(),
        recordsStore.fetchSnapshot(),
      ])
    } catch (error) {
      $auth.logout()
    }
  }
})
