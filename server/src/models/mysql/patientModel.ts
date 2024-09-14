import 'dotenv/config';
import { connect } from '../../config/db';
import { type Patient } from '../../interface/patient';
import { type OkPacket, type RowDataPacket } from 'mysql2/promise';
import { type IBox } from './boxModel';

export interface IUser extends Patient, RowDataPacket {}

interface UUIDResult extends RowDataPacket {
  uuid: string;
}

export class PatientsModel {
  static async getAllPatients(): Promise<IUser[]> {
    try {
      const patientsQuery = `
        SELECT 
          BIN_TO_UUID(patient_id) AS patient_id,
          patient_name,
          patient_age,
          patient_entry_time,
          patient_exit_time,
          patient_triage_time,
          patient_triage_level,
          patient_isolated,
          BIN_TO_UUID(Patient.box_id) AS box_id,
          Box.box_code,
          patient_status,
          patient_symptom,
          patient_healthcare_system,
          doctor_procedure,
          doctor_studies_solicitated,
          nurse_coment,
          Doctor.user_name AS doctor_name,
          Nurse.user_name AS nurse_name
        FROM Patient
        LEFT JOIN User AS Doctor ON Patient.doctor_id = Doctor.user_id AND Doctor.user_type = 'DOCTOR'
        LEFT JOIN User AS Nurse ON Patient.nurse_id = Nurse.user_id AND Nurse.user_type = 'NURSE'
        LEFT JOIN Box ON Patient.box_id = Box.box_id;
      `;
      const conn = await connect();
      const [rows] = await conn.query<IUser[]>(patientsQuery);
      return rows;
    } catch (error) {
      console.error('Error al obtener todos los pacientes:', error);
      throw error;
    }
  }

  static async getPatientById({ id }: { id: string }): Promise<IUser | undefined> {
    const patientsQuery = `
        SELECT 
        BIN_TO_UUID(patient_id) AS patient_id,
        patient_name,
        patient_age,
        patient_entry_time,
        patient_exit_time,
        patient_triage_time,
        patient_triage_level,
        patient_isolated,
        BIN_TO_UUID(Patient.box_id) AS box_id,
        Box.box_code,
        patient_status,
        patient_symptom,
        patient_healthcare_system,
        doctor_procedure,
        doctor_studies_solicitated,
        nurse_coment,
        Doctor.user_name AS doctor_name,
        Nurse.user_name AS nurse_name,
        BIN_TO_UUID(doctor_id) AS doctor_id,
        BIN_TO_UUID(nurse_id) AS nurse_id
        FROM Patient
        LEFT JOIN User AS Doctor ON Patient.doctor_id = Doctor.user_id AND Doctor.user_type = 'DOCTOR'
        LEFT JOIN User AS Nurse ON Patient.nurse_id = Nurse.user_id AND Nurse.user_type = 'NURSE'
        LEFT JOIN Box ON Patient.box_id = Box.box_id
        WHERE Patient.patient_id = UUID_TO_BIN(?);
    `;
    const conn = await connect();
    const [patients] = await conn.query<IUser[]>(patientsQuery, [id]);
    if (patients.length === 0) return undefined;
    const pat = patients[0];
    return pat;
  }

  static async getPatientsByName(patientName: string): Promise<IUser[]> {
    try {
      const patientsQuery = `
        SELECT 
          BIN_TO_UUID(patient_id) AS patient_id,
          patient_name,
          patient_age,
          patient_entry_time,
          patient_exit_time,
          patient_triage_time,
          patient_triage_level,
          patient_isolated,
          BIN_TO_UUID(Patient.box_id) AS box_id,
          Box.box_code,
          patient_status,
          patient_symptom,
          patient_healthcare_system,
          doctor_procedure,
          doctor_studies_solicitated,
          nurse_coment,
          Doctor.user_name AS doctor_name,
          Nurse.user_name AS nurse_name
        FROM Patient
        LEFT JOIN User AS Doctor ON Patient.doctor_id = Doctor.user_id AND Doctor.user_type = 'DOCTOR'
        LEFT JOIN User AS Nurse ON Patient.nurse_id = Nurse.user_id AND Nurse.user_type = 'NURSE'
        LEFT JOIN Box ON Patient.box_id = Box.box_id
        WHERE patient_name LIKE ?;
      `;
      const conn = await connect();
      const [rows] = await conn.query<IUser[]>(patientsQuery, [`%${patientName}%`]);
      return rows;
    } catch (error) {
      console.error('Error al obtener los pacientes por nombre:', error);
      throw error;
    }
  }

