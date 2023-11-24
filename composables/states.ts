export const useBalance = () => useState('balance', () => 0)

export const useRefetchTrigger = () => useState('refetch-trigger', () => false)

export const useToast = () =>
  useState('toast', () => ({
    autohide: 5000,
    message: '',
    modelValue: false,
    title: '',
    variant: 'success',
  }))
