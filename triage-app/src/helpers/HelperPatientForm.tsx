import { Field } from '@/interfaces/Patinet'
import { User } from '@/interfaces/User'
import { Box } from '@/interfaces/Boxes'
export function IndiceObjeto(objeto: Field[], key: string): number {
  if (!Array.isArray(objeto)) {
    console.error("Expected 'objeto' to be an array but received:", objeto)
    return -1
  }
  const index = objeto.findIndex((item) => item.key === key)
  return index === -1 ? -1 : index
}

export function returnDoctorName(Doctor: User) {
  if (Doctor === null) return ''
  return `${Doctor.user_name}`
}
export function returnNurseName(Nurse: User) {
  if (Nurse === null) return ''
  return `${Nurse.user_name}`
}

export function returnBoxCode(Box: Box) {
  if (Box === null) return ''
  if (Box.box_id === "hardcoded-box-id") return "AFUERA"
  return `${Box.box_code} : ${Box.box_type}`
}

export function returnSintomName(sintom: { name: string }) {
  if (sintom === null) return ''
  return `${sintom.name}`
}
export function returnStatePatient(status: string) {
  return status
}

export function returnDependingModeAge(age: number | Date) {
  return age
}

export function returnBoolean(value: string | boolean) {
  if (value === null) return false
  if (typeof value === 'boolean') return value
  if (typeof value === 'string') {
    return value.toLowerCase() === 'true';
  }
  return false
}

export function returnName4Database(value: string) {
  return value
}
export function returnDate4Database(value: number | Date) {
  const currentYear = new Date().getFullYear();
  const thresholdYear = currentYear - 140; // Año límite de hace 140 años

  console.log(value);
  console.log(value instanceof Date);

  // Caso 1: Si el valor es un número
  if (!isNaN(value as number)) {
    const age = value as number;
    if (age >= 140) {
      return null; // Si el número es mayor o igual a 140, retorna null
    }
    const birthYear = currentYear - age;
    const birthDate = new Date(birthYear, 0, 1);
    return birthDate;

  // Caso 2: Si el valor es una fecha
  } else {
    const date = new Date(value as Date);
    if (date.getFullYear() <= thresholdYear) {
      return null; // Si la fecha es hace 140 años o más, retorna null
    }
    return date;
  }
}
export function returnNewDate(): Date {
  return new Date()
}

export function returnDoctorId(Doctor: User): string {
  // Implementación de la función
  return Doctor.user_id
}

export function returnNurseId(Nurse: User): string {
  // Implementación de la función
  return Nurse.user_id
}

export function returnBoxID(Box: Box): string | null {
  // Implementación de la función
  if (Box === null) return null
  if (Box.box_id) return Box.box_id
  return Box.toString()
}

export function returnSintoma(Box: Box): string {
  // Implementación de la función
  return Box.box_id
}

export function returnPatientTriageNumber(level: string): number {
  // Implementación de la función
  return Number(level)
}
export function returnEstado(status: string): string {
  return status
}

export function returnHeatcareSystemName(HealthInsuranseName: string): string {
  return HealthInsuranseName
}
