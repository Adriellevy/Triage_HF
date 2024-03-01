export enum PatientStatus {
  WAITING = 'EN ESPERA',
  DISCHARGED = 'ALTA',
  ADMITTED = 'INTERNADO',
  WAITING_FOR_ADMISSION = 'EN ESPERA DE INTERNACION',
  AFUERA = 'AFUERA',
  EN_AISLAMIENTO = 'EN AISLAMIENTO'
}

export interface Patient {
  patient_name: string
  patient_id: string
  date_of_birth: string
  entry_time: string
  exit_time: string
  patient_triage_level: number
  patient_triage_time: string
  patient_medication: string
  patient_problem: string
  box_id: string
  box_code: string
  doctor_name: string
  nurse_name: string
  patient_status: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [Symbol.iterator](): IterableIterator<Patient>
}

export interface PatientData {
  patient_name: string
  patient_id: string
  date_of_birth: string
  entry_time: string
  patient_triage_level: number
  patient_medication: string
  patient_problem: string
  box_id: string
  box_code: string
  doctor_name: string
  nurse_name: string
  patient_status: string
}

export type NullablePatient = Patient | null

export interface PartialPatient {
  patient_name?: string
  patient_id?: string
  date_of_birth?: string
  entry_time?: string
  patient_triage_level?: string
  patient_medication?: string
  patient_problem?: string
  box_id?: string
  doctor_name?: string
  nurse_name?: string
  patient_status?: string
}

export interface PatientHistoryItem {
  update_id: string
  patient_id?: string
  updated_column: keyof Patient
  old_value: string
  new_value: string
  update_date: string
  user_id?: string
  user_name: string
}
