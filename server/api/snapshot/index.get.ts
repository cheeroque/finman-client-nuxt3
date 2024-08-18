export default defineEventHandler({
  onRequest: [checkUser],

  handler: async (event) => {
    const { db } = event.context

    const snapshot = await db.query.RevisesTable.findFirst({
      orderBy: (snapshots, { desc }) => desc(snapshots.createdAt),
    })

    return { snapshot }
  },
})
