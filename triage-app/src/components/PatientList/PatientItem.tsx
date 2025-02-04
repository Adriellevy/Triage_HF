import { Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { Patient, PatientStatus } from '../../interfaces/Patinet'
import { TriageLevel } from '../../interfaces/TriageLevel'
import { updatePatient } from '@/services/patientService'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPenToSquare, faCircleInfo, faRightFromBracket } from '@fortawesome/free-solid-svg-icons'
import { Button } from '@/components/ui'
import { getAllTriages } from '@/services/triageLevelsService'

interface PropsPatientItem {
  patient: Patient
  index: number
  turnExchange: boolean
  newDoctor: string
  newNurse: string
}

function PatientItem({ patient, index, turnExchange, newDoctor, newNurse }: PropsPatientItem) {
  const [age, setAge] = useState<number | null>(null)
  const [entryTime, setEntryTime] = useState<string | null>(null)
  const [TriageLevels, setTriageLevel] = useState<TriageLevel[]>([])
  const [patientToDischarge, setPatientToDischarge] = useState<Patient | null>(null)

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

  const getBackgroundColor = (triageLevel: string) => {
    const level = TriageLevels.find((t) => t.level === triageLevel)
    return level ? `rgb(${level.color}, 0.6)` : 'transparent'
  }

  useEffect(() => {
    const birthDate = new Date(patient_age)
    setAge(new Date().getFullYear() - birthDate.getFullYear())

    const formattedDate = new Intl.DateTimeFormat('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      hour12: true
    }).format(new Date(patient_entry_time))

    setEntryTime(formattedDate)
  }, [])

  useEffect(() => {
    const fetchTriageLevels = async () => {
      try {
        const response = await getAllTriages()
        if (response.success && response.data) {
          setTriageLevel(response.data)
        } else {
          console.error('Error al obtener niveles de triaje:', response.message)
        }
      } catch (error) {
        console.error('Error desconocido al obtener niveles de triaje:', error)
      }
    }
    fetchTriageLevels()
  }, [])

  const handleFastDischarge = () => setPatientToDischarge(patient)
  const handleConfirmFastDischarge = () => {
    setPatientToDischarge(null)
    if (patient) {
      patient.patient_status = PatientStatus.DISCHARGED
      updatePatient(patient.patient_id, patient)
    } else {
      console.log('Error en dar de ALTA al paciente')
    }
  }

  return (
    <>
      <tr className={`hover:bg-gray-100 border-b`}>
        <td className="p-3 text-center">{patient_name}</td>
        {!turnExchange && (
          <>
            <td className="p-3 hidden lg:table-cell text-center">{age}</td>
            <td className="p-3 hidden lg:table-cell text-center">{entryTime}</td>
            <td className="p-3 text-center" style={{ backgroundColor: getBackgroundColor(patient_triage_level) }}>
              {patient_triage_level}
            </td>
            <td className="p-3 hidden lg:table-cell text-center">{patient_symptom}</td>
            <td className="p-3 hidden lg:table-cell text-center">{box_code}</td>
            <td className="p-3 hidden lg:table-cell text-center">{doctor_name}</td>
            <td className="p-3 hidden lg:table-cell text-center">{nurse_name}</td>
            <td className="p-3 text-center font-medium">{patient_status}</td>
          </>
        )}
        {turnExchange && (
          <>
            <td className="p-3 hidden lg:table-cell text-center">
              {doctor_name} {newDoctor && `-> ${newDoctor}`}
            </td>
            <td className="p-3 hidden lg:table-cell text-center">
              {nurse_name} {newNurse && `-> ${newNurse}`}
            </td>
            <td className="p-3 text-center" style={{ backgroundColor: getBackgroundColor(patient_triage_level) }}>
              {patient_triage_level}
            </td>
          </>
        )}
        <td className="p-3">
          <div className="flex justify-center gap-2">
            <Link to={`/edit_patient/${patient_id}`}>
              <Button color="green">
                <FontAwesomeIcon icon={faPenToSquare} />
              </Button>
            </Link>
            <Link to={`/patients/${patient_id}`}>
              <Button color="blue">
                <FontAwesomeIcon icon={faCircleInfo} />
              </Button>
            </Link>
            {patient_status !== 'ALTA' ? (
              <Button color="red" onClick={handleFastDischarge}>
                <FontAwesomeIcon icon={faRightFromBracket} />
              </Button>
            ) : (
              <Button color="gray" disabled>
                <FontAwesomeIcon icon={faRightFromBracket} />
              </Button>
            )}
          </div>
        </td>
      </tr>

      {patientToDischarge?.patient_id === patient_id && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-35">
          <div className="bg-white p-6 rounded-lg shadow-lg text-center w-80">
            <p className="text-lg font-medium">
              Confirmar alta de <strong>{patientToDischarge.patient_name}</strong>?
            </p>
            <div className="flex justify-center mt-4 gap-3">
              <Button color="red" onClick={handleConfirmFastDischarge}>
                Confirmar
              </Button>
              <Button color="gray" onClick={() => setPatientToDischarge(null)}>
                Cancelar
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default PatientItem
