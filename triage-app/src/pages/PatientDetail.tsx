import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { NullablePatient, Patient, PatientStatus } from '@/interfaces/Patinet'
import { getPatientById } from '@/services/patientService'
import { updatePatient } from '@/services/patientService'
import { consulta } from '@/services/openai-test'
import { Button } from '@/components/ui'

const solicitud =
  'Toma el rol de un médico cardiólogo que escribe de forma resumida las evoluciones de sus pacientes. Crea un resumen de 5 líneas en primera persona del singular. Muy resumido. Únicamente puntos importantes:  Paciente masculino 47 años Trabaja en comercio  Antec: IAM con SDST 2021. PTCA a ADA prox con un DES. FE 40%. Hipertensión arterial, Hipotiroidismo, Insulinoresistencia, Alergias: -, Tabaco: -  AAFF: Hermano IAM reciente  Medicamentos: AAS 100x1, Clop 75x1, Atorvastatina 20x4, Eutirox 75, bisoprolol 2.5x1, espironolactona 12.5x1, Metformina XR 750x1, Clotiazepam 5x1, Ezetimibe 10x1, Setralina 50x1,Hospitalizacion reciente por COVID Desde el alta con dolor torácico, constanteAl examen: EVA 0/10 PA 100/60 FC 80  Yug planas, sin soplos carotideos  RR2TSS  MP+SRA  Abd: BDI, no palpo masas ni visceromegalias, Ao impresiona de tamaño normal  Piel tibia a distal sin edema, pulsos simétricosPlan: Suspender clopidogrel Eco y test esfuerzo Control con resultado. Ahora cambia lo que creas necesario por la informacion de este paciente:'
function PatientDetail() {
  const { patient_id } = useParams()
  const navigate = useNavigate()
  const [Patient, setPatient] = useState<NullablePatient>(null)
  const [loading, setLoading] = useState<boolean>(false)
  const [showMedicalDischarge, SetMedicalDischarge] = useState<boolean>(false)
  const [showRequestInfo, setShowRequestInfo] = useState<boolean>(false)
  const [Inform, setInform] = useState<string | null>(null)

  const handleGoBack = () => {
    navigate(-1)
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [data] = await getPatientById(patient_id)
        setPatient(data)
        handlePatientStatus(data)
      } catch (error) {
        if (error instanceof Error) {
          console.error('Error al obtener pacientes:', error.message)
        } else {
          console.error('Error desconocido al obtener pacientes:', error)
        }
      }
    }
    fetchData()
  }, [patient_id])

  const getFormatEntryDate = (entry__time: string) => {
    const entryTimeOriginal = new Date(entry__time)
    const dateFormat: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      hour12: true
    }
    const formatoFechaHora = new Intl.DateTimeFormat('es-ES', dateFormat)
    const formatEntryTime = formatoFechaHora.format(entryTimeOriginal)
    return formatEntryTime
  }

  const getFormatBirthDate = (birth__date: string) => {
    const originalBirthDate = new Date(birth__date)
    const birthFormat: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour12: true
    }
    const formatoNacimiento = new Intl.DateTimeFormat('es-ES', birthFormat)
    const formatBirthDate = formatoNacimiento.format(originalBirthDate)
    return formatBirthDate
  }

  const handlePatientStatus = (patientData: Patient | null) => {
    if (patientData && patientData.patient_status === PatientStatus.DISCHARGED) {
      SetMedicalDischarge(true)
      setShowRequestInfo(false)
    }
  }

  const handleMedicalDischarge = () => {
    SetMedicalDischarge(true)
    if (Patient) {
      Patient.patient_status = PatientStatus.DISCHARGED
      updatePatient(Patient.patient_id, Patient)
    } else {
      console.log('Error en dar de ALTA al paciente')
    }
  }
  const handleRequestButtonClick = () => {
    setShowRequestInfo(true)
    setLoading(true)
    const patientProvisional = { ...Patient }
    if (patientProvisional) {
      patientProvisional.doctor_name = ''
      patientProvisional.patient_name = ''
      patientProvisional.box_id = ''
    }
    const prompt = solicitud + patientProvisional
    handleRequestOpenAi(prompt)
  }

  const handleRequestOpenAi = async (prompt: string) => {
    const result = await consulta(prompt)
    setLoading(false)
    const requestInfo = result && result.message && result.message.content
    console.log(requestInfo)
    const requestInfoElement = document.getElementById('request-info') as HTMLElement
    if (requestInfoElement) {
      requestInfoElement.innerText = requestInfo || 'No information available'
      setInform(requestInfo)
    } else {
      console.error('Element with class "text-gray-700" not found')
    }
  }
  return (
    <div className='max-w-5xl mx-auto mt-5 p-6 bg-white shadow-md rounded-md'>
      <div className='flex justify-between items-center mb-4'>
        <h2 className='text-2xl font-bold'>Patient Details </h2>
        <Button color='green' onClick={handleGoBack}>
          Back
        </Button>
      </div>
      {Patient && (
        <ul className='list-disc pl-4'>
          <li>
            <strong>Patient Name:</strong> {Patient.patient_name}
          </li>
          <li>
            <strong>Date of Birth:</strong> {getFormatBirthDate(Patient.date_of_birth)}
          </li>
          <li>
            <strong>Entry Time:</strong> {getFormatEntryDate(Patient.entry_time)}
          </li>
          <li>
            <strong>Triage Level:</strong> {Patient.patient_triage_level}
          </li>
          <li>
            <strong>Patient Medication:</strong> {Patient.patient_medication}
          </li>
          <li>
            <strong>Patient Problem:</strong> {Patient.patient_problem}
          </li>
          <li>
            <strong>Box ID:</strong> {Patient.box_id}
          </li>
          <li>
            <strong>Doctor Name:</strong> {Patient.doctor_name}
          </li>
          <li>
            <strong>Nurse Name:</strong> {Patient.nurse_name}
          </li>
          <li>
            <strong>Patient Status:</strong> {Patient.patient_status}
          </li>
        </ul>
      )}
      <div className='flex justify-end'>
        <Button color='red' onClick={handleMedicalDischarge}>
          Medical Discharge
        </Button>
      </div>

      {showMedicalDischarge && (
        <>
          <div className='mt-4'>
            <Button color='red' onClick={handleRequestButtonClick}>
              Request Inform
            </Button>
            {showRequestInfo && (
              <div className='mt-4'>
                <h3 className={`text-lg font-bold mb-2 ${loading ? 'hidden' : ''} `}>
                  Requested Inform:
                </h3>
                <p className={`text-gray-700 ${loading ? 'hidden' : ''}`} id='request-info'>
                  {loading ? 'Loading...' : Inform || 'Not able to charge the inform'}
                </p>
                <div className={`loader-container ${loading ? '' : 'hidden'}`}>
                  <div className='loader' />
                </div>
              </div>
            )}
          </div>
          <style>
            {`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        .loader-container {
          display: flex;
          justify-content: center;
          align-items: center;
        }
        .loader {
          border: 4px solid #f3f3f3;
          border-top: 4px solid #3498db;
          border-radius: 50%;
          width: 30px;
          height: 30px;
          animation: spin 1s linear infinite;
        }

        .hidden {
          display: none;
        }
      `}
          </style>
        </>
      )}
    </div>
  )
}

export default PatientDetail
