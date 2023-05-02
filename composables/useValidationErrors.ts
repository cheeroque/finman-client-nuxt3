export function useValidationErrors(vuelidateInstance: any, field: string): string {
  return vuelidateInstance?.[field]?.$errors?.map(({ $message }: { $message: string }) => $message).join(' ')
}
