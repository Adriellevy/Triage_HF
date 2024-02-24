/* eslint-disable @typescript-eslint/no-unused-vars */
import { Patient } from '@/interfaces/Patinet'
import { toast } from 'sonner'
import { User } from '@/interfaces/User'
import { Box } from '@/interfaces/Boxes'
import { addNewPatient, updateAnyPatient } from '@/services/patientService'
import { getAllDoctors, getAllNurses } from '@/services/userService'
import { getAvailableBoxes, getAllBoxes } from '@/services/boxService'
import { useEffect, useState } from 'react'
import Cookies from 'js-cookie'
import { Button, Input, Label, Select } from '@/components/ui'
import { DatePickerMUI } from './DatePickerMUI'
import { Link, useParams } from 'react-router-dom'
import { getPatientById } from '@/services/patientService'
import dayjs from 'dayjs'
import { useNavigate } from 'react-router-dom'

function NewPatientForm() {
  const [BoxesOptions, setBoxesOptions] = useState<Box[] | null>(null)
  const [DoctorOptions, setDoctorOptions] = useState<User[] | null>(null)
  const [NurseOptions, setNurseOptions] = useState<User[] | null>(null)

  const navigate = useNavigate()

  // Edit states
  const { edditingPatientID } = useParams()
  const [edditingPatient, setedditingPatient] = useState<Patient | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [data] = await getPatientById(edditingPatientID)
        setedditingPatient(data)
      } catch (error) {
        if (error instanceof Error) {
          console.error('Error al obtener pacientes:', error.message)
        } else {
          console.error('Error desconocido al obtener pacientes:', error)
        }
      }
    }
    edditingPatientID && fetchData() //Only runs if params exists
  }, [edditingPatientID])

  useEffect(() => {
    //Only runs in edit mode
    const asFun = async () => {
      try {
        const docs = await getAllDoctors()
        const nurses = await getAllNurses()
        const boxes = await getAvailableBoxes()
        const allBoxes = await getAllBoxes()
        setDoctorOptions(docs)
        setNurseOptions(nurses)
        setBoxesOptions(boxes)
        const doctor = docs?.find((doctor) => doctor.user_name === edditingPatient?.doctor_name)
        formData.doctor_id = doctor ? doctor.user_id : ''
        const nurse = nurses?.find((nurse) => nurse.user_name === edditingPatient?.nurse_name)
        formData.nurse_id = nurse ? nurse.user_id : ''
        const box = allBoxes?.find((box) => box.box_code === edditingPatient?.box_code)
        formData.box_id = box ? box.box_id : ''
      } catch (error) {
        console.log(error)
      }
    }
    if (edditingPatient) {
      formData.patient_name = edditingPatient.patient_name || ''
      formData.date_of_birth = edditingPatient.date_of_birth.slice(0, 10) || ''
      formData.entry_time = edditingPatient.entry_time || ''
      formData.exit_time = edditingPatient.exit_time || null
      formData.patient_triage_time = edditingPatient.patient_triage_time || ''
      formData.patient_triage_level = edditingPatient.patient_triage_level || ''
      formData.patient_status = edditingPatient.patient_status || ''
      formData.patient_problem = edditingPatient.patient_problem || ''
      formData.patient_medication = edditingPatient.patient_medication || ''
      asFun()
      const newDate = dayjs(edditingPatient.date_of_birth)
      setSelectedDate(newDate)
    }
  }, [edditingPatient])

  useEffect(() => {
    //bring doctors, nurses, and boxes available
    const fetchDoctors = async () => {
      try {
        const data = await getAllDoctors()
        setDoctorOptions(data)
      } catch (error) {
        // console.error('Error:', error.message)
      }
    }
    const fetchNurses = async () => {
      try {
        const data = await getAllNurses()
        setNurseOptions(data)
      } catch (error) {
        // console.error('Error:', error.message)
      }
    }
    const fetchBoxes = async () => {
      try {
        const data = await getAvailableBoxes()
        setBoxesOptions(data)
      } catch (error) {
        // console.error('Error:', error.message)
      }
    }
    fetchDoctors()
    fetchNurses()
    fetchBoxes()
  }, [])

  //TODO estas 3 const deberian traerse desde api
  const StateOptions = [
    { state_id: 1, state_name: 'EN ESPERA' },
    { state_id: 2, state_name: 'EN ESPERA DE INTERNACION' },
    { state_id: 3, state_name: 'INTERNADO' },
    { state_id: 4, state_name: 'ALTA' },
    { state_id: 5, state_name: 'AFUERA' },
    { state_id: 6, state_name: 'EN AISLAMIENTO' }
  ]
  const PatientProblems = [
    { _id: 1, name: 'Convulsiones' },
    { _id: 2, name: 'Trauma de Cráneo' },
    { _id: 3, name: 'Dolor torácico / dorsal' },
    { _id: 4, name: 'Dolor abdominal / lumbar' },
    { _id: 5, name: 'Cefalea' },
    { _id: 6, name: 'Déficit motor' },
    { _id: 7, name: 'Disartria - afasia' },
    { _id: 8, name: 'Pérdida aguda de visión' },
    { _id: 9, name: 'Disnea' },
    { _id: 10, name: 'Otro dolor en curso' },
    { _id: 11, name: 'Sobredosis de fármacos / Ingesta de tóxicos' },
    { _id: 12, name: 'Sangrado Digestivo' },
    { _id: 13, name: 'Fiebre >38°' }
  ]
  const TriageLevels = [
    { _id: 1, name: 'I', color: '153, 153, 153' },
    { _id: 2, name: 'II', color: '255,51,0' },
    { _id: 3, name: 'III', color: '255,255,102' },
    { _id: 4, name: 'IV', color: '105,168,79' }
  ]

  // Function to get the current time in the desired format
  const getCurrentTime = () => {
    const now = new Date()
    const formattedTime = `${now.getFullYear()}-${(now.getMonth() + 1)
      .toString()
      .padStart(2, '0')}-${now.getDate().toString().padStart(2, '0')} ${now
      .getHours()
      .toString()
      .padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now
      .getSeconds()
      .toString()
      .padStart(2, '0')}`
    return formattedTime
  }

  const handleButtonClick: React.MouseEventHandler<HTMLButtonElement> = (event) => {
    formData.patient_triage_time = getCurrentTime()
    formData.patient_box = formData.box_id
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [formData, setFormData] = useState<any>({
    patient_name: '',
    date_of_birth: '2000-01-01',
    entry_time: '',
    exit_time: null,
    patient_triage_time: getCurrentTime(),
    patient_triage_level: '',
    patient_box: '',
    patient_status: '',
    patient_problem: '',
    patient_medication: '',
    doctor_id: '',
    nurse_id: '',
    box_id: ''
  })

  const handleTriageLevelClick = (level: number) => {
    setFormData({
      ...formData,
      patient_triage_level: level
    })
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    // Get the selected option based on the entered value
    // Check if it's the hidden input
    if (name === 'doctor_id') {
      const itemId = DoctorOptions
        ? DoctorOptions.find((option) => option.user_name === value)?.user_id
        : null
      setFormData({
        ...formData,
        [name]: itemId
      })
    } else if (name === 'nurse_id') {
      const itemId = NurseOptions
        ? NurseOptions.find((option) => option.user_name === value)?.user_id
        : null
      setFormData({
        ...formData,
        [name]: itemId
      })
    } else if (name === 'box_id') {
      const itemId = BoxesOptions?.find((box) => box.box_id == value)?.box_id
      setFormData({
        ...formData,
        [name]: itemId
      })
    } else if (name === 'patient_triage_level') {
      setFormData({
        ...formData,
        [name]: Number(value)
      })
    } else {
      setFormData({
        ...formData,
        [name]: value
      })
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    //Update entry_time
    const FormDataNow = formData
    FormDataNow.entry_time = getCurrentTime()

    try {
      //Delete Id
      const formDataNoID = FormDataNow
      delete formDataNoID.patient_id
      console.log(formDataNoID)
      const token = Cookies.get('authToken')
      if (token) {
        if (edditingPatient) {
          try {
            const data = await updateAnyPatient(edditingPatient.patient_id, formDataNoID)
            toast.success('Paciente actualizado', {
              duration: 2000
            })
            navigate('/patients')
          } catch {
            toast.error('Error al actualizar un paciente', {
              duration: 2000
            })
          }
        } else {
          const { data, errors } = await addNewPatient(FormDataNow)
          if (errors) {
            console.error('Errores en el formulario al agregar nuevo paciente:', errors)
            toast.error('Error al intentar agregar un nuevo paciente', {
              duration: 2000
            })
          } else {
            console.log('Nuevo paciente agregado:', data)
            toast.success('Nuevo paciente agregado', {
              duration: 2000
            })
          }

          setFormData({
            patient_name: '',
            date_of_birth: '2000-01-01',
            entry_time: null,
            exit_time: null,
            patient_triage_time: getCurrentTime(),
            patient_triage_level: '',
            patient_box: '',
            patient_status: '',
            patient_problem: '',
            patient_medication: '',
            doctor_id: '',
            nurse_id: '',
            box_id: ''
          })
          setSelectedDate(null)
        }
      }
    } catch (error) {
      toast.error('Error al intentar agregar un nuevo paciente', {
        duration: 2000
      })
      console.error('Error al intentar agregar un nuevo paciente:', error)
    }
  }

  const handleDateChange = (newDate: Date | null) => {
    setFormData({ ...formData, date_of_birth: newDate })
    setSelectedDate(newDate)
    console.log(newDate)
  }

  const [selectedDate, setSelectedDate] = useState<Date | null>(null)

  return (
    <div className='max-w-5xl mx-auto mt-5 p-6 bg-white shadow-md rounded-md'>
      <h2 className='text-2xl font-semibold mb-5'>Nuevo Paciente</h2>
      <form
        onSubmit={handleSubmit}
        className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'
      >
        <div>
          <Label htmlFor='patient_name'>Nombre del Paciente</Label>
          <Input
            type='text'
            id='patient_name'
            name='patient_name'
            value={formData.patient_name}
            onChange={handleInputChange}
            required
          />
        </div>

        <div>
          <Label htmlFor='date_of_birth'>Fecha de Nacimiento</Label>
          <DatePickerMUI onChangeExt={handleDateChange} selectedDateExt={selectedDate} />
        </div>
        <div>
          <Label htmlFor='patient_triage_level'>Nivel de Triaje</Label>
          <div className='flex'>
            {TriageLevels.map((level) => (
              <button
                key={level._id}
                onClick={() => handleTriageLevelClick(level._id)}
                type='button'
                className={`mr-2 mb-2 py-1  flex-grow border-4 ${
                  formData.patient_triage_level == level._id
                    ? ' border-black'
                    : 'border-transparent'
                }`}
                style={{ backgroundColor: `rgba(${level.color}, 0.6)` }}
              >
                {level.name}
              </button>
            ))}
          </div>
        </div>

        <div>
          <Label htmlFor='patient_medication'>Medicación del Paciente</Label>
          <Input
            type='text'
            id='patient_medication'
            name='patient_medication'
            value={formData.patient_medication}
            onChange={handleInputChange}
          />
        </div>

        <div>
          <Label htmlFor='patient_problem'>Problema del Paciente</Label>
          <Input
            type='text'
            id='patient_problem'
            name='patient_problem'
            value={formData.patient_problem}
            onChange={handleInputChange}
            autoComplete='off'
            list='patientProblems'
          />
          <datalist
            id='patientProblems'
            className='absolute z-10 mt-1 w-full bg-white rounded-md shadow-lg'
          >
            {PatientProblems?.map((option) => (
              <option key={option._id} value={option.name} data-id={option._id} />
            ))}
          </datalist>
        </div>

        <div>
          <Label htmlFor='box_id'>ID de la Caja</Label>
          <Select id='box_id' name='box_id' value={formData.box_id} onChange={handleInputChange}>
            <option value='' disabled>
              Seleccionar box
            </option>
            {BoxesOptions?.map((option) => (
              <option key={option.box_id} value={option.box_id}>
                {option.box_code + ': ' + option.box_type}
              </option>
            ))}
          </Select>
        </div>

        <div>
          <Label htmlFor='doctor_id'>Nombre del Doctor</Label>
          <Select
            id='doctor_id'
            name='doctor_id'
            value={formData.doctor_id}
            onChange={handleInputChange}
          >
            <option value='' disabled>
              Seleccionar doctor
            </option>
            {DoctorOptions?.map((option) => (
              <option key={option.user_id} value={option.user_name}>
                {option.user_name}
              </option>
            ))}
          </Select>
        </div>

        <div>
          <Label htmlFor='nurse_id'>Nombre del Enfermero</Label>
          <Select
            id='nurse_id'
            name='nurse_id'
            value={formData.nurse_id}
            onChange={handleInputChange}
          >
            <option value='' disabled>
              Seleccionar enfermero
            </option>
            {NurseOptions?.map((option) => (
              <option key={option.user_id} value={option.user_name}>
                {option.user_name}
              </option>
            ))}
          </Select>
        </div>

        <div>
          <Label htmlFor='patient_status'>Estado del Paciente</Label>
          <Select
            id='patient_status'
            name='patient_status'
            value={formData.patient_status}
            onChange={handleInputChange}
          >
            <option value='' disabled>
              Seleccionar estado
            </option>
            {StateOptions.map((option) => (
              <option key={option.state_id} value={option.state_name}>
                {option.state_name}
              </option>
            ))}
          </Select>
        </div>

        <div className='flex items-end gap-4 '>
          <Button type='submit' color='green' onClick={handleButtonClick}>
            {edditingPatient ? 'Save Patient' : 'Add New Patient'}
          </Button>
          {edditingPatient && (
            <Link to={`/patients`}>
              <Button type='button' color='grey'>
                Cancel
              </Button>
            </Link>
          )}
        </div>
      </form>
    </div>
  )
}

export default NewPatientForm
