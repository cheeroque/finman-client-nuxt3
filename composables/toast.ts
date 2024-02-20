import type { ToastState } from '~/types'

const DEFAULT_STATE = {
  autohide: 5000,
  message: undefined,
  modelValue: false,
  title: undefined,
  variant: 'success',
}

export function useShowToast(state: Omit<ToastState, 'modelValue'>) {
  const toast = useToast()

  toast.value = { ...Object.assign(DEFAULT_STATE, state) }
  toast.value.modelValue = true
}

export const useToast = () => useState<ToastState>('toast', () => DEFAULT_STATE)
