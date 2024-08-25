export enum BoxType {
  CONSULTORIO = 'CONSULTORIO',
  SHOOCKROOM = 'SHOCK ROOM',
  HOSPITALIZATION = 'INTERNACION',
  OBSERVACION = 'OBSERVACION'
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
  userAdded?: string
  [Symbol.iterator](): IterableIterator<Box>
}
export interface PartialBox {
  box_id?: string
  box_code: string
  box_type: BoxType
  box_time?: string
  box_status?: BoxStatus
  patient_id?: string
  patient_name?: string
  [Symbol.iterator](): IterableIterator<Box>
}
export type NullableBox = Box | null
