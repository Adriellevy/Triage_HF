export enum BoxType {
  CONSULTORIO = 'CONSULTORIO',
  BED = 'CAMA',
  HOSPITALIZATION = 'INTERNACION'
}

export interface Box {
  box_id: string
  box_type: BoxType
}

export type NullableBox = Box | null
