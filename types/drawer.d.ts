import { ConcreteComponent } from 'vue'

export interface DrawerAction {
  key: string
  component: ConcreteComponent | string
  handler?: Function
}

export interface DrawerPage {
  key: string
  link: string
}
