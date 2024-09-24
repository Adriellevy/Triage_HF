import { scryptSync, createCipheriv, createDecipheriv, randomBytes } from 'crypto';
import { Patient } from '../interface/patient';
import dotenv from 'dotenv';
dotenv.config();

const algorithm = process.env.ALGORITHM?.toString();
const password = process.env.PRIVATE_KEY?.toString();
const salt = process.env.SALT?.toString();
const keyLength = 24;
const ivLength = 16;

if (!algorithm || !password || !salt) {
  throw new Error('Variables de entorno faltantes: ALGORITHM, PRIVATE_KEY o SALT');
}
// Generamos la clave utilizando scryptSync
const key = scryptSync(password, salt, keyLength);

// Método para encriptar los datos del paciente
export const encryptPatientData = (patient: Patient): Patient => {
  // Si no existe ni el nombre ni la edad, retornamos el objeto tal cual
  if (!patient.patient_name && !patient.patient_age) {
    return patient;
  }

  // Generar un vector de inicialización (IV) para `patient_name` si existe
  let encryptedName: string | undefined;
  if (patient.patient_name) {
    const ivName = randomBytes(ivLength);
    const cipherName = createCipheriv(algorithm, key, ivName);

    let encrypted = cipherName.update(patient.patient_name, 'utf8', 'hex');
    encrypted += cipherName.final('hex');

    encryptedName = ivName.toString('hex') + ':' + encrypted;
  }

  // Generar un vector de inicialización (IV) para `patient_age` si existe
  let encryptedAge: string | undefined;
  if (patient.patient_age) {
    const ivAge = randomBytes(ivLength);
    const cipherAge = createCipheriv(algorithm, key, ivAge);

    let encrypted = cipherAge.update(patient.patient_age.toString(), 'utf8', 'hex');
    encrypted += cipherAge.final('hex');

    encryptedAge = ivAge.toString('hex') + ':' + encrypted;
  }

  if (!encryptedName && encryptedAge) {
    return {
      ...patient,
      patient_age: encryptedAge
    };
  } else if (!encryptedAge && encryptedName) {
    return {
      ...patient,
      patient_name: encryptedName
    };
  }
  if (encryptedName && encryptedAge)
    return {
      ...patient,
      patient_name: encryptedName,
      patient_age: encryptedAge
    };
  return patient;
};

// Método para desencriptar los datos del paciente
export const decryptPatientData = (patient: Patient): Patient => {
  let decryptedName: string | undefined;
  let decryptedAge: string | undefined;

  // Desencriptar `patient_name` si existe
  if (patient.patient_name) {
    const [ivHexName, encryptedName] = patient.patient_name.split(':');
    const ivName = Buffer.from(ivHexName, 'hex');

    const decipherName = createDecipheriv(algorithm, key, ivName);

    let decrypted = decipherName.update(encryptedName, 'hex', 'utf8');
    decrypted += decipherName.final('utf8');

    decryptedName = decrypted;
  }

  // Desencriptar `patient_age` si existe
  if (patient.patient_age) {
    const [ivHexAge, encryptedAge] = patient.patient_age.split(':');
    const ivAge = Buffer.from(ivHexAge, 'hex');

    const decipherAge = createDecipheriv(algorithm, key, ivAge);

    let decrypted = decipherAge.update(encryptedAge, 'hex', 'utf8');
    decrypted += decipherAge.final('utf8');

    decryptedAge = decrypted;
  }
  if (!decryptedName && decryptedAge) {
    return {
      ...patient,
      patient_age: decryptedAge
    };
  } else if (!decryptedAge && decryptedName) {
    return {
      ...patient,
      patient_name: decryptedName
    };
  }
  if (decryptedName && decryptedAge)
    return {
      ...patient,
      patient_name: decryptedName,
      patient_age: decryptedAge
    };
  return patient;
};

export const encryptstring = (data: string): string => {
  const iv = randomBytes(ivLength); // Generamos un vector de inicialización (IV) aleatorio
  const cipher = createCipheriv(algorithm, key, iv);

  let encrypted = cipher.update(data, 'utf8', 'hex');
  encrypted += cipher.final('hex');

  // Guardamos el IV junto con los datos encriptados
  const encryptedData = iv.toString('hex') + ':' + encrypted;

  // Retornamos el paciente con los campos encriptados
  return data;
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
