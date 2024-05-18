export enum PatientStatus {
  WAITING = 'EN OBSERVACION',
  DISCHARGED = 'ALTA',
  ADMITTED = 'INTERNADO',
  WAITING_FOR_ADMISSION = 'EN ESPERA DE INTERNACION',
  AFUERA = 'AFUERA'
}

export interface Patient {
  patient_id: string
  patient_name: string
  patient_age: Date
  patient_entry_time: Date
  patient_exit_time: Date
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
  patient_exit_time: Date
  patient_triage_time: Date
  patient_triage_level: number
  patient_isolated: number
  box_id: string
  box_code: string
  patient_status: string
  patient_symptom: string
  doctor_name: string
  nurse_name: string
  patient_healthcare_system?:string
}

export type NullablePatient = Patient | null

export interface PartialPatient {
  patient_id?: string
  patient_name?: string
  patient_age?: Date
  patient_entry_time?: Date
  patient_exit_time?: Date
  patient_triage_time?: Date
  patient_triage_level?: number
  patient_isolated?: number
  box_id?: string
  box_code?: string
  patient_status?: string
  patient_symptom?: string
  doctor_name?: string
  nurse_name?: string
  patient_healthcare_system?:string
}

export interface PatientHistoryItem {
  updated_id: string
  patient_id?: string
  patient_updated_column: keyof Patient
  patient_old_value: string
  patient_new_value: string
  patient_updated_date: string
  user_id?: string
  user_name: string
}
