import { useEffect, useState } from 'react'
import { PatientHistoryItem } from '@/interfaces/Patinet'
import PatientHystoryItem from '@/components/PatientHistory/PatientHystoryItem'
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { getPatientHistory } from '@/services/patientService'
import LoaderSpin from '../LoaderSpin'
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Button } from '../ui'

interface PropsPatienHistory {
  patient_id: string | undefined
}

function PatientHistory({ patient_id }: PropsPatienHistory) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [PatientHistoryData, setPatientHistoryData] = useState<PatientHistoryItem[]>([
    {
      id: '1',
      time: '22/02/2024 6:00 p.m.',
      patientitem: 'Patient Status',
      before: 'INTERNACION',
      after: 'ALTA',
      user: 'Dr. Smith'
    },
    {
      id: '2',
      time: '22/02/2024 4:00 p.m.',
      patientitem: 'Patient Medication',
      before: 'Medication 2',
      after: 'Medication 3',
      user: 'Dr. Smith'
    },
    {
      id: '3',
      time: '22/02/2024 2:00 p.m.',
      patientitem: 'Patient Medication',
      before: 'Medication 1',
      after: 'Medication 2',
      user: 'Dr. Smith'
    },
    {
      id: '4',
      time: '22/02/2024 1:00 p.m.',
      patientitem: 'Patient Name',
      before: 'Name 1',
      after: 'Name 2',
      user: 'Dr. Smith'
    }
  ])

  const [isLoading, setisLoading] = useState<boolean>(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        //const data = await getPatientHistory(patient_id)
        //setPatientHistoryData(data)
        setisLoading(false)
      } catch (error) {
        console.error((error as Error).message)
      }
    }
    fetchData()
  }, [patient_id])

  return (
    <div className='mx-0 mt-4 lg:mx-0'>
      <h3 className={`text-xl  font-bold mt-4 mb-6`}>Patient Change History:</h3>
      <div className='max-h-72 overflow-y-auto'>
        {isLoading ? (
          <div className='flex justify-center items-center'>
            <LoaderSpin />
          </div>
        ) : (
          <table className='w-full border border-gray-300'>
            <thead>
              <tr className='min-w-full bg-blue-400'>
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
                    <PatientHystoryItem key={HistoryItem.id} item={HistoryItem} index={index} />
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
