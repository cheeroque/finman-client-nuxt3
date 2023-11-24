/* Get an array of records, then return array of all the categories
 * with total sum of their records */

import type { RecordsCategory, RecordsItem } from '~/types/records'

interface CategoryWithTotal {
  category: RecordsCategory
  total: number
}

export const useCategoriesSubtotal = (records?: RecordsItem[]): CategoryWithTotal[] => {
  const categories: CategoryWithTotal[] = []

  records?.forEach((record: RecordsItem) => {
    const categoryIndex = Number(record.category?.id)

    if (categories[categoryIndex]) {
      categories[categoryIndex].total += record.sum
    } else {
      categories[categoryIndex] = {
        category: record.category,
        total: record.sum ?? 0,
      }
    }
  })

  return categories.filter(Boolean)
}
