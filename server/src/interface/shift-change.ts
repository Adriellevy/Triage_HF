export interface ShiftChange {
    id: number;
    shift_id: number;
    last_doctor_id: string;
    new_doctor_id: string;
    last_nurse_id: string;
    new_nurse_id: string;
    shift_change_date: Date;
    patient_observations: string;
    patient_records: string;
    patient_procedures: string;
    patient_id: string;
}