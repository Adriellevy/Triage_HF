import { type Request } from 'express';
import { type Patient } from '../interface/patient';
import { type Box } from '../interface/box';
import { type User } from '../interface/user';

enum SocketEvent {
  GLOBAL_NOTIFICATION = 'notification',
  UPDATE = 'update'
}

enum UpdateEvent {
  NEW_PATIENT = 'New patient',
  NEW_PATIENT_ASSIGNED = 'New patient assigned',
  BOX_UPDATE = 'Box Update',
  UPDATE_PATIENT = 'Updated patient',
  BOX_MODIFICATION_UPDATE = 'Box modification Update',
  NEW_BOX = 'New Box',
  USER_UPDATE = 'User Update',
  REFRESH_TOKEN_EXPIRED = 'Refresh Token expired',
  TOKEN_EXPIRED = 'Token expired'
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

  io?.emit(`${UpdatedPatient.patient_id}`, {
    message: UpdateEvent.UPDATE_PATIENT,
    patient: {
      patient_name: UpdatedPatient.patient_name,
      patient_id: UpdatedPatient.patient_id
    }
  });
}

export function SendNewBoxNotifications(
  req: Request,
  newBox: Box,
  hospitalUsers: User[],
  usuarioMandoreq: string
): void {
  const io = req.io;

  // Notifica a todos los clientes que se ha creado un nuevo box
  io?.emit(SocketEvent.UPDATE, {
    message: UpdateEvent.BOX_UPDATE
  });

  hospitalUsers.forEach((user) => {
    io?.emit(`${user.user_id}`, {
      message: UpdateEvent.BOX_UPDATE,
      box: {
        box_id: newBox.box_id,
        box_code: newBox.box_code,
        box_type: newBox.box_type,
        box_status: newBox.box_status,
        userAdded: usuarioMandoreq
      }
    });
  });
}

export function SendUpdatedBoxNotifications(
  req: Request,
  newBox: Box,
  hospitalUsers: User[],
  usuarioMandoreq: string
): void {
  const io = req.io;

  // Notifica a todos los clientes que se ha creado un nuevo box
  io?.emit(SocketEvent.UPDATE, {
    message: UpdateEvent.BOX_UPDATE
  });

  hospitalUsers.forEach((user) => {
    io?.emit(`${user.user_id}`, {
      message: UpdateEvent.BOX_UPDATE,
      box: {
        box_id: newBox.box_id,
        box_code: newBox.box_code,
        box_type: newBox.box_type,
        box_status: newBox.box_status,
        userAdded: usuarioMandoreq
      }
    });
  });
}

export function SendDeletedBoxNotifications(
  req: Request,
  newBox: Box,
  hospitalUsers: User[],
  usuarioMandoreq: string
): void {
  const io = req.io;

  // Notifica a todos los clientes que se ha creado un nuevo box
  io?.emit(SocketEvent.UPDATE, {
    message: UpdateEvent.BOX_UPDATE
  });

  hospitalUsers.forEach((user) => {
    io?.emit(`${user.user_id}`, {
      message: UpdateEvent.BOX_UPDATE,
      box: {
        box_id: newBox.box_id,
        box_code: newBox.box_code,
        box_type: newBox.box_type,
        box_status: newBox.box_status,
        userAdded: usuarioMandoreq
      }
    });
  });
}

export function SendUpdatedUserNotifications(
  req: Request,
  newUser: User,
  hospitalUsers: User[],
  usuarioMandoreq: string
): void {
  const io = req.io;

  // Notifica a todos los clientes que se ha creado un nuevo box
  io?.emit(SocketEvent.UPDATE, {
    message: UpdateEvent.USER_UPDATE
  });

  hospitalUsers.forEach((user) => {
    io?.emit(`${user.user_id}`, {
      message: UpdateEvent.USER_UPDATE,
      user: {
        user_id: newUser.user_id,
        user_full_name: newUser.user_full_name,
        user_type: newUser.user_type,
        userAdded: usuarioMandoreq
      }
    });
  });
}

export function SendDeletedUserNotifications(
  req: Request,
  newUser: User,
  hospitalUsers: User[],
  usuarioMandoreq: string
): void {
  const io = req.io;

  // Notifica a todos los clientes que se ha creado un nuevo box
  io?.emit(SocketEvent.UPDATE, {
    message: UpdateEvent.USER_UPDATE
  });

  hospitalUsers.forEach((user) => {
    io?.emit(`${user.user_id}`, {
      message: UpdateEvent.USER_UPDATE,
      user: {
        user_id: newUser.user_id,
        user_full_name: newUser.user_full_name,
        user_type: newUser.user_type,
        userAdded: usuarioMandoreq
      }
    });
  });
}

export function SendRefreshTokenExpiredNotification(req: Request, userID: string): void {
  const io = req.io;

  // Emitir un evento general de actualización si es necesario
  io?.emit(SocketEvent.UPDATE, {
    message: UpdateEvent.REFRESH_TOKEN_EXPIRED
  });

  // Enviar el mensaje específicamente al usuario cuyo token expiró
  io?.emit(`${userID}`, {
    message: UpdateEvent.REFRESH_TOKEN_EXPIRED
  });
}

export function SendTokenExpiredNotification(req: Request, userID: string): void {
  const io = req.io;

  // Emitir un evento general de actualización si es necesario
  io?.emit(SocketEvent.UPDATE, {
    message: UpdateEvent.TOKEN_EXPIRED
  });

  // Enviar el mensaje específicamente al usuario cuyo token expiró
  io?.emit(`${userID}`, {
    message: UpdateEvent.TOKEN_EXPIRED
  });
}
