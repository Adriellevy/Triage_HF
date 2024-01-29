/* eslint-disable @typescript-eslint/no-unused-vars */
import { PartialPatient } from '@/interfaces/Patinet'
import { User } from '@/interfaces/User'
import { Box } from '@/interfaces/Boxes'
import { addNewPatient } from '@/services/patientService'
import { getAllDoctors, getAllNurses } from '@/services/userService'
import { getBoxes } from '@/services/boxService'
import { useEffect, useState } from 'react'
import Cookies from 'js-cookie'

function NewPatientForm() {
  const [BoxesOptions, setBoxesOptions] = useState<Box[] | null>(null)
  const [DoctorOptions, setDoctorOptions] = useState<User[] | null>(null)
  const [NurseOptions, setNurseOptions] = useState<User[] | null>(null)

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
      const itemId = BoxesOptions
        ? BoxesOptions.find((option) => option.box_id + ': ' + option.box_type === value)?.box_id
        : null

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
    try {
      // TODO: JsonWebToken
      console.log(formData)
      const token = Cookies.get('authToken')
      console.log(formData)
      if (token) {
        const newPatient = await addNewPatient(formData)
        console.log('Nuevo paciente agregado:', newPatient)
      } else {
        console.error('Token is undefined')
      }
    } catch (error) {
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
          <label htmlFor='patient_name' className='block text-sm font-medium text-gray-600'>
            Nombre del Paciente
          </label>
          <input
            type='text'
            id='patient_name'
            name='patient_name'
            value={formData.patient_name}
            onChange={handleInputChange}
            className='mt-1 p-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-blue-300'
            required
          />
        </div>

        <div>
          <label htmlFor='date_of_birth' className='block text-sm font-medium text-gray-600'>
            Fecha de Nacimiento
          </label>
          <input
            type='date'
            id='date_of_birth'
            name='date_of_birth'
            value={formData.date_of_birth}
            onChange={handleInputChange}
            className='mt-1 p-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-blue-300'
          />
        </div>

        <div>
          <label htmlFor='entry_time' className='block text-sm font-medium text-gray-600'>
            Hora de Ingreso
          </label>
          <input
            type='time'
            id='entry_time'
            name='entry_time'
            value={formData.entry_time}
            onChange={handleInputChange}
            className='mt-1 p-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-blue-300'
          />
        </div>

        <div>
          <label htmlFor='patient_triage_level' className='block text-sm font-medium text-gray-600'>
            Nivel de Triaje
          </label>
          <input
            type='text'
            id='patient_triage_level'
            name='patient_triage_level'
            value={formData.patient_triage_level}
            onChange={handleInputChange}
            className='mt-1 p-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-blue-300'
          />
        </div>

        <div>
          <label htmlFor='patient_medication' className='block text-sm font-medium text-gray-600'>
            Medicación del Paciente
          </label>
          <input
            type='text'
            id='patient_medication'
            name='patient_medication'
            value={formData.patient_medication}
            onChange={handleInputChange}
            className='mt-1 p-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-blue-300'
          />
        </div>

        <div>
          <label htmlFor='patient_problem' className='block text-sm font-medium text-gray-600'>
            Problema del Paciente
          </label>
          <input
            type='text'
            id='patient_problem'
            name='patient_problem'
            value={formData.patient_problem}
            onChange={handleInputChange}
            className='mt-1 p-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-blue-300'
          />
        </div>

        <div>
          <label htmlFor='box_id' className='block text-sm font-medium text-gray-600'>
            ID de la Caja
          </label>
          <input
            type='text'
            id='box_id'
            name='box_id'
            value={formData.box_id}
            onChange={handleInputChange}
            className='mt-1 p-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-blue-300'
            autoComplete='off' // Desactiva el autocompletado del navegador
            list='BoxesOptions' // Asociamos el datalist con el ID "doctorOptions"
          />
          <datalist
            id='BoxesOptions'
            className='absolute z-10 mt-1 w-full bg-white rounded-md shadow-lg'
          >
            {BoxesOptions?.map((option) => (
              <option
                key={option.box_id}
                value={option.box_id + ': ' + option.box_type}
                data-id={option.box_id}
              />
            ))}
          </datalist>
        </div>

        <div>
          <label htmlFor='doctor_id' className='block text-sm font-medium text-gray-600'>
            Nombre del Doctor
          </label>
          <input
            type='text'
            id='doctor_id'
            name='doctor_id'
            key={formData.doctor_id}
            onChange={handleInputChange}
            autoComplete='off' // Desactiva el autocompletado del navegador
            list='doctorOptions' // Asociamos el datalist con el ID "doctorOptions"
            className='mt-1 p-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-blue-300'
          />
          <datalist
            id='doctorOptions'
            className='absolute z-10 mt-1 w-full bg-white rounded-md shadow-lg'
          >
            {DoctorOptions?.map((option) => (
              <option key={option.user_id} value={option.user_name} data-id={option.user_id} />
            ))}
          </datalist>
        </div>

        <div>
          <label htmlFor='nurse_id' className='block text-sm font-medium text-gray-600'>
            Nombre del Enfermero
          </label>
          <input
            type='text'
            id='nurse_id'
            name='nurse_id'
            value={formData.data}
            onChange={handleInputChange}
            autoComplete='off'
            list='nurseOptions'
            className='mt-1 p-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-blue-300'
          />
          <datalist id='nurseOptions'>
            {NurseOptions?.map((option) => (
              <option key={option.user_id} value={option.user_name} data-id={option.user_id} />
            ))}
          </datalist>
        </div>

        <div>
          <label htmlFor='patient_status' className='block text-sm font-medium text-gray-600'>
            Estado del Paciente
          </label>
          <input
            type='text'
            id='patient_status'
            name='patient_status'
            value={formData.patient_status}
            onChange={handleInputChange}
            className='mt-1 p-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-blue-300'
          />
        </div>

        <div className='flex items-end'>
          <button
            type='submit'
            className='px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring focus:border-blue-300'
            onClick={handleButtonClick}
          >
            Add New Patient
          </button>
        </div>
      </form>
    </div>
  )
}

export default NewPatientForm
