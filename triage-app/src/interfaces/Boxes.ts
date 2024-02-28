export enum BoxType {
  CONSULTORIO = 'CONSULTORIO',
  BED = 'CAMA',
  HOSPITALIZATION = 'INTERNACION'
}

export enum BoxStatus {
  LIBRE = 'LIBRE',
  OCUPADO = 'OCUPADO'
}

export interface Box {
  box_id: string
  box_code: string
  box_type: BoxType
  box_time: string
  box_status: BoxStatus
  patient_id?: string
  patient_name?: string
}

export type NullableBox = Box | null
