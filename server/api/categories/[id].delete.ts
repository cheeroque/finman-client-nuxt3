import { eq } from 'drizzle-orm'
import { CategoriesTable } from '~/server/db/schema'

export default defineEventHandler({
  onRequest: [checkUser],

  handler: async (event) => {
    const db = await getDrizzle()

    const id = event.context.params?.id

    if (isNaN(Number(id))) {
      throw createError({
        message: 'Category ID is required!',
        statusCode: 402,
      })
    }

    const [result] = await db
      .delete(CategoriesTable)
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
