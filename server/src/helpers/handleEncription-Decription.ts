import { scryptSync, createCipheriv, createDecipheriv, randomBytes } from 'crypto';
import { Patient } from '../interface/patient';

// Definimos la configuración para AES-192-CBC
const algorithm = 'aes-192-cbc';
const password = 'Password used to generate key'; // Asegúrate de usar una contraseña segura en producción
const salt = 'salt';
const keyLength = 24;
const ivLength = 16;

// Generamos la clave utilizando scryptSync
const key = scryptSync(password, salt, keyLength);
export const encryptPatientData = (patient: Patient): Patient => {
  const iv = randomBytes(ivLength); // Generamos un vector de inicialización (IV) aleatorio
  const cipher = createCipheriv(algorithm, key, iv);

  // Combinamos los datos a encriptar: nombre y edad del paciente
  const patientDataToEncrypt = JSON.stringify({
    patient_name: patient.patient_name,
    patient_age: patient.patient_age
  });

  let encrypted = cipher.update(patientDataToEncrypt, 'utf8', 'hex');
  encrypted += cipher.final('hex');

  // Guardamos el IV junto con los datos encriptados
  const encryptedData = iv.toString('hex') + ':' + encrypted;

  // Retornamos el paciente con los campos encriptados
  return {
    ...patient,
    patient_name: encryptedData,
    patient_age: encryptedData
  };
};

// Método para desencriptar los datos del paciente
export const decryptPatientData = (patient: Patient): Patient => {
  const encryptedData = patient.patient_name; // Suponemos que tanto nombre como edad están en el mismo formato

  // Separamos el IV del texto encriptado
  const [ivHex, encrypted] = encryptedData.split(':');
  const iv = Buffer.from(ivHex, 'hex');

  const decipher = createDecipheriv(algorithm, key, iv);

  let decrypted = decipher.update(encrypted, 'hex', 'utf8');
  decrypted += decipher.final('utf8');

  // Parseamos los datos desencriptados
  const decryptedData = JSON.parse(decrypted);

  // Retornamos el paciente con los datos desencriptados
  return {
    ...patient,
    patient_name: decryptedData.patient_name,
    patient_age: decryptedData.patient_age
  };
};

export const encryptstring = (data: string): string => {
  const iv = randomBytes(ivLength); // Generamos un vector de inicialización (IV) aleatorio
  const cipher = createCipheriv(algorithm, key, iv);

  let encrypted = cipher.update(data, 'utf8', 'hex');
  encrypted += cipher.final('hex');

  // Guardamos el IV junto con los datos encriptados
  const encryptedData = iv.toString('hex') + ':' + encrypted;

  // Retornamos el paciente con los campos encriptados
  return encryptedData;
};

export const dencryptstring = (data: string): string => {
  // Separamos el IV del texto encriptado
  const [ivHex, encrypted] = data.split(':');
  const iv = Buffer.from(ivHex, 'hex');

  const decipher = createDecipheriv(algorithm, key, iv);

  let decrypted = decipher.update(encrypted, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
};
