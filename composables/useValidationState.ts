export function useValidationState(vuelidateInstance: any, field: string): boolean | null {
  return vuelidateInstance?.[field]?.$error ? false : null
}
