import { CategoriesTable } from '~/server/db/schema'
import type { CategoryInsert } from '~/types'

export default defineEventHandler({
  onRequest: [checkUser],

  handler: async (event) => {
    const { db } = event.context
    const body = await readBody<CategoryInsert>(event)

    const [result] = await db.insert(CategoriesTable).values(body).returning({
      id: CategoriesTable.id,
      name: CategoriesTable.name,
    })

    return { result }
  },
})
