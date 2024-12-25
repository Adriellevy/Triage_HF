import React, { useEffect, useState } from 'react'
import { ConflictResolverProps, Field } from '../../interfaces/ConflictResolver'
import { getFormatBirthDate, getFormatDate } from '../../helpers/HelperFechas'
import {
  returnUserNameWithId,
  returnBoxCodeById,
  normalizeValue
} from '../../helpers/HelperHistoryItem'
import { useTranslation } from 'react-i18next'

const ConflictResolver: React.FC<ConflictResolverProps> = ({
  conflictData,
  onResolve,
  onCancel
}) => {
  const { t } = useTranslation('PatientHistoryItem')
  const [mergedData, setMergedData] = useState<Record<string, string>>({})

  const handleFieldSelection = (field: string, value: string) => {
    setMergedData((prev) => ({ ...prev, [field]: value }))
  }

  const handleMergeSubmit = () => {
    onResolve(mergedData)
  }

  const getFormatBoolean = (value: boolean): string => {
    const translatedValue = t(value ? 'TrueLabel' : 'FalseLabel')
    return translatedValue
  }

  const getFormatNull = (value: any): string => {
    return value === null ? t('NullLabel') : value
  }

  const columnas: Field[] = [
    { key: 'patient_name', label: t('NameLabel'), format: getFormatNull },
    { key: 'patient_age', label: t('AgeLabel'), format: getFormatBirthDate },
    { key: 'patient_entry_time', label: t('EntryTimeLabel'), format: getFormatDate },
    { key: 'patient_triage_level', label: t('TriageLevelLabel'), format: getFormatNull },
    { key: 'patient_triage_time', label: t('TriageTimeLabel'), format: getFormatDate },
    { key: 'patient_isolated', label: t('PatientIsolatedLabel'), format: getFormatBoolean },
    { key: 'patient_symptom', label: t('PatientProblem'), format: getFormatNull },
    {
      key: 'patient_healthcare_system',
      label: t('PatientHealthcareSystem'),
      format: getFormatNull
    },
    { key: 'box_id', label: t('PatientBoxLabel'), format: returnBoxCodeById },
    { key: 'doctor_id', label: t('DoctorNameLabel'), format: returnUserNameWithId },
    { key: 'nurse_id', label: t('NurseNameLabel'), format: returnUserNameWithId },
    { key: 'patient_status', label: t('PatientStatusLabel'), format: getFormatNull }
  ]

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const formatValue = async (key: string, value: any) => {
    console.log(`Formateando campo: ${key}, valor:`, value)
    const column = columnas.find((col) => col.key === key)
    if (column && column.format) {
      try {
        const formattedValue = await column.format(value)
        return formattedValue
      } catch (error) {
        console.error(`Error formateando campo ${key}:`, error)
        return value // Retorna el valor original si ocurre un error
      }
    }
    return value
  }

  const [formattedCurrentData, setFormattedCurrentData] = useState<Record<string, string>>({})
  const [formattedNewData, setFormattedNewData] = useState<Record<string, string>>({})

  useEffect(() => {
    console.log('Datos recibidos:', conflictData)

    const initializeMergedData = () => {
      const differingData: Record<string, string> = {}
      for (const key in conflictData.currentData) {
        if (
          conflictData.newData.hasOwnProperty(key) &&
          normalizeValue(conflictData.currentData[key]) !==
            normalizeValue(conflictData.newData[key])
        ) {
          differingData[key] = conflictData.currentData[key]
        }
      }
      console.log('Datos diferentes inicializados:', differingData)
      setMergedData(differingData)
    }

    const formatData = async () => {
      const newFormattedCurrentData: Record<string, string> = {}
      const newFormattedNewData: Record<string, string> = {}

      for (const key in conflictData.currentData) {
        newFormattedCurrentData[key] = await formatValue(key, conflictData.currentData[key])
      }
      for (const key in conflictData.newData) {
        newFormattedNewData[key] = await formatValue(key, conflictData.newData[key])
      }

      console.log('Datos formateados actuales:', newFormattedCurrentData)
      console.log('Datos formateados nuevos:', newFormattedNewData)

      setFormattedCurrentData(newFormattedCurrentData)
      setFormattedNewData(newFormattedNewData)
    }

    formatData()
    initializeMergedData()
  }, [conflictData])

  return (
    <div className='fixed top-0 left-0 w-full z-10 h-full flex items-center justify-center bg-black bg-opacity-35'>
      <div className='bg-white p-8 rounded-lg'>
        {conflictData ? (
          <>
            <h1 className='text-center font-bold mb-4'>Conflicto de Datos</h1>
            <p className='mb-4 text-center'>
              Selecciona los valores que deseas conservar e ignorar
            </p>
            <table className='w-full mb-4'>
              <thead>
                <tr>
                  <th className='py-2 px-4'>Campo en conflicto</th>
                  <th className='py-2 px-4'>Valor recibido</th>
                  <th className='py-2 px-4'>Tu valor</th>
                  <th className='py-2 px-4'>Valor Final</th>
                </tr>
              </thead>
              <tbody>
                {Object.keys(conflictData.newData)
                  .filter(
                    (key) =>
                      key !== 'patient_triage_time' &&
                      normalizeValue(conflictData.currentData[key]) !==
                        normalizeValue(conflictData.newData[key])
                  )
                  .map((key) => {
                    return (
                      <tr key={key} className='border-t'>
                        <td className='py-2 px-4'>
                          {columnas.find((col) => col.key === key)?.label || key}
                        </td>
                        <td className='py-2 px-4'>{formattedCurrentData[key]}</td>
                        <td className='py-2 px-4'>{formattedNewData[key]}</td>
                        <td className='py-2 px-4'>
                          <select
                            value={mergedData[key] || conflictData.currentData[key]}
                            onChange={(e) => handleFieldSelection(key, e.target.value)}
                          >
                            <option value={conflictData.currentData[key]}>
                              {formattedCurrentData[key]}
                            </option>
                            <option value={conflictData.newData[key]}>
                              {formattedNewData[key]}
                            </option>
                          </select>
                        </td>
                      </tr>
                    )
                  })}
              </tbody>
            </table>
            <div className='flex justify-center mt-4 gap-2'>
              <button
                className='bg-green-500 text-white py-2 px-4 rounded'
                onClick={handleMergeSubmit}
              >
                Guardar Combinacion
              </button>
              <button className='bg-red-500 text-white py-2 px-4 rounded' onClick={onCancel}>
                Cancelar
              </button>
            </div>
          </>
        ) : (
          <p>No hay datos de conflicto para resolver</p>
        )}
      </div>
    </div>
  )
}

export default ConflictResolver
