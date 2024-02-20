import type { ToastState } from '~/types'

const defaultState = () => ({
  autohide: 5000,
  message: undefined,
  modelValue: false,
  title: undefined,
  variant: 'success',
})

export function useHideToast() {
  const toast = useToast()
  const { autohide, message, title, variant } = defaultState()

  toast.value = { autohide, message, title, variant }
  toast.value.modelValue = false
}

export function useShowToast(state: Omit<ToastState, 'modelValue'>) {
  const toast = useToast()

  toast.value = { ...Object.assign(defaultState(), state) }
  toast.value.modelValue = true
}

export const useToast = () => useState<ToastState>('toast', () => defaultState())
