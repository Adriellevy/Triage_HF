import { IHistory } from "../models/mysql/historyModel";

export interface History{
    updated_id: string;
    patient_updated_column: string;
    patient_old_value: string;
    patient_new_value: string;
    patient_updated_date: Date;
    patient_id: string;
    user_id: string;
}

export interface ReportHistoryPerPatient{
    patient_id: string;
    patient_name: string;
    history: IHistory[];
}