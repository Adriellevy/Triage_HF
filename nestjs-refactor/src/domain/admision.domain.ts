import { AdmisionDoctorProcedureEntity } from "src/entities/admision-doctor-procedure.entity";
import { AdmisionStudyEntity } from "src/entities/admision-study.entity";
import { AdmisionSymptomEntity } from "src/entities/admision-symptom.entity";
import { AdmisionEntity } from "src/entities/admision.entity";

export class AdmisionOutputDTO{
    id:number;
    id_patient:number;
    id_doctor:number;
    id_nurse:number;
    id_box:number;
    entry_time:Date;
    departure_time:Date;
    nurse_comment:string;
    warning:string;
    admisionStudies:AdmisionStudyOutputDTO[];
    admisionSymptoms:AdmisionSymptomOutputDTO[];
    admisionDoctorProcedures:AdmisionDoctorProcedureOutputDTO[];

    constructor(admision:AdmisionEntity){
        this.id = admision.id;
        this.id_patient = admision.id_patient;
        this.id_doctor = admision.id_doctor;
        this.id_nurse = admision.id_nurse;
        this.id_box = admision.id_box;
        this.entry_time = admision.entry_time;
        this.departure_time = admision.departure_time;
        this.nurse_comment = admision.nurse_comment;
        this.warning = admision.warning;
        this.admisionStudies = admision.admisionStudies.map(a=> new AdmisionStudyOutputDTO(a));
        this.admisionSymptoms = admision.admisionSymptoms.map(a=> new AdmisionSymptomOutputDTO(a));
        this.admisionDoctorProcedures = admision.admisionDoctorProcedures.map(a=> new AdmisionDoctorProcedureOutputDTO(a));
    }
}

export class AdmisionStudyOutputDTO{
    id:number;
    id_admision:number;
    id_study:number;
    id_user:number;
    status:string;

    constructor(admision:AdmisionStudyEntity){
        this.id = admision.id;
        this.id_admision = admision.id_admision;
        this.id_study = admision.id_study;
        this.id_user = admision.id_user;
        this.status = admision.status;
    }
}

export class AdmisionSymptomOutputDTO{
    id:number;
    id_admision:number;
    id_symptom:number;
    id_user:number;
    status:string;

    constructor(admision:AdmisionSymptomEntity){
        this.id = admision.id;
        this.id_admision = admision.id_admision;
        this.id_symptom = admision.id_symptom;
        this.id_user = admision.id_user;
        this.status = admision.status;
    }
}

export class AdmisionDoctorProcedureOutputDTO{
    id:number;
    id_admision:number;
    id_doctor_procedure:number;
    id_user:number;
    id_doctor:number;
    status:string;

    constructor(admision:AdmisionDoctorProcedureEntity){
        this.id = admision.id;
        this.id_admision = admision.id_admision;
        this.id_doctor_procedure = admision.id_doctor_procedure;
        this.id_user = admision.id_user;
        this.id_doctor = admision.id_doctor;
        this.status = admision.status;
    }
}