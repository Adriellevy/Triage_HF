import { Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { Patient } from '../interfaces/Patinet'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPenToSquare } from '@fortawesome/free-solid-svg-icons';
import { faCircleInfo } from '@fortawesome/free-solid-svg-icons';

interface PropsPatientItem {
  patient: Patient
  onDelete: (patient_id: string) => void
  onViewDetails: (patient: Patient) => void
}

function PatientItem({ patient, onViewDetails }: PropsPatientItem) {
  const [age, setAge] = useState<number | null>(null)
  const [entryTime, setEntryTime] = useState<string | null>(null)

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

  useEffect(() => {
    const birthDate = new Date(date_of_birth)
    const actualDate = new Date()
    setAge(actualDate.getFullYear() - birthDate.getFullYear())

    const fechaOriginal = new Date(patient.entry_time)

    //format options
    const dateFormat = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      // second: 'numeric',
      hour12: true
    }
    const formatoFechaHora = new Intl.DateTimeFormat('es-ES', dateFormat)
    const fechaFormateada = formatoFechaHora.format(fechaOriginal)
    setEntryTime(fechaFormateada)
  }, [])

  return (
    <tr className='w-full'>
      <td className={`border text-sm overflow-hidden text-center `}>{patient_name}</td>
      <td className='border p-2 hidden lg:table-cell text-center'>{age}</td>
      <td className='border p-2 hidden lg:table-cell text-center'>{entryTime}</td>
      <td className='border md:p-2 text-center'>{patient_triage_level}</td>
      <td className='border p-2 hidden lg:table-cell text-center'>{patient_medication}</td>
      <td className='border p-2 hidden lg:table-cell text-center'>{patient_problem}</td>
      <td className='border md:p-2 text-center'>ID:{box_id}</td>
      <td className='border p-2 hidden lg:table-cell text-center'>{doctor_name}</td>
      <td className='border p-2 hidden lg:table-cell text-center'>{nurse_name}</td>
      <td className='border text-sm md:p-2 text-center'>{patient_status}</td>
      <td className='border p-2'>
        <button
          onClick={() => onViewDetails(patient)}
          className='bg-green-500 text-white md:p-2 md:mt-2 rounded-md w-full'
        >
          <FontAwesomeIcon icon={faPenToSquare} />
        </button>
        <Link to={`/patients/${patient_id}`}>
          <button className='bg-green-500 text-white p-2 mt-2 rounded-md w-full'>
          <FontAwesomeIcon icon={faCircleInfo} />
          </button>
        </Link>
      </td>
    </tr>
  )
}

export default PatientItem
