export {}

declare global {
  interface TextInputEvent extends InputEvent {
    target: TextInputEventTarget
  }
  interface TextInputFocusEvent extends FocusEvent {
    target: TextInputEventTarget
  }

  interface TextInputEventTarget extends EventTarget {
    value: string
  }

  type ControlSize = 'md' | 'lg' | null

  type DialogSize = 'sm' | 'md' | 'lg' | null
}
