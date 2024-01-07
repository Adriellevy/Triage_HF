import { Link } from 'react-router-dom'
import { Patient } from '../interfaces/Patinets'

interface PropsPatientItem {
  patient: Patient
  onDelete: (patient_id: string) => void
  onViewDetails: (patient: Patient) => void
}

function PatientItem({ patient, onDelete, onViewDetails }: PropsPatientItem) {
  const {
    patient_name,
    patient_id,
    date_of_birth,
    entry_time,
    patient_triage_level,
    patient_medication,
    patient_problem,
    box_id,
    doctor_name,
    nurse_name,
    patient_status
  } = patient
  return (
    <tr>
      <td className='border p-2'>{patient_name}</td>
      <td className='border p-2'>{date_of_birth}</td>
      <td className='border p-2'>{entry_time}</td>
      <td className='border p-2'>{patient_triage_level}</td>
      <td className='border p-2'>{patient_medication}</td>
      <td className='border p-2'>{patient_problem}</td>
      <td className='border p-2'>ID:{box_id}</td>
      <td className='border p-2'>{doctor_name}</td>
      <td className='border p-2'>{nurse_name}</td>
      <td className='border p-2'>{patient_status}</td>
      <td className='border p-2'>
        <button
          onClick={() => onViewDetails(patient)}
          className='bg-green-500 text-white p-2 mt-2 rounded-md w-full'
        >
          Details modal
        </button>
        <Link to={`/patients/${patient_id}`}>
          <button className='bg-green-500 text-white p-2 mt-2 rounded-md w-full'>
            Details page
          </button>
        </Link>
      </td>
    </tr>
  )
}

export default PatientItem
