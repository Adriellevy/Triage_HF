import { useEffect, useState } from 'react'
import { PatientHistoryItemType } from '@/interfaces/Patinet'
import PatientHystoryItem from '@/components/PatientHistory/PatientHistoryItem'
import { getPatientHistory } from '@/services/patientService'
import LoaderSpin from '../LoaderSpin'
import { useTranslation } from 'react-i18next'

interface PropsPatienHistory {
  patient_id: string | undefined
  setHasHistory?: (hasHistory: boolean) => void // Make setHasHistory optional
}

function PatientHistory({
  patient_id,
  setHasHistory = () => {} // Provide a default no-op function
}: PropsPatienHistory) {
  const { t } = useTranslation('PatientHistory')
  const [PatientHistoryData, setPatientHistoryData] = useState<PatientHistoryItemType[]>([])
  const [isLoading, setisLoading] = useState<boolean>(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getPatientHistory(patient_id)
        // console.log('datos del paciente cambiado')
        // console.log(data)

        // Ordenar los datos por fecha de actualización
        const sortedData = data.sort(
          (a: PatientHistoryItemType, b: PatientHistoryItemType) =>
            new Date(b.patient_updated_date).getTime() - new Date(a.patient_updated_date).getTime()
        )

        setPatientHistoryData(sortedData)
        // TODO: Change to a low query request to the API
        const hasHistory =
          sortedData.length > 0 &&
          sortedData.some(
            (item) =>
              item.patient_new_value !== 'ALTA' && item.patient_updated_column !== 'patient_status'
          )
        setHasHistory(hasHistory) // Set the hasHistory state
        setisLoading(false)
      } catch (error) {
        console.error((error as Error).message)
      }
    }
    fetchData()
  }, [patient_id, setHasHistory])

  return (
    <div className='mt-4 px-2 md:px-8'>
      <div className='overflow-x-auto shadow-md rounded-lg'>
        {isLoading ? (
          <div className='flex justify-center items-center'>
            <LoaderSpin />
          </div>
        ) : (
          <table className='w-full text-sm md:text-base border border-gray-300'>
            <thead className='bg-blue-800 text-white'>
              <tr>
                <th className='p-2 text-left cursor-pointer text-center'>{t('TimeLable')}</th>
                <th className='p-2 text-left cursor-pointer text-center'>{t('ItemLable')}</th>
                <th className='p-2 text-left cursor-pointer text-center'>{t('BeforeLable')}</th>
                <th className='p-2 text-left cursor-pointer text-center'>{t('AfterLable')}</th>
                <th className='p-2 text-left cursor-pointer text-center'>{t('EditByLabel')}</th>
              </tr>
            </thead>
            <tbody className='text-center text-black'>
              {PatientHistoryData.map(
                (HistoryItem, index) =>
                  HistoryItem && (
                    <PatientHystoryItem
                      key={HistoryItem.updated_id}
                      item={HistoryItem}
                      index={index}
                    />
                  )
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}

export default PatientHistory
