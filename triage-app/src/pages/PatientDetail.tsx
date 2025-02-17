import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import QRCode from 'react-qr-code'
import { Patient, PatientStatus, PatientData } from '@/interfaces/Patinet'
import { Button, Label } from '@/components/ui'
import PatientHistory from '@/components/PatientHistory/PatientHistory'
// import PatientInformIA from '@/components/PatientInformIA'
import { getPatientById } from '@/services/patientService'
import { updatePatient } from '@/services/patientService'
import { getShiftChanges, getShiftById } from '@/services/ShiftService'
import { Shift } from '@/interfaces/Shift'
import { ShiftChange } from '@/interfaces/Shift-change'
import { useTranslation } from 'react-i18next'
import { getFormatBirthDate, getFormatDate } from '../helpers/HelperFechas'
import ShiftChangeList from '@/components/ShiftChangeList/ShiftChangeList'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronDown, faChevronRight } from '@fortawesome/free-solid-svg-icons'

function PatientDetail() {
  const { t } = useTranslation('PatientDetail')
  const { patient_id } = useParams()
  const navigate = useNavigate()
  const [Patient, setPatient] = useState<PatientData | null>(null)
  const [showMedicalDischarge, SetMedicalDischarge] = useState<boolean>(false)
  const [shiftChanges, setShiftChanges] = useState<ShiftChange[]>([])
  const [shifts, setShifts] = useState<Shift[]>([])
  const [expandedShiftId, setExpandedShiftId] = useState<string | null>(null)
  const isPatientStatusAlta = Patient?.patient_status !== PatientStatus.DISCHARGED

  const handleGoBack = () => {
    navigate(-1)
  }

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

  useEffect(() => {
    const fetchShiftChanges = async () => {
      try {
        const changes = await getShiftChanges(patient_id)
        setShiftChanges(changes)
        const uniqueShiftIds = Array.from(
          new Set(changes.map((change) => change.shift_id.toString()))
        )
        const shiftPromises = uniqueShiftIds.map((shiftId) => getShiftById(shiftId))
        const shiftsData = await Promise.all(shiftPromises)
        setShifts(shiftsData.map((data) => data.shift)) // Desestructurar aquí
      } catch (error) {
        console.error('Error fetching shift changes:', error)
      }
    }
    fetchShiftChanges()
  }, [patient_id])

  const toggleExpand = (id: string) => {
    setExpandedShiftId(expandedShiftId === id ? null : id)
  }

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

  const handlePatientStatus = (patientData: Patient | null) => {
    if (patientData && patientData.patient_status === PatientStatus.DISCHARGED) {
      SetMedicalDischarge(true)
    }
  }

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

              if (
                ['patient_observations', 'patient_procedures', 'patient_records'].includes(
                  field.key
                )
              ) {
                return null
              }

              return (
                <li key={field.label} className='flex items-start'>
                  <span className='font-semibold mr-2'>{field.label}:</span>
                  <span className='flex-1'>
                    {Patient
                      ? field.format
                        ? field.format(String(value))
                        : isEmpty
                        ? t('NoDataLabel')
                        : String(value)
                      : null}
                  </span>
                </li>
              )
            })}

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
      {shiftChanges.length > 0 && (
        <div className='mt-4 p-4 bg-white shadow-md rounded-md'>
          <div className='flex justify-between items-center mb-4'>
            <h3 className='text-xl font-bold'>{t('Shift Changes')}</h3>
            <Button
              onClick={() => toggleExpand('shiftChanges')}
              variant='ghost'
              className='flex items-center'
            >
              {expandedShiftId === 'shiftChanges' ? t('Hide') : t('Show')}
              <FontAwesomeIcon
                icon={expandedShiftId === 'shiftChanges' ? faChevronDown : faChevronRight}
                className='ml-2 text-gray-600'
              />
            </Button>
          </div>
          {expandedShiftId === 'shiftChanges' && (
            <div className='mt-4 overflow-x-auto'>
              {shifts.map((shift) => (
                <div key={shift.id} className='mb-4'>
                  <h4 className='text-lg font-semibold'>
                    {t('Shift on:')} {new Date(shift.shift_day).toLocaleDateString()} {t('from')}{' '}
                    {shift.shift_end_time}
                    {'hrs'}
                  </h4>
                  <ShiftChangeList
                    shift_id={shift.id}
                    shiftChanges={shiftChanges.filter((change) => change.shift_id === shift.id)}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      )}
      <div className='mt-4 p-4 bg-white shadow-md rounded-md'>
        <div className='flex justify-between items-center mb-4'>
          <h3 className='text-xl font-bold'>{t('Patient History')}</h3>
          <Button
            onClick={() => toggleExpand('patientHistory')}
            variant='ghost'
            className='flex items-center'
          >
            {expandedShiftId === 'patientHistory' ? t('Hide') : t('Show')}
            <FontAwesomeIcon
              icon={expandedShiftId === 'patientHistory' ? faChevronDown : faChevronRight}
              className='ml-2 text-gray-600'
            />
          </Button>
        </div>
        {expandedShiftId === 'patientHistory' && <PatientHistory patient_id={patient_id} />}
      </div>
    </div>
  )
}

export default PatientDetail
