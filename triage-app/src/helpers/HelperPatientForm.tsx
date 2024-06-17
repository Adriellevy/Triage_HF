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
  return value.toLowerCase() === 'true'
}

export function returnName4Database(value: string) {
  return value
}
export function returnDate4Database(value: number | Date) {
  if (value instanceof Date) {
    return value
  } else {
    const currentYear = new Date().getFullYear()
    const birthYear = currentYear - value
    const birthDate = new Date(birthYear, 0, 1)
    return birthDate
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
