export default defineEventHandler({
  onRequest: [checkUser],

  handler: async () => {
    const db = await getDrizzle()

    const snapshot = await db.query.RevisesTable.findFirst({
      orderBy: (snapshots, { desc }) => desc(snapshots.createdAt),
    })

    return { snapshot }
  },
})
