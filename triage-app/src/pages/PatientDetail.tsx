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
import { getFormatBirthDate, getFormatDate } from '../helpers/HelperFechas'
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
        const data = await getPatientById(patient_id)
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

  interface Field {
    label: string
    key: keyof PatientData
    format: ((value: string) => string) | null
  }

  const patientFields: Field[] = [
    { label: t('NameLabel'), key: 'patient_name', format: null },
    { label: t('DateOfBirthLabel'), key: 'patient_age', format: getFormatBirthDate },
    { label: t('EntryTimeLabel'), key: 'patient_entry_time', format: getFormatDate },
    { label: t('TriageLevelLabel'), key: 'patient_triage_level', format: null },
    { label: t('PatientProblem'), key: 'patient_symptom', format: null },
    { label: t('PatientBoxCodeLabel'), key: 'box_code', format: null },
    { label: t('DoctorNameLabel'), key: 'doctor_name', format: null },
    { label: t('NurseNameLabel'), key: 'nurse_name', format: null },
    { label: t('PatientStatusLabel'), key: 'patient_status', format: null },

    { label: t('patient_observationsLabel'), key: 'patient_observations', format: null },
    { label: t('patient_proceduresLabel'), key: 'patient_procedures', format: null },
    { label: t('patient_recordsLabel'), key: 'patient_records', format: null }
  ]

  //------------------------------------------- Handle State Patient change ---------------------------------------------------------------

  const handlePatientStatus = (patientData: Patient | null) => {
    if (patientData && patientData.patient_status === PatientStatus.DISCHARGED) {
      SetMedicalDischarge(true)
    }
  }
  const hasNoSpecialFields = (patient: PatientData) =>
    !patient.patient_observations && !patient.patient_procedures && !patient.patient_records

  const handleMedicalDischarge = () => {
    SetMedicalDischarge(true)
    if (Patient) {
      Patient.patient_status = PatientStatus.DISCHARGED
      Patient.patient_triage_time = new Date(Patient.patient_triage_time)
      Patient.patient_entry_time = new Date(Patient.patient_entry_time)
      Patient.patient_age = new Date(Patient.patient_age)
      Patient.patient_exit_time = new Date()
      console.log('paciente a actualizar ')
      console.log(Patient)
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
            {patientFields.map((field) => {
              const value = Patient ? Patient[field.key] : null
              const isEmpty = value === undefined || value === null || value === ''

              // Check if this field is part of the patient_observations, patient_procedures, or patient_records group
              if (
                ['patient_observations', 'patient_procedures', 'patient_records'].includes(
                  field.key
                )
              ) {
                return null // We handle these fields separately below
              }

              return (
                <li key={field.label} className='flex items-start'>
                  <span className='font-semibold mr-2'>{field.label}:</span>
                  <span className='flex-1'>
                    {Patient
                      ? field.format
                        ? field.format(String(value))
                        : isEmpty
                        ? t('NoDataLabel') // Fallback for empty fields
                        : String(value)
                      : null}
                  </span>
                </li>
              )
            })}

            {/* Custom logic for patient_observations, patient_procedures, and patient_records */}
            {['patient_observations', 'patient_procedures', 'patient_records'].every(
              (key) => !Patient || !Patient[key]
            ) ? (
              <li className='flex items-start text-red-500 font-semibold'>
                {t('NoShiftChangesMessage')}
              </li>
            ) : (
              <>
                <li className='flex items-start text-blue-500 font-semibold'>
                  {t('ShiftChangeInfoMessage')}
                </li>
                {['patient_observations', 'patient_procedures', 'patient_records'].map((key) => (
                  <li key={key} className='flex items-start'>
                    <span className='font-semibold mr-2'>{t(`${key}Label`)}:</span>
                    <span className='flex-1'>
                      {Patient ? String(Patient[key] || t('NoDataLabel')) : null}
                    </span>
                  </li>
                ))}
              </>
            )}
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
      {/* 
      {showMedicalDischarge && <PatientInformIA Patient={Patient} />} */}

      <PatientHistory patient_id={patient_id} />
    </div>
  )
}

export default PatientDetail
