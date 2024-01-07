export interface Patient {
  patient_name: string
  patient_id: string
  date_of_birth: string
  entry_time: string
  patient_triage_level: string
  patient_medication: string
  patient_problem: string
  box_id: string
  doctor_name: string
  nurse_name: string
  patient_status: string
}
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
