import { useState, useEffect } from 'react'
import { Patient, PatientStatus } from '../../interfaces/Patinet'
import { updatePatient } from '@/services/patientService'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faRightFromBracket } from '@fortawesome/free-solid-svg-icons'
import { Button } from '@/components/ui'
import Select from 'react-select'
import { useTranslation } from 'react-i18next'
import { getAllDoctors, getAllNurses } from '@/services/userService'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '@/redux/store/store.ts'
import {
  setDoctorSelections,
  setNurseSelections,
  setRXObservations,
  setRXProcedures,
  setRXRecord
} from '@/redux/slices/shiftSelectionsSlice.ts'
import { PartialUser } from '@/interfaces/User'

interface PropsPatientItem {
  patient: Patient
  setNewDoctor?: (_id: number) => void
  setNewNurse?: (_id: number) => void
  index: number
  mode: string
  lastDoctor?: { value: string; label: string }
  lastNurse?: { value: string; label: string }
  NochangeInDocOrNurse: boolean
  NochangeInObserservationsProceduresOrRecords: boolean
}

function PatientItemShiftExchange({
  patient,
  index,
  NochangeInDocOrNurse,
  NochangeInObserservationsProceduresOrRecords
}: PropsPatientItem) {
  const [doctorOptions, setDoctorOptions] = useState([])
  const [nurseOptions, setNurseOptions] = useState([])
  const [observations, setObservations] = useState('')
  const [procedures, setProcedures] = useState('')
  const [record, setRecord] = useState('')
  const [patientToDischarge, setPatientToDischarge] = useState<Patient | null>(null)
  const dispatch = useDispatch()

  const { t } = useTranslation('PatientList')
  const selectedDoctors = useSelector((state: RootState) => state.shiftSelections.doctorSelections)
  const selectedNurses = useSelector((state: RootState) => state.shiftSelections.nurseSelections)

  //TODO: ver de borrar estos state para evitar hacer 3 request cuando puede ser solo 1
  const [DoctorListForId, setDoctorListForId] = useState<PartialUser[]>([])
  const [NurseListForId, setNurseListForId] = useState<PartialUser[]>([])

  const {
    patient_id,
    patient_name,
    patient_triage_level,
    patient_status,
    doctor_name,
    nurse_name,
    doctor_id,
    nurse_id
  } = patient

  const isOdd = index % 2 !== 0
  const bgClass = isOdd ? 'bg-white' : 'bg-gray-100'
  const errBack = 'bg-red-100'
  const errLine = 'border-red-500 border-2 rounded-md '
  const handleSelection = (
    patient_id: string, // Asegúrate de pasar `patient_id` como argumento
    selectedOption: { value: string; label: string } | null,
    type: 'doctor' | 'nurse',
    lastDoctor_name?: string,
    lastNurse_name?: string
  ) => {
    console.log('selected option:', selectedOption)

    console.log('patient data item', patient)
    //obtener el id del doctor y enfermero
    const lastDoctor_id = DoctorListForId.find(
      (doctor) => doctor.user_name === lastDoctor_name
    )?.user_id
    const lastNurse_id = NurseListForId.find((nurse) => nurse.user_name === lastNurse_name)?.user_id

    if (selectedOption) {
      if (type === 'doctor') {
        dispatch(
          setDoctorSelections({
            patient_id,
            previousValue: lastDoctor_id,
            newValue: selectedOption.value
          })
        )
      } else if (type === 'nurse') {
        dispatch(
          setNurseSelections({
            patient_id,
            previousValue: lastNurse_id,
            newValue: selectedOption.value
          })
        )
      }
    }
  }

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const [doctors, nurses] = await Promise.all([getAllDoctors(), getAllNurses()])

        setDoctorListForId(doctors)
        setNurseListForId(nurses)
        const formattedDoctors = doctors.map((doctor) => ({
          value: doctor.user_id,
          label: doctor.user_name
        }))

        const formattedNurses = nurses.map((nurse) => ({
          value: nurse.user_id,
          label: nurse.user_name
        }))

        const filteredDoctors = formattedDoctors.filter((doctor) => doctor.value !== doctor_name)

        const filteredNurses = formattedNurses.filter((nurse) => nurse.value !== nurse_name)

        setDoctorOptions(filteredDoctors)
        setNurseOptions(filteredNurses)
      } catch (error) {
        console.error('Error fetching doctors or nurses', error)
      }
    }

    fetchOptions()
  }, [])

  const handleFastDischarge = (id: string) => {
    console.log('fast Discharge in process ' + id)
    setPatientToDischarge(patient)
  }

  const handleObservationChange = (patient_id: string, value: string) => {
    setObservations(value)
    dispatch(
      setRXObservations({
        patient_id,
        previousValue: '',
        newValue: value
      })
    )
  }

  const handleProceduresChange = (patient_id: string, value: string) => {
    setProcedures(value)
    dispatch(
      setRXProcedures({
        patient_id,
        previousValue: '',
        newValue: value
      })
    )
  }

  const handleRecordChange = (patient_id: string, value: string) => {
    setRecord(value)
    dispatch(
      setRXRecord({
        patient_id,
        previousValue: '',
        newValue: value
      })
    )
  }
  const handleConfirmFastDischarge = () => {
    console.log('Alta confirmada')
    setPatientToDischarge(null)
    if (patient) {
      patient.patient_status = PatientStatus.DISCHARGED
      updatePatient(patient.patient_id, patient)
    } else {
      console.log('Error en dar de ALTA al paciente')
    }
  }

  return (
    <tr className={`${NochangeInDocOrNurse ? errBack : bgClass}`}>
      <td className='border text-sm overflow-hidden text-center'>{patient_name}</td>
      <td className='border p-2  text-center hidden lg:table-cell '>{doctor_name}</td>
      <td className='border p-2 table-cell text-center hidden lg:table-cell'>{nurse_name}</td>
      <td
        className={`border p-4 table-cell text-center ${NochangeInDocOrNurse ? errLine : bgClass}`}
      >
        <Select
          className={`w-full text-black `}
          options={doctorOptions}
          placeholder='Selec. doctor/a'
          closeMenuOnSelect={true}
          value={
            selectedDoctors[patient_id]?.newValue
              ? doctorOptions.find(
                  (option) => option.value === selectedDoctors[patient_id]?.newValue
                )
              : null
          }
          onChange={(selectedOption) =>
            handleSelection(patient_id, selectedOption, 'doctor', doctor_name, nurse_name)
          }
        />

        {NochangeInDocOrNurse && <span className='text-red-500 pt-2'>{t('DoctorOrNurse')}</span>}
      </td>

      <td
        className={`border p-4 table-cell text-center ${NochangeInDocOrNurse ? errLine : bgClass}`}
      >
        <Select
          className='w-full text-black'
          options={nurseOptions}
          placeholder='Selec. enfermero/a'
          closeMenuOnSelect={true}
          value={
            selectedNurses[patient_id]?.newValue
              ? nurseOptions.find((option) => option.value === selectedNurses[patient_id]?.newValue)
              : null
          }
          onChange={(selectedOption) =>
            handleSelection(patient_id, selectedOption, 'nurse', doctor_name, nurse_name)
          }
        />

        {NochangeInDocOrNurse && <span className='text-red-500 pt-2'>{t('DoctorOrNurse')}</span>}
      </td>
      <td
        className={` bg-white border text-sm text-center hidden lg:table-cell ${
          NochangeInObserservationsProceduresOrRecords ? errLine : bgClass
        }`}
      >
        <input
          type='text'
          placeholder='Escribe...'
          className='py-8 ps-2  text-start'
          value={observations}
          onChange={(e) => handleObservationChange(patient_id, e.target.value)}
        />

        {NochangeInObserservationsProceduresOrRecords && (
          <div className='text-red-500 mt-2'>
            {t('NochangeInObserservationsProceduresOrRecords')}
          </div>
        )}
      </td>
      <td
        className={` bg-white border text-sm text-center hidden lg:table-cell ${
          NochangeInObserservationsProceduresOrRecords ? errLine : bgClass
        }`}
      >
        <input
          type='text'
          placeholder='Escribe...'
          className='py-8 ps-2 text-start'
          value={procedures}
          onChange={(e) => handleProceduresChange(patient_id, e.target.value)}
        />

        {NochangeInObserservationsProceduresOrRecords && (
          <div className='text-red-500 mt-2'>
            {t('NochangeInObserservationsProceduresOrRecords')}
          </div>
        )}
      </td>
      <td
        className={` bg-white border text-sm text-center hidden lg:table-cell ${
          NochangeInObserservationsProceduresOrRecords ? errLine : bgClass
        }`}
      >
        <input
          type='text'
          placeholder='Escribe...'
          className='py-8 ps-2  text-start'
          value={record}
          onChange={(e) => handleRecordChange(patient_id, e.target.value)}
        />

        {NochangeInObserservationsProceduresOrRecords && (
          <div className='text-red-500 mt-2'>
            {t('NochangeInObserservationsProceduresOrRecords')}
          </div>
        )}
      </td>
      <td className='border p-2'>
        <div className='flex gap-2'>
          {patient_status !== 'ALTA' ? (
            <Button wfull color='red' onClick={() => handleFastDischarge(patient_id)}>
              <FontAwesomeIcon icon={faRightFromBracket} />
            </Button>
          ) : (
            <Button wfull color='grey_disabled' disabled>
              <FontAwesomeIcon icon={faRightFromBracket} />
            </Button>
          )}
        </div>
        {patientToDischarge?.patient_id === patient_id && (
          <div className='fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-35'>
            <div className='bg-white p-8 rounded-lg'>
              <div className='text-center'>
                Confirmar alta de paciente <strong>{patientToDischarge.patient_name}</strong>?
              </div>
              <div className='flex justify-center mt-4 gap-2'>
                <Button color='red' onClick={handleConfirmFastDischarge}>
                  Confirmar
                </Button>
                <Button color='grey' onClick={() => setPatientToDischarge(null)}>
                  Cancelar
                </Button>
              </div>
            </div>
          </div>
        )}
      </td>
    </tr>
  )
}

export default PatientItemShiftExchange
