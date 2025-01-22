import Cookies from 'js-cookie'
import { config } from '../config/env'
import { Sintom } from '@/interfaces/Sintom'

// Obtener todos los síntomas
export const getAllSymptoms = async (): Promise<{
  success: boolean
  message: string
  data?: Sintom[]
}> => {
  const token = Cookies.get('authToken')

  try {
    const response = await fetch(`${config.API_URL}/symptom`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      }
    })

    if (!response.ok) {
      const errorResponse = await response.json()
      throw new Error(
        `Error en la solicitud GET a /symptom: ${errorResponse.message || 'Unknown error'}`
      )
    }

    const data = await response.json()
    return { success: true, message: 'Síntomas obtenidos correctamente', data: data.data }
  } catch (error: unknown) {
    console.error('Error al obtener síntomas:', JSON.stringify(error, null, 2))
    return { success: false, message: 'Error al obtener síntomas' }
  }
}

// Obtener un síntoma por ID
export const getSymptomById = async (
  id: string
): Promise<{
  success: boolean
  message: string
  data?: Sintom
}> => {
  const token = Cookies.get('authToken')

  try {
    const response = await fetch(`${config.API_URL}/symptom/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      }
    })

    if (!response.ok) {
      const errorResponse = await response.json()
      throw new Error(
        `Error en la solicitud GET a /symptom/:id: ${errorResponse.message || 'Unknown error'}`
      )
    }

    const data = await response.json()
    return { success: true, message: 'Síntoma obtenido correctamente', data: data.data }
  } catch (error: unknown) {
    console.error('Error al obtener el síntoma:', JSON.stringify(error, null, 2))
    return { success: false, message: 'Error al obtener el síntoma' }
  }
}

// Crear un síntoma
export const createSymptom = async (
  name: string
): Promise<{
  success: boolean
  message: string
  data?: Sintom
}> => {
  const token = Cookies.get('authToken')

  try {
    const response = await fetch(`${config.API_URL}/symptom`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ name })
    })

    if (!response.ok) {
      const errorResponse = await response.json()
      throw new Error(
        `Error en la solicitud POST a /symptom: ${errorResponse.message || 'Unknown error'}`
      )
    }

    const data = await response.json()
    return { success: true, message: 'Síntoma creado correctamente', data: data.data }
  } catch (error: unknown) {
    console.error('Error al crear el síntoma:', JSON.stringify(error, null, 2))
    return { success: false, message: 'Error al crear el síntoma' }
  }
}

// Actualizar un síntoma por ID
export const updateSymptom = async (
  id: string,
  name: string
): Promise<{
  success: boolean
  message: string
  data?: Sintom
}> => {
  const token = Cookies.get('authToken')

  try {
    const response = await fetch(`${config.API_URL}/symptom/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ name })
    })

    if (!response.ok) {
      const errorResponse = await response.json()
      throw new Error(
        `Error en la solicitud PUT a /symptom/:id: ${errorResponse.message || 'Unknown error'}`
      )
    }

    const data = await response.json()
    return { success: true, message: 'Síntoma actualizado correctamente', data: data.data }
  } catch (error: unknown) {
    console.error('Error al actualizar el síntoma:', JSON.stringify(error, null, 2))
    return { success: false, message: 'Error al actualizar el síntoma' }
  }
}

// Eliminar un síntoma por ID
export const deleteSymptom = async (
  id: string
): Promise<{
  success: boolean
  message: string
}> => {
  const token = Cookies.get('authToken')

  try {
    const response = await fetch(`${config.API_URL}/symptom/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      }
    })

    if (!response.ok) {
      const errorResponse = await response.json()
      throw new Error(
        `Error en la solicitud DELETE a /symptom/:id: ${errorResponse.message || 'Unknown error'}`
      )
    }

    return { success: true, message: 'Síntoma eliminado correctamente' }
  } catch (error: unknown) {
    console.error('Error al eliminar el síntoma:', JSON.stringify(error, null, 2))
    return { success: false, message: 'Error al eliminar el síntoma' }
  }
}
