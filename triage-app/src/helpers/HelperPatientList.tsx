import { ColourOption } from '@/components/Docs/Data'
import { Patient } from '@/interfaces/Patinet'
import { User } from '@/interfaces/User'
import { MultiValue } from 'react-select'

export function filterPatients(
  patients: Patient[],
  options: MultiValue<ColourOption>,
  term: string,
  filterBy: string,
  actualUser: User
) {
  const isPatientSelected = (patient: Patient, option: ColourOption) => {
    switch (option.label) {
      case 'TODOS':
      case '1-4':
        return patient[option.value]
      case 'TODOS MENOS ALTA':
        return patient[option.value] !== 'ALTA'
      case 'MÍOS':
        return patient.doctor_name === actualUser.user_name
      case 'EN AISLAMIENTO':
        return patient.patient_isolated === 1
      default:
        return patient[option.value].toString() === option.item
    }
  }

  const filterOptions: Record<string, (patient: Patient) => boolean> = {
    name: (patient) => patient.patient_name.toLowerCase().includes(term.toLowerCase()),
    date_of_birth: () => false
  }

  return patients.filter((patient) => {
    const optionsMatch = options.every((option) => isPatientSelected(patient, option))
    const searchMatch = filterBy ? filterOptions[filterBy](patient) : true
    return optionsMatch && searchMatch
  })
}
