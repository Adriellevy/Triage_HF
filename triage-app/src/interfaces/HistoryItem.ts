export interface PropsPatientHystoryItem {
    item: PatientHistoryItemType
    index: number
  }
  
 export interface Field {
    label: string
    key: keyof PatientData
    format: ((value: string) => string | Promise<string | null>) | null
  }