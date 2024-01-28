/* eslint-disable @typescript-eslint/no-unused-vars */
import { PartialPatient } from '@/interfaces/Patinet'
import { User } from '@/interfaces/User'
import { addNewPatient } from '@/services/patientService'
import { getAllDoctors, getAllNurses } from '@/services/userService'
import { useEffect, useState } from 'react'
import Cookies from 'js-cookie'

function NewPatientForm() {
  const [DoctorOptions, setDoctorOptions] = useState<User[] | null>(null)
  const [NurseOptions, setNurseOptions] = useState<User[] | null>(null)

  //todo: sacar patient_box,
  //todo: patient_triage_time se crea en api
  //todo: entry time se crea en api

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [formData, setFormData] = useState<any>({
    patient_name: 'Nuevo Paciente123',
    date_of_birth: '2000-01-01',
    entry_time: '2023-01-01 10:00:00',
    exit_time: null,
    patient_triage_time: '2023-01-01 10:15:00',
    patient_triage_level: 2,
    patient_box: 'CONSULTORIO',
    patient_status: 'EN ESPERA',
    patient_problem: 'Síntomas generales',
    patient_medication: 'Paracetamol',
    doctor_id: 1,
    nurse_id: 2,
    box_id: 1
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      // TODO: JsonWebToken
      const token = Cookies.get('authToken')
      console.log(formData)
      if (token) {
        const newPatient = await addNewPatient(token, formData)
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
    fetchDoctors()
    fetchNurses()
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
          />
        </div>

        <div>
          <label htmlFor='doctor_name' className='block text-sm font-medium text-gray-600'>
            Nombre del Doctor
          </label>
          <input
            type='text'
            id='doctor_name'
            name='doctor_name'
            value={formData.doctor_name}
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
              <option key={option.user_id} value={option.user_name} />
            ))}
          </datalist>
        </div>

        <div>
          <label htmlFor='nurse_name' className='block text-sm font-medium text-gray-600'>
            Nombre del Enfermero
          </label>
          <input
            type='text'
            id='nurse_name'
            name='nurse_name'
            value={formData.nurse_name}
            onChange={handleInputChange}
            autoComplete='off'
            list='nurseOptions'
            className='mt-1 p-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-blue-300'
          />
          <datalist id='nurseOptions'>
            {NurseOptions?.map((option) => (
              <option key={option.user_id} value={option.user_name} />
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
          >
            Add New Patient
          </button>
        </div>
      </form>
    </div>
  )
}

export default NewPatientForm
