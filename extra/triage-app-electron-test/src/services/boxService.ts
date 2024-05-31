import { Box } from '../interfaces/Boxes'
import Cookies from 'js-cookie'

export const getAllBoxes = async (): Promise<Box[]> => {
  const token = Cookies.get('authToken')
  try {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/box`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      }
    })

    if (!response.ok) {
      throw new Error(`Error en la solicitud GET a /box: ${response.statusText}`)
    }
    const data = await response.json()
    return data
  } catch (error) {
    console.error('Error al obtener boxes:', error)
    throw new Error('Error al obtener boxes')
  }
}

export const getAvailableBoxes = async (): Promise<Box[]> => {
  const token = Cookies.get('authToken')
  try {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/box/available`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      }
    })

    if (!response.ok) {
      throw new Error(`Error en la solicitud GET a /box: ${response.statusText}`)
    }
    const data = await response.json()
    return data
  } catch (error) {
    console.error('Error al obtener boxes:', error)
    throw new Error('Error al obtener boxes')
  }
}

export const searchBoxById = async (boxId: string): Promise<Box | null> => {
  const token = Cookies.get('authToken')
  try {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/box/${boxId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      }
    })

    if (!response.ok) {
      if (response.status === 404) {
        return null
      } else {
        throw new Error(`Error en la solicitud GET a /box/${boxId}: ${response.statusText}`)
      }
    }

    const data = await response.json()
    return data
  } catch (error) {
    console.error(`Error al obtener la caja con ID ${boxId}:`, error)
    throw new Error('Error al obtener la caja')
  }
}
