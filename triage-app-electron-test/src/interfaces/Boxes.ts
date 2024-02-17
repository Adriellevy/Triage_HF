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
  box_type: BoxType
  box_status: BoxStatus
}

export type NullableBox = Box | null
