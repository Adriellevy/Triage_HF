import { useEffect, useState } from 'react'
import { PatientHistoryItem } from '@/interfaces/Patinet'
import PatientHystoryItem from '@/components/PatientHistory/PatientHystoryItem'
import { getPatientHistory } from '@/services/patientService'
import LoaderSpin from '../LoaderSpin'

interface PropsPatienHistory {
  patient_id: string | undefined
}

function PatientHistory({ patient_id }: PropsPatienHistory) {
  const [PatientHistoryData, setPatientHistoryData] = useState<PatientHistoryItem[]>([])
  const [isLoading, setisLoading] = useState<boolean>(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getPatientHistory(patient_id)
        setPatientHistoryData(data)
        setisLoading(false)
      } catch (error) {
        console.error((error as Error).message)
      }
    }
    fetchData()
  }, [patient_id])

  return (
    <div className='mx-0 mt-4 lg:mx-0'>
      <h3 className='text-xl  font-bold mt-4 mb-6'>Patient Change History</h3>
      <div className='max-h-72 overflow-y-auto'>
        {isLoading ? (
          <div className='flex justify-center items-center'>
            <LoaderSpin />
          </div>
        ) : (
          <table className='w-full border border-gray-300 text-white'>
            <thead>
              <tr className='min-w-full bg-blue-800'>
                <th className='border p-2 '>Time</th>
                <th className='border p-2 '>Item</th>
                <th className='border p-2 '>Before</th>
                <th className='border p-2 '>After</th>
                <th className='border p-2 '>Edit by</th>
              </tr>
            </thead>
            <tbody className='text-center'>
              {PatientHistoryData.map(
                (HistoryItem, index) =>
                  HistoryItem && (
                    <PatientHystoryItem
                      key={HistoryItem.update_id}
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
