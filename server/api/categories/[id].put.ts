import { eq } from 'drizzle-orm'
import { CategoriesTable } from '~/server/db/schema'
import type { CategoryInsert } from '~/types'

export default defineEventHandler({
  onRequest: [checkUser],

  handler: async (event) => {
    const db = await getDrizzle()
    const body = await readBody<CategoryInsert>(event)

    const id = event.context.params?.id

    if (isNaN(Number(id))) {
      throw createError({
        message: 'Category ID is required!',
        statusCode: 402,
      })
    }

    const [result] = await db
      .update(CategoriesTable)
      .set(body)
      .where(eq(CategoriesTable.id, Number(id)))
      .returning({
        id: CategoriesTable.id,
        name: CategoriesTable.name,
      })

    if (!result) {
      throw createError({
        message: 'Category not found!',
        statusCode: 404,
      })
    }

    return { result }
  },
})
