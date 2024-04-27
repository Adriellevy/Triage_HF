import PatientForm from '@/components/Forms/PatientForm'
import PatientHistory from '@/components/PatientHistory/PatientHistory'
import { UserRole } from '@/interfaces/User'
import { useParams } from 'react-router-dom'

function PatientEdit({ user_tipe }: { user_tipe: UserRole }) {
  const { edditingPatientID } = useParams()
  return (
    <div className='mb-4'>
      {user_tipe === UserRole.NURSE && <PatientForm />}
      {user_tipe === UserRole.DOCTOR && <PatientForm />}
      <div className='max-w-6xl mx-auto mt-5 p-6 bg-white shadow-md rounded-md'>
        <PatientHistory patient_id={edditingPatientID} />
      </div>
    </div>
  )
}

export default PatientEdit
