import PatientForm from '@/components/Forms/PatientForm'
import PatientHistory from '@/components/PatientHistory/PatientHistory'
import { useParams } from 'react-router-dom'

function PatientEdit() {
  const { edditingPatientID } = useParams()
  return (
    <div className='mb-4'>
      <PatientForm />
      <div className='max-w-6xl mx-auto mt-5 p-6 bg-white shadow-md rounded-md'>
        <PatientHistory patient_id={edditingPatientID} />
      </div>
    </div>
  )
}

export default PatientEdit
