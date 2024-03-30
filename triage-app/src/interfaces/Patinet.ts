export enum PatientStatus {
  WAITING = 'EN ESPERA',
  DISCHARGED = 'ALTA',
  ADMITTED = 'INTERNADO',
  WAITING_FOR_ADMISSION = 'EN ESPERA DE INTERNACION',
  AFUERA = 'AFUERA',
  EN_AISLAMIENTO = 'EN AISLAMIENTO'
}

export interface Patient {
  patient_id: string
  patient_name: string
  patient_age: Date
  patient_entry_time: Date
  patient_exit_time: Date | null
  patient_triage_time: Date
  patient_triage_level: number
  patient_isolated: number
  box_id: string
  box_code: string
  patient_status: string
  patient_symptom: string
  doctor_name: string
  nurse_name: string
  [Symbol.iterator](): IterableIterator<Patient>
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any // Add this line
}

export interface PatientData {
  patient_id: string
  patient_name: string
  patient_age: Date
  patient_entry_time: Date
  patient_exit_time: Date | null
  patient_triage_time: Date
  patient_triage_level: number
  patient_isolated: number
  box_id: string
  box_code: string
  patient_status: string
  patient_symptom: string
  doctor_name: string
  nurse_name: string
}

export type NullablePatient = Patient | null

export interface PartialPatient {
  patient_id?: string
  patient_name?: string
  patient_age?: Date
  patient_entry_time?: Date
  patient_exit_time?: Date | null
  patient_triage_time?: Date
  patient_triage_level?: number
  patient_isolated?: number
  box_id?: string
  box_code?: string
  patient_status?: string
  patient_symptom?: string
  doctor_name?: string
  nurse_name?: string
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
