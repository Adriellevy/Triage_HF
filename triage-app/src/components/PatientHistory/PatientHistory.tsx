import { useEffect, useState } from 'react'
import { PatientHistoryItem } from '@/interfaces/Patinet'
import PatientHystoryItem from '@/components/PatientHistory/PatientHistoryItem'
import { getPatientHistory } from '@/services/patientService'
import LoaderSpin from '../LoaderSpin'
import { useTranslation } from 'react-i18next'

interface PropsPatienHistory {
  patient_id: string | undefined
}

function PatientHistory({ patient_id }: PropsPatienHistory) {
  const { t } = useTranslation('PatientHistory')
  const [PatientHistoryData, setPatientHistoryData] = useState<PatientHistoryItem[]>([])
  const [isLoading, setisLoading] = useState<boolean>(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getPatientHistory(patient_id)
        console.log('datos del paciente cambiado')
        console.log(data)

        // Ordenar los datos por fecha de actualización
        const sortedData = data.sort(
          (a: PatientHistoryItem, b: PatientHistoryItem) =>
            new Date(b.patient_updated_date).getTime() - new Date(a.patient_updated_date).getTime()
        )

        setPatientHistoryData(sortedData)
        setisLoading(false)
      } catch (error) {
        console.error((error as Error).message)
      }
    }
    fetchData()
  }, [patient_id])

  return (
    <div className='mx-0 mt-4 lg:mx-0'>
      <h3 className='text-xl font-bold mt-4 mb-6'>{t('title')}</h3>
      <div className='max-h-72 overflow-y-auto'>
        {isLoading ? (
          <div className='flex justify-center items-center'>
            <LoaderSpin />
          </div>
        ) : (
          <table className='w-full border border-gray-300 text-white'>
            <thead className='sticky top-0 bg-blue-800 m-2'>
              <tr>
                <th className='border p-2'>{t('TimeLable')}</th>
                <th className='border p-2'>{t('ItemLable')}</th>
                <th className='border p-2'>{t('BeforeLable')}</th>
                <th className='border p-2'>{t('AfterLable')}</th>
                <th className='border p-2'>{t('EditByLabel')}</th>
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