  // eslint-disable-next-line consistent-return, @typescript-eslint/no-explicit-any
  static async createNewPatient({ data }): Promise<any> {
    try {
      const conn = await connect();
      const [uuidResult] = await conn.query<UUIDResult[]>('SELECT UUID() uuid;');
      const [{ uuid }] = uuidResult;

      const patientsQuery = `
            INSERT INTO Patient 
                (
                patient_id, 
                patient_name, 
                patient_age, 
                patient_entry_time, 
                patient_exit_time, 
                patient_triage_time, 
                patient_triage_level,
                patient_isolated, 
                patient_status, 
                patient_symptom,
                patient_healthcare_system,
                nurse_coment,  
                doctor_id, 
                nurse_id, 
                box_id
                ) 
            VALUES (
                    UUID_TO_BIN(?), 
                    ?,
                    STR_TO_DATE(?, '%Y-%m-%dT%H:%i:%s.%fZ'), 
                    ?, 
                    ?,
                    STR_TO_DATE(?, '%Y-%m-%dT%H:%i:%s.%fZ'), 
                    ?, 
                    ?, 
                    ?, 
                    ?,
                    ?,
                    ?,
                    UUID_TO_BIN(?), 
                    UUID_TO_BIN(?), 
                    UUID_TO_BIN(?)  
                  )`;
      const [result] = await conn.execute<OkPacket>(patientsQuery, [
        uuid,
        data.patient_name,
        data.patient_age,
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
        new Date(data.patient_entry_time),
        data.patient_exit_time,
        data.patient_triage_time,
        data.patient_triage_level,
        data.patient_isolated,
        data.patient_status,
        data.patient_symptom,
        data.patient_healthcare_system,
        data.nurse_coment,
        data.doctor_id,
        data.nurse_id,
        data.box_id
      ]);

      const now = new Date();

      if (result.affectedRows > 0) {
        const updateBoxStatusQuery = `
                UPDATE Box
                SET box_time = ?,
                box_status = 'OCUPADO'
                WHERE box_id = UUID_TO_BIN(?);
            `;
        await conn.query(updateBoxStatusQuery, [now, data.box_id]);
        return uuid;
      }
    } catch (error) {
      console.error(error);
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static async updatePatient({ id, data }): Promise<any> {
    try {
      const conn = await connect();
      console.log('info');
      console.log(data);
      const [[Box]] = await conn.query<IBox[]>(
        'SELECT BIN_TO_UUID(box_id) AS box_id FROM Patient WHERE patient_id = UUID_TO_BIN(?)',
        [id]
      );
      const prevBox = Box.box_id;
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      const updateFields = Object.entries(data)
        .filter(([key, value]) => value !== null && value !== undefined)
        .map(([key, value]) => {
          if (key === 'box_id' || key === 'nurse_id' || key === 'doctor_id') {
            return `${key} = UUID_TO_BIN(?)`;
          } else if (
            key === 'patient_age' ||
            key === 'patient_entry_time' ||
            key === 'patient_triage_time' ||
            key === 'patient_exit_time'
          ) {
            return `${key} = STR_TO_DATE(?, '%Y-%m-%dT%H:%i:%s.%fZ')`;
          } else {
            return `${key} = ?`;
          }
        })
        .join(', ');
      const patientsUpdateQuery = `
        UPDATE Patient
        SET ${updateFields}
        WHERE patient_id = UUID_TO_BIN(?);
      `;
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      const updateValues = Object.values(data).filter(
        (value) => value !== null && value !== undefined
      );
      updateValues.push(id);

      const [result] = await conn.execute<OkPacket>(patientsUpdateQuery, updateValues);

      if (result.affectedRows > 0) {
        if (
          (data.patient_status === 'ALTA' && data.box_id !== null) ||
          data.patient_status === 'AFUERA'
        ) {
          await conn.query(
            `
            UPDATE Patient
            SET box_id = null
            WHERE patient_id = UUID_TO_BIN(?);`,
            [id]
          );
          await conn.query(
            `UPDATE Box SET box_status = 'DISPONIBLE' WHERE box_id = UUID_TO_BIN(?);`,
            [prevBox]
          );
          return { message: 'Patient updated successfully' };
        }

        if (prevBox !== data.box_id) {
          const now = new Date();
          await conn.query(
            `UPDATE Box SET box_status = 'DISPONIBLE' WHERE box_id = UUID_TO_BIN(?);`,
            [prevBox]
          );
          await conn.query(
            `
            UPDATE Box
            SET box_time = ?,
            box_status = 'OCUPADO'
            WHERE box_id = UUID_TO_BIN(?)`,
            [now, data.box_id]
          );
        }
        return { message: 'Patient updated successfully' };
      } else {
        return { error: 'Error updating the patient' };
      }
    } catch (error) {
      console.error(error);
      return { error: 'An error occurred during the update' };
    }
  }

  /*
  static async updatePatient({ id, data }) {
    try {
      console.log('info');
      console.log(data);
      const [[Box]] = await connection.query(
        'SELECT BIN_TO_UUID(box_id) AS box_id FROM Patient WHERE patient_id = UUID_TO_BIN(?)',
        [id]
      );
      const prevBox = Box.box_id;
      const updateFields = Object.entries(data)
        .filter(([key, value]) => value !== null && value !== undefined)
        .map(([key, value]) => {
          if (key === 'box_id' || key === 'nurse_id' || key === 'doctor_id') {
            return `${key} = UUID_TO_BIN(?)`;
          } else {
            return `${key} = ?`;
          }
        })
        .join(', ');
      const patientsUpdateQuery = `
        UPDATE Patient
        SET ${updateFields}
        WHERE patient_id = UUID_TO_BIN(?);
      `;
      const updateValues = Object.values(data).filter(
        (value) => value !== null && value !== undefined
      );
      updateValues.push(id);

      const [result] = await connection.query(patientsUpdateQuery, updateValues);

      if (result.affectedRows > 0) {
        if (data.patient_status === 'ALTA' && data.box_id !== null) {
          await connection.query(
            `
            UPDATE Patient
            SET box_id = null
            WHERE patient_id = UUID_TO_BIN(?);`,
            [id]
          );
          await connection.query(
            `UPDATE Box SET box_status = 'DISPONIBLE' WHERE box_id = UUID_TO_BIN(?);`,
            [prevBox]
          );
          return { message: 'Patient updated successfully' };
        }

        if (prevBox !== data.box_id) {
          // eslint-disable-next-line no-shadow
          const now = new Date();
          await connection.query(
            `UPDATE Box SET box_status = 'DISPONIBLE' WHERE box_id = UUID_TO_BIN(?);`,
            [prevBox]
          );
          await connection.query(
            `
            UPDATE Box
            SET box_time = ?,
            box_status = 'OCUPADO'
            WHERE box_id = UUID_TO_BIN(?)`,
            [now, data.box_id]
          );
        }
        return { message: 'Patient updated successfully' };
      } else {
        return { error: 'Error updating the patient' };
      }
    } catch (error) {
      console.error(error);
      return { error: 'An error occurred during the update' };
    }
  }
*/

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static async getPatientUpdateHistory({ id }: { id: string }): Promise<any> {
    const PatientUpdateHistoryQuery = ` 
    SELECT 
    BIN_TO_UUID(PUH.updated_id) AS updated_id,
    PUH.patient_updated_column,
    PUH.patient_old_value,
    PUH.patient_new_value,
    PUH.patient_updated_date,
    U.user_name 
    FROM PatientUpdateHistory PUH
    JOIN User U ON PUH.user_id = U.user_id
    WHERE PUH.patient_id = UUID_TO_BIN(?);
    `;
    const conn = await connect();
    const [PatientUpdateHistory] = await conn.query(PatientUpdateHistoryQuery, [id]);
    return PatientUpdateHistory;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static async getLastPatientUpdateHistory({ id }: { id: string }): Promise<any> {
    const PatientUpdateHistoryQuery = ` 
    SELECT 
      BIN_TO_UUID(PUH.updated_id) AS updated_id,
      PUH.patient_updated_column,
      PUH.patient_old_value,
      PUH.patient_new_value,
      PUH.patient_updated_date,
      U.user_name 
    FROM PatientUpdateHistory PUH
    JOIN User U ON PUH.user_id = U.user_id
    WHERE PUH.patient_id = UUID_TO_BIN(?)
    ORDER BY PUH.patient_updated_date DESC;
    `;
    const conn = await connect();
    const [PatientUpdateHistory] = await conn.query(PatientUpdateHistoryQuery, [id]);
    return PatientUpdateHistory;
  }

  static async AddUpdateHistory({ data }): Promise<number> {
    const conn = await connect();
    const [uuidResult] = await conn.query<UUIDResult[]>('SELECT UUID() uuid;');
    const [{ uuid }] = uuidResult;
    console.log('Data en el metodo AddUpdateHistory:\n', data);
    let { patient_id, patient_updated_column, patient_old_value, patient_new_value, user_id } =
      data;
    // TODO: ver si es que es el valor patient_new_value debería ser nulo
    if (patient_updated_column === 'box_id' && patient_new_value == null) patient_new_value = ' ';
    const insertQuery = `
        INSERT INTO PatientUpdateHistory (
          updated_id, 
          patient_id, 
          patient_updated_column, 
          patient_old_value, 
          patient_new_value, 
          user_id)
        VALUES (UUID_TO_BIN(?), UUID_TO_BIN(?), ?, ?, ?, UUID_TO_BIN(?));
      `;
    await conn.query(insertQuery, [
      uuid,
      patient_id,
      patient_updated_column,
      patient_old_value,
      patient_new_value,
      user_id
    ]);
    return 1;
  }

  static async getPatientsCount(): Promise<number> {
    const patientsQuery = `
      SELECT COUNT(*) AS cantidad
      FROM Patient
      WHERE patient_status != "ALTA";
    `;
    const conn = await connect();
    const [result] = await conn.query(patientsQuery);
    return result[0].cantidad;
  }

  static async getOutsidePatientsCount(): Promise<number> {
    const patientsQuery = `
      SELECT COUNT(*) AS cantidad
      FROM Patient
      WHERE patient_status = "AFUERA";
    `;
    const conn = await connect();
    const [result] = await conn.query(patientsQuery);
    return result[0].cantidad;
  }

  static async getTriageIIPatientsCount(): Promise<number> {
    const patientsQuery = `
      SELECT COUNT(*) AS cantidad
      FROM Patient
      WHERE patient_triage_level = 2 AND patient_status != "ALTA";
    `;
    const conn = await connect();
    const [result] = await conn.query(patientsQuery);
    return result[0].cantidad;
  }

  static async getPaginatedPatients(page: number): Promise<Patient[]> {
    const patientsPerPage = 60;
    const offset = (page - 1) * patientsPerPage;
    const patientsQuery = `
      SELECT 
          BIN_TO_UUID(patient_id) AS patient_id,
          patient_name,
          patient_age,
          patient_entry_time,
          patient_exit_time,
          patient_triage_time,
          patient_triage_level,
          patient_isolated,
          BIN_TO_UUID(Patient.box_id) AS box_id,
          Box.box_code,
          patient_status,
          patient_symptom,
          patient_healthcare_system,
          doctor_procedure,
          doctor_studies_solicitated,
          nurse_coment,
          Doctor.user_name AS doctor_name,
          Nurse.user_name AS nurse_name
      FROM Patient
      LEFT JOIN User AS Doctor ON Patient.doctor_id = Doctor.user_id AND Doctor.user_type = 'DOCTOR'
      LEFT JOIN User AS Nurse ON Patient.nurse_id = Nurse.user_id AND Nurse.user_type = 'NURSE'
      LEFT JOIN Box ON Patient.box_id = Box.box_id
      ORDER BY patient_entry_time DESC
      LIMIT ${patientsPerPage} OFFSET ${offset};
    `;
    const conn = await connect();
    const [rows] = await conn.query<Patient[] & RowDataPacket[]>(patientsQuery);
    if (rows) console.log('Se obtuvieron los pacientes paginados');
    return rows as Patient[];
  }

  static async getPatientsByUserAndStatus(userId: string, statuses: string[]): Promise<IUser[]> {
    try {
      const query = `
        SELECT 
          BIN_TO_UUID(patient_id) AS patient_id,
          patient_name,
          patient_age,
          patient_entry_time,
          patient_exit_time,
          patient_triage_time,
          patient_triage_level,
          patient_isolated,
          BIN_TO_UUID(box_id) AS box_id,
          patient_status,
          patient_symptom,
          patient_healthcare_system,
          doctor_procedure,
          doctor_studies_solicitated,
          nurse_coment
        FROM Patient
        WHERE (doctor_id = UUID_TO_BIN(?) OR nurse_id = UUID_TO_BIN(?))
        AND patient_status IN (?);
      `;
      const conn = await connect();
      const [rows] = await conn.query<IUser[]>(query, [userId, userId, statuses]);
      return rows;
    } catch (error) {
      console.error('Error fetching patients by user and status:', error);
      throw error;
    }
  }

  static async getPatientsByStatus(statuses: string[]): Promise<IUser[]> {
    try {
      const query = `
        SELECT 
          BIN_TO_UUID(patient_id) AS patient_id,
          patient_name,
          patient_age,
          patient_entry_time,
          patient_exit_time,
          patient_triage_time,
          patient_triage_level,
          patient_isolated,
          BIN_TO_UUID(box_id) AS box_id,
          patient_status,
          patient_symptom,
          patient_healthcare_system,
          doctor_procedure,
          doctor_studies_solicitated,
          nurse_coment
        FROM Patient
        WHERE patient_status IN (?);
      `;
      const conn = await connect();
      const [rows] = await conn.query<IUser[]>(query, [statuses]);
      return rows;
    } catch (error) {
      console.error('Error fetching patients by status:', error);
      throw error;
    }
  }
}
