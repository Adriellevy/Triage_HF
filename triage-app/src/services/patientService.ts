import { Patient } from '../interfaces/Patinet'

export const getPatients = async (token: string): Promise<Patient[]> => {
  try {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/patient`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      }
    })

    if (!response.ok) {
      throw new Error(`Error in GET request to /patient: ${response.statusText}`)
    }
    const data = await response.json()
    return data
  } catch (error) {
    console.error('Error fetching patients:', error)
    throw new Error('Error fetching patients')
  }
}

export const getPatientById = async (patient_id: string | undefined): Promise<Patient> => {
  const token =
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwibmFtZSI6IkRyLiBTbWl0aCIsImlhdCI6MTcwMzIwNjE1N30.TNYMTte4XaVExpZmUMgcoX_dzpBbt84QnyN81RsExiw'

  try {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/patient/${patient_id}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    if (!response.ok) {
      throw new Error(`Error in GET request to /patient:${response.status}`)
    }
    return (await response.json()) as Patient
  } catch (error) {
    console.error('Error fetching patient:', error)
    throw new Error('Error fetching patient')
  }
}

export const updatePatient = async (
  patient_id: string,
  updatedData: Partial<Patient>
): Promise<void> => {
  // TODO: patch api
  console.log(patient_id)
  console.log(updatedData)
}

export const addNewPatient = async (
  token: string,
  newPatientData: Omit<Patient, 'patient_id'>
): Promise<Patient> => {
  try {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/patient`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(newPatientData)
    })
    if (!response.ok) {
      throw new Error(`Error en la solicitud POST a /patient: ${response.statusText}`)
    }
    const data = await response.json()
    return data
  } catch (error) {
    console.error('Error al agregar nuevo paciente:', error)
    throw new Error('Error al agregar nuevo paciente')
  }
}
