import React, { useEffect, useState } from 'react'
import { PatientData, PatientHistoryItem as PatientHistoryItemType } from '@/interfaces/Patinet'
import { useTranslation } from 'react-i18next'
import { getFormatBirthDate, getFormatDate } from '../../helpers/HelperFechas'
import { returnUserNameWithId, returnBoxCodeById } from '../../helpers/HelperHistoryItem'
interface PropsPatientHystoryItem {
  item: PatientHistoryItemType
  index: number
}

interface Field {
  label: string
  key: keyof PatientData
  format: ((value: string) => string | Promise<string | null>) | null
}

const PatientHistoryItem: React.FC<PropsPatientHystoryItem> = ({ item, index }) => {
  const [oldValue, setOldValue] = useState<string | null>('')
  const [newValue, setNewValue] = useState<string | null>('')

  useEffect(() => {
    const formatValues = async () => {
      const oldVal = await formatValue(
        item.patient_old_value,
        item.patient_updated_column as keyof PatientData
      )
      const newVal = await formatValue(
        item.patient_new_value,
        item.patient_updated_column as keyof PatientData
      )
      setOldValue(oldVal)
      setNewValue(newVal)
    }
    formatValues()
  }, [item.patient_old_value, item.patient_new_value, item.patient_updated_column])

  const { t } = useTranslation('PatientHistoryItem')
  const { patient_updated_date, patient_updated_column, user_name } = item

  const columnas: Field[] = [
    { key: 'patient_name', label: t('NameLabel'), format: null },
    { key: 'patient_age', label: t('AgeLabel'), format: getFormatBirthDate },
    { key: 'patient_entry_time', label: t('EntryTimeLabel'), format: getFormatDate },
    { key: 'patient_triage_level', label: t('TriageLevelLabel'), format: null },
    { key: 'patient_triage_time', label: t('TriageTimeLabel'), format: getFormatDate },
    { key: 'patient_isolated', label: t('PatientIsolatedLabel'), format: null },
    { key: 'patient_symptom', label: t('PatientProblem'), format: null },
    { key: 'patient_healthcare_system', label: t('PatientHealthcareSystem'), format: null },
    { key: 'box_id', label: t('PatientBoxLabel'), format: returnBoxCodeById },
    { key: 'doctor_id', label: t('DoctorNameLabel'), format: returnUserNameWithId },
    { key: 'nurse_id', label: t('NurseNameLabel'), format: returnUserNameWithId },
    { key: 'patient_status', label: t('PatientStatusLabel'), format: null }
  ]

  const isOdd = index % 2 !== 0
  const bgClass = isOdd ? 'bg-white' : 'bg-gray-100'

  const formatValue = async (value: string, key: keyof PatientData) => {
    const field = columnas.find((field) => field.key === key)
    if (field && field.format) {
      return await field.format(value)
    }
    return value
  }

  return (
    <tr className={bgClass}>
      <td className='border p-2 '>{getFormatDate(patient_updated_date)}</td>
      <td className='border p-2 '>
        {columnas.find((col) => col.key === patient_updated_column)?.label ||
          String(patient_updated_column)}
      </td>
      <td className='border p-2 '>{oldValue}</td>
      <td className='border p-2 '>{newValue}</td>
      <td className='border p-2 '>{user_name}</td>
    </tr>
  )
}

export default PatientHistoryItem
