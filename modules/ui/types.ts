export type UiGridBreakpoint = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl'
export type UiPropertyValue = number | string | null

export type UiUtilityDefinition = {
  property: string | string[]
  responsive?: boolean
  values: (UiPropertyValue | Record<string, UiPropertyValue>)[]
}

export type UiThemeColor = 'primary' | 'secondary' | 'tertiary' | 'neutral' | 'neutral-variant' | 'danger' | 'success'

export type UiModuleOptions = {
  grid: {
    breakpoints: Partial<Record<UiGridBreakpoint, UiPropertyValue>> & Record<string, UiPropertyValue>
    containerWidths: Partial<Record<UiGridBreakpoint, UiPropertyValue>> & Record<string, UiPropertyValue>
    gap: UiPropertyValue
  }
  theme: {
    colors: Partial<Record<UiThemeColor, string>>
  }
  utilities: Record<string, UiUtilityDefinition | false>
}
