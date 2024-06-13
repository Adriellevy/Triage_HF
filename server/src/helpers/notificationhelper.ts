import { type Request } from 'express';
import { type Patient } from '../interface/patient';

enum SocketEvent {
  GLOBAL_NOTIFICATION = 'notification',
  UPDATE = 'update'
}

enum UpdateEvent {
  NEW_PATIENT = 'New patient',
  NEW_PATIENT_ASSIGNED = 'New patient assigned',
  BOX_UPDATE = 'Box Update',
  UPDATE_PATIENT = 'Updated patient'
}

export function SendNewPatientNotifications(
  req: Request,
  newpatient: Patient,
  userID: string
): void {
  const io = req.io;

  io?.emit(SocketEvent.UPDATE, {
    message: UpdateEvent.NEW_PATIENT
  });

  io?.emit(SocketEvent.UPDATE, {
    message: UpdateEvent.BOX_UPDATE
  });

  if (userID !== newpatient.doctor_id) {
    io?.emit(`${newpatient.doctor_id}`, {
      message: UpdateEvent.NEW_PATIENT_ASSIGNED,
      patient: {
        patient_name: newpatient.patient_name,
        patient_id: newpatient.patient_id
      }
    });
  }

  if (userID !== newpatient.nurse_id) {
    io?.emit(`${newpatient.nurse_id}`, {
      message: UpdateEvent.NEW_PATIENT_ASSIGNED,
      patient: {
        patient_name: newpatient.patient_name,
        patient_id: newpatient.patient_id
      }
    });
  }
}

export function SendUpdatePatientNotifications(
  req: Request,
  UpdatedPatient: Patient,
  userID: string
): void {
  const io = req.io;

  io?.emit(SocketEvent.UPDATE, {
    message: UpdateEvent.UPDATE_PATIENT
  });

  io?.emit(SocketEvent.UPDATE, {
    message: UpdateEvent.BOX_UPDATE
  });

  console.log(userID);
  console.log(UpdatedPatient.doctor_id);
  if (userID !== UpdatedPatient.doctor_id) {
    io?.emit(`${UpdatedPatient.doctor_id}`, {
      message: UpdateEvent.UPDATE_PATIENT,
      patient: {
        patient_name: UpdatedPatient.patient_name,
        patient_id: UpdatedPatient.patient_id
      }
    });
  }

  if (userID !== UpdatedPatient.nurse_id) {
    io?.emit(`${UpdatedPatient.nurse_id}`, {
      message: UpdateEvent.UPDATE_PATIENT,
      patient: {
        patient_name: UpdatedPatient.patient_name,
        patient_id: UpdatedPatient.patient_id
      }
    });
  }
}
