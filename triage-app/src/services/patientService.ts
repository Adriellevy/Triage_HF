import { PartialPatient, Patient } from '../interfaces/Patinet'
import Cookies from 'js-cookie'

export const getPatients = async (): Promise<Patient[]> => {
  try {
    const token = Cookies.get('authToken')
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
  const token = Cookies.get('authToken')
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
): Promise<PartialPatient> => {
  try {
    const token = Cookies.get('authToken')
    const apiUrl = `${import.meta.env.VITE_API_URL}/patient/${patient_id}`
    console.log("api "+apiUrl)
    const response = await fetch(apiUrl, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({
        patient_status: updatedData.patient_status
      })
    })
    if (!response.ok) {
      throw new Error(`Error en la solicitud PATCH a ${apiUrl}: ${response.statusText}`)
    }
    const data = await response.json()
    return data
  } catch (error) {
    console.error('Error al actualizar paciente:', error)
    throw new Error('Error al actualizar paciente')
  }
}
export const updateAnyPatient = async (
  patient_id: string,
  updatedData: Partial<Patient>
): Promise<PartialPatient> => {
  try {
    const token = Cookies.get('authToken')
    const apiUrl = `${import.meta.env.VITE_API_URL}/patient/${patient_id}`
    console.log("api "+apiUrl)

    const body: any = {}; // Initialize an empty object for the request body

    // Loop through each key in updatedData
    Object.keys(updatedData).forEach((fieldName) => {
      // Add the key-value pair to the request body
      body[fieldName] = updatedData[fieldName];
    });

    const response = await fetch(apiUrl, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(body) // Pass the constructed body object
    })

    if (!response.ok) {
      throw new Error(`Error en la solicitud PATCH a ${apiUrl}: ${response.statusText}`)
    }
    const data = await response.json()
    return data
  } catch (error) {
    console.error('Error al actualizar paciente:', error)
    throw new Error('Error al actualizar paciente')
  }
}
export const addNewPatient = async (
  newPatientData: Omit<PartialPatient, 'patient_id'>
): Promise<PartialPatient> => {
  try {
    const token = Cookies.get('authToken')
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
