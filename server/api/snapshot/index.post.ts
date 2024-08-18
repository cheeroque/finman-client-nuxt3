import { RevisesTable } from '~/server/db/schema'
import type { SnapshotInsert } from '~/types'

export default defineEventHandler({
  onRequest: [checkUser],

  handler: async (event) => {
    const { db } = event.context
    const body = await readBody<SnapshotInsert>(event)

    const [result] = await db.insert(RevisesTable).values(body).returning({ id: RevisesTable.id })

    return { result }
  },
})
