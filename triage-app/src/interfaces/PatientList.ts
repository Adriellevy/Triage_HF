export interface ColourOption {
    readonly value: string
    readonly label: string
    readonly item?: string
    readonly color: string
    readonly isFixed?: boolean
    readonly isDisabled?: boolean
  }
  
  export interface Option {
    readonly label: string
    readonly options: ColourOption[]
  }