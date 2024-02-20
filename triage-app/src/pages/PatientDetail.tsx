import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Patient, PatientStatus, PatientData } from '@/interfaces/Patinet'
import { getPatientById } from '@/services/patientService'
import { updatePatient } from '@/services/patientService'
import { consulta } from '@/services/openai-test'
import { Button } from '@/components/ui'
import LoaderSpin from '@/components/LoaderSpin'

const solicitud =
  'Toma el rol de un médico cardiólogo que escribe de forma resumida las evoluciones de sus pacientes. Crea un resumen de 5 líneas en primera persona del singular. Muy resumido. Únicamente puntos importantes:  Paciente masculino 47 años Trabaja en comercio  Antec: IAM con SDST 2021. PTCA a ADA prox con un DES. FE 40%. Hipertensión arterial, Hipotiroidismo, Insulinoresistencia, Alergias: -, Tabaco: -  AAFF: Hermano IAM reciente  Medicamentos: AAS 100x1, Clop 75x1, Atorvastatina 20x4, Eutirox 75, bisoprolol 2.5x1, espironolactona 12.5x1, Metformina XR 750x1, Clotiazepam 5x1, Ezetimibe 10x1, Setralina 50x1,Hospitalizacion reciente por COVID Desde el alta con dolor torácico, constanteAl examen: EVA 0/10 PA 100/60 FC 80  Yug planas, sin soplos carotideos  RR2TSS  MP+SRA  Abd: BDI, no palpo masas ni visceromegalias, Ao impresiona de tamaño normal  Piel tibia a distal sin edema, pulsos simétricosPlan: Suspender clopidogrel Eco y test esfuerzo Control con resultado. Ahora cambia lo que creas necesario por la informacion de este paciente:'
function PatientDetail() {
  const { patient_id } = useParams()
  const navigate = useNavigate()
  const [Patient, setPatient] = useState<PatientData | null>(null)
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
    if (requestInfo) {
      setInform(requestInfo)
    } else {
      console.error('Element with class "text-gray-700" not found')
    }
  }
  interface Field {
    label: string
    key: keyof PatientData
    format: ((value: string) => string) | null
  }

  const patientFields: Field[] = [
    { label: 'Patient Name', key: 'patient_name', format: null },
    { label: 'Date of Birth', key: 'date_of_birth', format: getFormatBirthDate },
    { label: 'Entry Time', key: 'entry_time', format: getFormatEntryDate },
    { label: 'Triage Level', key: 'patient_triage_level', format: null },
    { label: 'Patient Medication', key: 'patient_medication', format: null },
    { label: 'Patient Problem', key: 'patient_problem', format: null },
    { label: 'Box ID', key: 'box_code', format: null },
    { label: 'Doctor Name', key: 'doctor_name', format: null },
    { label: 'Nurse Name', key: 'nurse_name', format: null },
    { label: 'Patient Status', key: 'patient_status', format: null }
  ]
  return (
    <div className='max-w-5xl mx-auto mt-5 p-6 bg-white shadow-md rounded-md'>
      <div className='flex justify-between items-center mb-4'>
        <h2 className='text-2xl font-bold'>Patient Details </h2>
        <Button color='green' onClick={handleGoBack}>
          Back
        </Button>
      </div>
      {
        <ul className='list-disc pl-4'>
          {patientFields.map((field) => (
            <li key={field.label}>
              <strong>{field.label}:</strong>{' '}
              {Patient
                ? field.format
                  ? field.format(String(Patient[field.key]))
                  : Patient[field.key]
                : null}
            </li>
          ))}
        </ul>
      }
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
                {loading ? (
                  <div className='flex justify-center items-center'>
                    <LoaderSpin />
                  </div>
                ) : (
                  <p className='text-gray-700' id='request-info'>
                    {Inform}
                  </p>
                )}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  )
}

export default PatientDetail
