import { Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { Patient } from '../../interfaces/Patinet'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPenToSquare } from '@fortawesome/free-solid-svg-icons'
import { faCircleInfo } from '@fortawesome/free-solid-svg-icons'
import { faRightFromBracket } from '@fortawesome/free-solid-svg-icons'
import { Button } from '@/components/ui'

interface PropsPatientItem {
  patient: Patient
  index: number
}

function PatientItem({ patient, index }: PropsPatientItem) {
  const [age, setAge] = useState<number | null>(null)
  const [entryTime, setEntryTime] = useState<string | null>(null)

  const {
    patient_id,
    patient_name,
    patient_age,
    patient_entry_time,
    patient_triage_level,
    box_code,
    patient_status,
    patient_symptom,
    doctor_name,
    nurse_name
  } = patient

  const isOdd = index % 2 !== 0

  const bgClass = isOdd ? 'bg-white' : 'bg-gray-100'

  const TriageLevels = [
    { _id: 1, name: 'I', color: '153, 153, 153' },
    { _id: 2, name: 'II', color: '255,51,0' },
    { _id: 3, name: 'III', color: '255,255,102' },
    { _id: 4, name: 'IV', color: '105,168,79' }
  ]

  const getBackgroundColor = (id: number) => {
    const triageLevel = TriageLevels.find((level) => level._id === id)
    return triageLevel ? `rgb(${triageLevel.color}, 0.6)` : 'transparent'
  }

  useEffect(() => {
    const birthDate = new Date(patient_age)
    const actualDate = new Date()
    setAge(actualDate.getFullYear() - birthDate.getFullYear())
    const fechaOriginal = new Date(patient_entry_time)
    const dateFormat: Intl.DateTimeFormatOptions = {
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
    <tr className={bgClass}>
      <td className={`border text-sm overflow-hidden text-center `}>{patient_name}</td>
      <td className='border p-2 hidden lg:table-cell text-center'>{age}</td>
      <td className='border p-2 hidden lg:table-cell text-center'>{entryTime}</td>
      <td
        className={`border md:p-2 text-center `}
        style={{ backgroundColor: getBackgroundColor(Number(patient_triage_level)) }}
      >
        {patient_triage_level}
      </td>
      <td className='border p-2 hidden lg:table-cell text-center'>{patient_symptom}</td>
      <td className='border md:p-2 text-center'>{box_code}</td>
      <td className='border p-2 hidden lg:table-cell text-center'>{doctor_name}</td>
      <td className='border p-2 hidden lg:table-cell text-center'>{nurse_name}</td>
      <td className='border text-sm md:p-2 text-center'>{patient_status}</td>
      <td className='border p-2'>
        <div className='flex gap-2'>
          <div>
            <div className='mb-2'>
              <Link to={`/edit_patient/${patient_id}`}>
                <Button wfull color='green'>
                  <FontAwesomeIcon icon={faPenToSquare} />
                </Button>
              </Link>
            </div>
            <div>
              <Link to={`/patients/${patient_id}`}>
                <Button wfull color='green'>
                  <FontAwesomeIcon icon={faCircleInfo} />
                </Button>
              </Link>
            </div>
          </div>
          <Button wfull color='red'>
            <FontAwesomeIcon icon={faRightFromBracket} />
          </Button>
        </div>
      </td>
    </tr>
  )
}

export default PatientItem
