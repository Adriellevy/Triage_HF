import { type Patient, type PatientHistoryItem } from '../interface/patient';

const DateKey = ['patient_exit_time', 'patient_triage_time', 'patient_entry_time', 'patient_age'];

const BoleanKey = 'patient_isolated';

export function GeneratePatientHistoryItem(
  UserNuevo: Partial<Patient>,
  UserAntiguo: Patient,
  tiempoActual: Date,
  userID: string
): PatientHistoryItem[] {
  const cambios: PatientHistoryItem[] = [];

  for (const key in UserNuevo) {
    const typedKey = key as keyof Patient;
    if (DateKey.includes(typedKey)) {
      if (
        Object.prototype.hasOwnProperty.call(UserAntiguo, key) &&
        Object.prototype.hasOwnProperty.call(UserNuevo, key) &&
        UserNuevo[typedKey] !== null &&
        UserAntiguo[typedKey] !== null &&
        new Date(String(UserAntiguo[typedKey])).getTime() !==
          new Date(String(UserNuevo[typedKey])).getTime()
      ) {
        cambios.push({
          updated_id: '123',
          patient_id: UserAntiguo.patient_id,
          patient_updated_column: typedKey,
          patient_old_value: UserAntiguo[key],
          patient_new_value: UserNuevo[key],
          patient_updated_date: tiempoActual,
          user_id: userID
        });
      }
    } else if (typedKey === BoleanKey) {
      if (
        Object.prototype.hasOwnProperty.call(UserAntiguo, key) &&
        Boolean(UserAntiguo[typedKey]) !== Boolean(UserNuevo[typedKey])
      ) {
        cambios.push({
          updated_id: '123',
          patient_id: UserAntiguo.patient_id,
          patient_updated_column: typedKey,
          patient_old_value: UserAntiguo[key],
          patient_new_value: UserNuevo[key],
          patient_updated_date: tiempoActual,
          user_id: userID
        });
      }
    } else {
      if (
        Object.prototype.hasOwnProperty.call(UserAntiguo, key) &&
        UserAntiguo[typedKey] !== UserNuevo[typedKey]
      ) {
        cambios.push({
          updated_id: '123',
          patient_id: UserAntiguo.patient_id,
          patient_updated_column: typedKey,
          patient_old_value: UserAntiguo[key],
          patient_new_value: UserNuevo[key],
          patient_updated_date: tiempoActual,
          user_id: userID
        });
      }
    }
  }

  return cambios;
}
