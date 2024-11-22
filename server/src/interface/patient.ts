export enum PatientStatus {
  WAITING = 'EN OBSERVACION',
  DISCHARGED = 'ALTA',
  ADMITTED = 'INTERNADO',
  WAITING_FOR_ADMISSION = 'EN ESPERA DE INTERNACION',
  AFUERA = 'AFUERA'
}

export interface Patient {
  patient_id: string;
  patient_name: string;
  patient_age: string;
  patient_entry_time: string;
  patient_exit_time: string | null;
  patient_triage_time: string;
  patient_triage_level: number | null;
  patient_isolated: boolean;
  box_id: string | null;
  box_code?: string;
  patient_status: string;
  patient_symptom: string;
  doctor_id: string;
  nurse_id: string;
  doctor_name?: string;
  nurse_name?: string;
}

export interface PatientHistoryItem {
  updated_id: string;
  patient_id?: string;
  patient_updated_column: keyof Patient;
  patient_old_value: string;
  patient_new_value: string;
  patient_updated_date: Date;
  user_id?: string;
  user_name?: string;
}


export interface PatientShiftChange {
  patientID: string;
  role: string;
  lastDoctorID: string;
  newDoctorID: string;
  lastNurseID: string;
  newNurseID: string;
}

export interface ReportShiftChange{
  patient_id:string

}