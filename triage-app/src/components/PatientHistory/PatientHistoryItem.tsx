import { PatientHistoryItem } from '@/interfaces/Patinet'
import { useTranslation } from 'react-i18next'

interface PropsPatientHystoryItem {
  item: PatientHistoryItem
  index: number
}

interface Columns {
  [key: string]: string
}

function PatientHistoryItem({ item, index }: PropsPatientHystoryItem) {
  const { t } = useTranslation('PatientHistoryItem')
  const {
    patient_updated_date,
    patient_updated_column,
    patient_old_value,
    patient_new_value,
    user_name
  } = item

  const columns: Columns = {
    patient_name: t('NameLabel'),
    date_of_birth: t('AgeLabel'),
    entry_time: t('EntryTimeLabel'),
    patient_triage_level: t('TriageLevelLabel'),
    patient_triage_time: t('TriageTimeLabel'),
    patient_medication: t('PatientMedication'),
    patient_problem: t('PatientProblem'),
    box_code: t('PatientBoxLabel'),
    doctor_name: t('DoctorNameLabel'),
    nurse_name: t('NurseNameLabel'),
    patient_status: t('PatientStatusLabel')
  }

  const isOdd = index % 2 !== 0

  const bgClass = isOdd ? 'bg-white' : 'bg-gray-100'

  return (
    <tr className={bgClass}>
      <td className='border p-2 '>{patient_updated_date}</td>
      <td className='border p-2 '>{columns[String(patient_updated_column)]}</td>
      <td className='border p-2 '>{patient_old_value}</td>
      <td className='border p-2 '>{patient_new_value}</td>
      <td className='border p-2 '>{user_name}</td>
    </tr>
  )
}

export default PatientHistoryItem
