import Cookies from 'js-cookie'
import { config } from '../config/env'
import { TriageLevel } from '@/interfaces/TriageLevel'

// Obtener todos los triages
export const getAllTriages = async (): Promise<{
  success: boolean
  message: string
  data?: TriageLevel[]
}> => {
  const token = Cookies.get('authToken')

  try {
    const response = await fetch(`${config.API_URL}/triage`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      }
    })

    if (!response.ok) {
      const errorResponse = await response.json()
      throw new Error(
        `Error en la solicitud GET a /triage: ${errorResponse.message || 'Unknown error'}`
      )
    }

    const data = await response.json()
    return { success: true, message: 'Triages obtenidos correctamente', data: data.message }
  } catch (error: unknown) {
    console.error('Error al obtener triages:', JSON.stringify(error, null, 2))
    return { success: false, message: 'Error al obtener triages' }
  }
}

// Obtener un triage por nivel
export const getTriageByLevel = async (
  level: string
): Promise<{
  success: boolean
  message: string
  data?: TriageLevel
}> => {
  const token = Cookies.get('authToken')

  try {
    const response = await fetch(`${config.API_URL}/triage/${level}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      }
    })

    if (!response.ok) {
      const errorResponse = await response.json()
      throw new Error(
        `Error en la solicitud GET a /triage/${level}: ${errorResponse.message || 'Unknown error'}`
      )
    }

    const data = await response.json()
    return { success: true, message: 'Triage obtenido correctamente', data: data.message }
  } catch (error: unknown) {
    console.error('Error al obtener el triage:', JSON.stringify(error))
    return { success: false, message: 'Error al obtener el triage' }
  }
}

// Crear un nuevo triage
export const createTriage = async (
  level: string,
  color: string
): Promise<{
  success: boolean
  message: string
  data?: TriageLevel
}> => {
  const token = Cookies.get('authToken')

  try {
    const response = await fetch(`${config.API_URL}/triage`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ level, color })
    })

    if (!response.ok) {
      const errorResponse = await response.json()
      throw new Error(
        `Error en la solicitud POST a /triage: ${errorResponse.message || 'Unknown error'}`
      )
    }

    const data = await response.json()
    return { success: true, message: 'Triage creado correctamente', data: data.message }
  } catch (error: unknown) {
    console.error('Error al crear el triage:', JSON.stringify(error, null, 2))
    return { success: false, message: 'Error al crear el triage' }
  }
}

// Actualizar un triage por nivel
export const updateTriage = async (
  id: string,
  color: string,
  newLevel: string
): Promise<{
  success: boolean
  message: string
  data?: TriageLevel
}> => {
  const token = Cookies.get('authToken')
  console.log('OldLevel:', id)
  console.log('Body:', JSON.stringify({ color, newLevel }))
  try {
    const response = await fetch(`${config.API_URL}/triage/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ color, newLevel })
    })
    if (!response.ok) {
      const errorResponse = await response.json()
      throw new Error(
        `Error en la solicitud PUT a /triage/${id}: ${errorResponse.message || 'Unknown error'}`
      )
    }

    const data = await response.json()
    return { success: true, message: 'Triage actualizado correctamente', data: data.message }
  } catch (error: unknown) {
    console.error('Error al actualizar el triage:', JSON.stringify(error, null, 2))
    return { success: false, message: 'Error al actualizar el triage' }
  }
}

// Eliminar un triage por nivel
export const deleteTriage = async (
  id: string
): Promise<{
  success: boolean
  message: string
}> => {
  const token = Cookies.get('authToken')
  console.log('Deleting triage with ID:', id)
  try {
    const response = await fetch(`${config.API_URL}/triage/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      }
    })

    if (!response.ok) {
      const errorResponse = await response.json()
      throw new Error(
        `Error en la solicitud DELETE a /triage/${id}: ${errorResponse.message || 'Unknown error'}`
      )
    }

    return { success: true, message: 'Triage eliminado correctamente' }
  } catch (error: unknown) {
    console.error('Error al eliminar el triage:', JSON.stringify(error, null, 2))
    return { success: false, message: 'Error al eliminar el triage' }
  }
}
