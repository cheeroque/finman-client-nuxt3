import type { FieldContext } from 'vee-validate'

export function useFieldState(field: FieldContext) {
  if (!field.errors.value.length) return
  return false
}
