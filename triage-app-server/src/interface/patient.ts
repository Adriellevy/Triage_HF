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
  patient_age: Date;
  patient_entry_time: Date;
  patient_exit_time: Date;
  patient_triage_time: Date;
  patient_triage_level: number;
  patient_isolated: number;
  box_id: string;
  box_code: string;
  patient_status: string;
  patient_symptom: string;
  doctor_name: string;
  nurse_name: string;
}
