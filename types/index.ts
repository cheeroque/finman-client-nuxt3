export {}

declare global {
  type ControlSize = 'md' | 'lg' | null
  type ControlState = boolean | null

  type DialogSize = 'sm' | 'md' | 'lg' | null

  type DrawerAction = {
    key: string
    component: string
  }

  type DrawerPage = {
    key: string
    link: string
  }
}
