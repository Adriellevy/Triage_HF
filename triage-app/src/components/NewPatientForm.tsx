/* eslint-disable @typescript-eslint/no-unused-vars */
import { PartialPatient } from '@/interfaces/Patinet'
import { toast } from 'sonner'
import { User } from '@/interfaces/User'
import { Box } from '@/interfaces/Boxes'
import { addNewPatient } from '@/services/patientService'
import { getAllDoctors, getAllNurses } from '@/services/userService'
import { getBoxes } from '@/services/boxService'
import { useEffect, useState } from 'react'
import Cookies from 'js-cookie'
import { Button, Input, Label, Select } from '@/components/ui'

interface PatientState {
  state_id: number
  state_name: string
}

function NewPatientForm() {
  const [BoxesOptions, setBoxesOptions] = useState<Box[] | null>(null)
  const [DoctorOptions, setDoctorOptions] = useState<User[] | null>(null)
  const [NurseOptions, setNurseOptions] = useState<User[] | null>(null)
  const [StateOptions, setStateOptions] = useState<PatientState[]>([
    { state_id: 1, state_name: 'EN ESPERA' },
    { state_id: 2, state_name: 'EN ESPERA DE INTERNACIÓN' },
    { state_id: 3, state_name: 'INTERNADO' },
    { state_id: 4, state_name: 'ALTA' }
    // { state_id: 4, state_name: 'AFUERA' },
    // { state_id: 4, state_name: 'EN AISLAMIENTO' }
  ])
  const [PatientProblems, setPatientProblems] = useState([
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
  ])
  const [TriageLevels, setTriageLevels] = useState([
    { _id: 1, name: 'I', color: '#999999' },
    { _id: 2, name: 'II', color: '#FF3300' },
    { _id: 3, name: 'III', color: '#FFFF66' },
    { _id: 4, name: 'IV', color: '#69A84F' }
  ])

  //todo: sacar patient_box,
  //todo: patient_triage_time se crea en api
  //todo: entry time se crea en api

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
    entry_time: '2023-01-01 10:00:00',
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
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    // Get the selected option based on the entered value

    // Check if it's the hidden input
    if (name === 'doctor_id') {
      const itemId = DoctorOptions
        ? DoctorOptions.find((option) => option.user_name === value)?.user_id
        : null

      console.log(itemId)
      setFormData({
        ...formData,
        [name]: itemId
      })
    } else if (name === 'nurse_id') {
      const itemId = NurseOptions
        ? NurseOptions.find((option) => option.user_name === value)?.user_id
        : null

      console.log(itemId)
      setFormData({
        ...formData,
        [name]: itemId
      })
    } else if (name === 'box_id') {
      console.log(BoxesOptions);
      console.log(value);
      // const itemId = BoxesOptions
      //   // ? BoxesOptions.find((option) => option.box_id + ': ' + option.box_type === value)?.box_id
      //   ? BoxesOptions.find((option) => option.box_id === value)?.box_id
      //   : null
      const itemId = BoxesOptions?.find(box=>box.box_id==value)?.box_id
      console.log(itemId)
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
    // const dateNow=getCurrentTime()
    //actualizar entry_time 
    setFormData({
      ...formData,
      entry_time: getCurrentTime()
    });
    try {
      console.log(formData)
      const token = Cookies.get('authToken')
      console.log(formData)
      if (token) {
        const newPatient = await addNewPatient(formData)
        console.log('Nuevo paciente agregado:', newPatient)
        toast.success('Nuevo paciente agregado', {
          duration: 2000
        })
      } else {
        console.error('Token is undefined')
      }
    } catch (error) {
      toast.error('Error al intentar agregar un nuevo paciente', {
        duration: 2000
      })
      console.error('Error al intentar agregar un nuevo paciente:', error)
    }
  }

  useEffect(() => {
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
        const data = await getBoxes()
        setBoxesOptions(data)
      } catch (error) {
        // console.error('Error:', error.message)
      }
    }
    fetchDoctors()
    fetchNurses()
    fetchBoxes()
  }, [])


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
          <Input
            type='date'
            id='date_of_birth'
            name='date_of_birth'
            value={formData.date_of_birth}
            onChange={handleInputChange}
          />
        </div>

        {/* <div>  // Automatico
          <Label htmlFor='entry_time'>Hora de Ingreso</Label>
          <Input
            type='time'
            id='entry_time'
            name='entry_time'
            value={formData.entry_time}
            onChange={handleInputChange}
          />
        </div> */}

        <div>
          <Label htmlFor='patient_triage_level'>Nivel de Triaje</Label>
          <div className='flex'>
            {TriageLevels.map((level) => (
              <button
              onClick={()=>handleTriageLevelClick(level._id)}
              type='button'
              className={`mr-2 mb-2 py-1  flex-grow border-4 ${formData.patient_triage_level==level._id?' border-black':'border-transparent'}`}
              style={{ backgroundColor: `${level.color}`, }}
              >
                {level.name}
              </button>
            ))}
          </div>
          {/* <Input
            type='text'
            id='patient_triage_level'
            name='patient_triage_level'
            value={formData.patient_triage_level}
            onChange={handleInputChange}
          /> */}
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
                {option.box_id + ': ' + option.box_type}
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
          {/* <Input
            type='text'
            id='box_id'
            name='box_id'
            value={formData.box_id}
            onChange={handleInputChange}
            autoComplete='off' // Desactiva el autocompletado del navegador
            list='BoxesOptions' // Asociamos el datalist con el ID "doctorOptions"
          />
          <datalist
            id='BoxesOptions'
            className='absolute z-10 mt-1 w-full bg-white rounded-md shadow-lg'
          >
            {DoctorOptions?.map((option) => (
              <option key={option.user_id} value={option.user_name} data-id={option.user_id} />
            ))}
          </datalist> */}
        </div>

        <div className='flex items-end'>
          <Button type='submit' color='blue' onClick={handleButtonClick}>
            Add New Patient
          </Button>
        </div>
      </form>
    </div>
  )
}

export default NewPatientForm
