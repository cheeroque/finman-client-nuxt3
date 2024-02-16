import type { FieldContext } from 'vee-validate'

export function useFieldErrorMessage(field: FieldContext) {
  if (!field.errors.value.length) return
  return field.errors.value.join(' ')
}
