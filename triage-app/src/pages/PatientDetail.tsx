import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import QRCode from 'react-qr-code'
import { Patient, PatientStatus, PatientData } from '@/interfaces/Patinet'
import { Button, Label } from '@/components/ui'
import PatientHistory from '@/components/PatientHistory/PatientHistory'
import PatientInformIA from '@/components/PatientInformIA'
import { getPatientById } from '@/services/patientService'
import { updatePatient } from '@/services/patientService'
import { useTranslation } from 'react-i18next'

function PatientDetail() {
  const { t } = useTranslation('PatientDetail')
  const { patient_id } = useParams()
  const navigate = useNavigate()
  const [Patient, setPatient] = useState<PatientData | null>(null)
  const [showMedicalDischarge, SetMedicalDischarge] = useState<boolean>(false)
  const isPatientStatusAlta = Patient?.patient_status !== PatientStatus.DISCHARGED

  const handleGoBack = () => {
    navigate(-1)
  }
  //------------------------------------------- Our Api Get Patient  --------------------------------------------------------------------------------------

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

  //------------------------------------------------------  Formating Patient -----------------------------------------------------------------------------

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

  interface Field {
    label: string
    key: keyof PatientData
    format: ((value: string) => string) | null
  }

  const patientFields: Field[] = [
    { label: t('NameLabel'), key: 'patient_name', format: null },
    { label: t('DateOfBirthLabel'), key: 'patient_age', format: getFormatBirthDate },
    { label: t('EntryTimeLabel'), key: 'patient_entry_time', format: getFormatEntryDate },
    { label: t('TriageLevelLabel'), key: 'patient_triage_level', format: null },
    { label: t('PatientProblem'), key: 'patient_symptom', format: null },
    { label: t('PatientBoxCodeLabel'), key: 'box_code', format: null },
    { label: t('DoctorNameLabel'), key: 'doctor_name', format: null },
    { label: t('NurseNameLabel'), key: 'nurse_name', format: null },
    { label: t('PatientStatusLabel'), key: 'patient_status', format: null }
  ]

  //------------------------------------------- Handle State Patient change ---------------------------------------------------------------

  const handlePatientStatus = (patientData: Patient | null) => {
    if (patientData && patientData.patient_status === PatientStatus.DISCHARGED) {
      SetMedicalDischarge(true)
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

  return (
    <div className='max-w-6xl mx-auto mt-5 mb-5 p-6 bg-white shadow-md rounded-md'>
      <div className='flex justify-between items-center mb-4'>
        <h2 className='text-2xl font-bold'>{t('title')}</h2>
        <Button color='red' onClick={handleGoBack}>
          {t('BackButton')}
        </Button>
      </div>
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4'>
        <div>
          <ul className='list-disc pl-4 space-y-2'>
            {patientFields.map((field) => (
              <li key={field.label} className='flex items-start'>
                <span className='font-semibold mr-2'>{field.label}:</span>
                <span className='flex-1'>
                  {Patient
                    ? field.format
                      ? field.format(String(Patient[field.key]))
                      : Patient[field.key]
                    : null}
                </span>
              </li>
            ))}
          </ul>
        </div>
        <div className='flex items-center'>
          <div className='mx-auto w-full max-w-48 '>
            <QRCode
              size={256}
              style={{ height: 'auto', maxWidth: '100%', width: '100%' }}
              value={`${import.meta.env.VITE_NETWORK_APP_URL}/patients/${patient_id}`}
              viewBox={`0 0 256 256`}
            />
            <div className='text-center mt-1'>
              <Label>{t('QRLabel')}</Label>
            </div>
          </div>
        </div>
      </div>
      {isPatientStatusAlta ? (
        <div className='mt-4 mb-4 justify-end flex'>
          <Button color='red' onClick={handleMedicalDischarge}>
            {t('DischargeButton')}
          </Button>
        </div>
      ) : null}

      {showMedicalDischarge && <PatientInformIA Patient={Patient} />}

      <PatientHistory patient_id={patient_id} />
    </div>
  )
}

export default PatientDetail
