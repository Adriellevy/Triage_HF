import { Box, PartialBox } from '../interfaces/Boxes'
import Cookies from 'js-cookie'
import { config } from '../config/env'

export const getAllBoxes = async (): Promise<Box[]> => {
  const token = Cookies.get('authToken')
  try {
    const response = await fetch(`${config.API_URL}/box`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      }
    })
    // Verificamos el estado de la respuesta antes de procesarla
    console.log('response status', response.status)
    if (response.status === 207) {
      console.log('Llego el 207, procesando el error...')
      throw new Error('Cerrar sesion')
    }
    if (response.status === 206) {
      const data = await response.json()
      const newAccessToken = data.newAccessToken
      console.log('Se refresco el token del usuario')
      if (newAccessToken) {
        Cookies.set('authToken', newAccessToken)
        return await getAllBoxes()
      }
    }
    if (!response.ok) {
      throw new Error(`Error en la solicitud GET a /box: ${response.statusText}`)
    }
    const data = await response.json()
    return data
  } catch (error: unknown) {
    if (error instanceof Error && error.message === 'Cerrar sesion') {
      throw new Error('Cerrar sesion')
    } else {
      console.error('Error al obtener boxes:', error)
      throw new Error('Error al obtener boxes')
    }
  }
}

export const getAvailableBoxes = async (): Promise<Box[]> => {
  const token = Cookies.get('authToken')
  try {
    const response = await fetch(`${config.API_URL}/box/available`, {
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
  } catch (error: unknown) {
    console.error('Error al obtener boxes:', error)
    throw new Error('Error al obtener boxes')
  }
}

export const searchBoxById = async (boxId: string): Promise<Box | null> => {
  const token = Cookies.get('authToken')
  try {
    const response = await fetch(`${config.API_URL}/box/${boxId}`, {
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
  } catch (error: unknown) {
    console.error(`Error al obtener la caja con ID ${boxId}:`, error)
    throw new Error('Error al obtener la caja')
  }
}

export const getBoxCodeById = async (boxId: string): Promise<Box | null> => {
  const token = Cookies.get('authToken')
  try {
    const response = await fetch(`${config.API_URL}/box/searchid/${boxId}`, {
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
  } catch (error: unknown) {
    console.error(`Error al obtener la caja con ID ${boxId}:`, error)
    throw new Error('Error al obtener la caja')
  }
}

export const CreateNewBox = async (
  newBoxData: PartialBox
): Promise<{
  data?: PartialBox | null
  errors?: { message: string; path: string }[] | null
}> => {
  const token = Cookies.get('authToken')

  try {
    const response = await fetch(`${config.API_URL}/box/add/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(newBoxData)
    })

    console.log('body del mensaje enviado \n', newBoxData)

    if (!response.ok) {
      const errorResponse = await response.json()
      if (errorResponse.errors) {
        const simplifiedErrors = errorResponse.errors.map(
          ({ message, path }: { message: string; path: string[] }) => ({
            message,
            path: path[0]
          })
        )
        return { data: null, errors: simplifiedErrors }
      }

      throw new Error(`Error en la solicitud POST a /box/add/: ${errorResponse}`)
    }

    const data = await response.json()
    return { data, errors: null }
  } catch (error: unknown) {
    console.error('Error al agregar nuevo box:', JSON.stringify(error, null, 2))
    throw new Error('Error al agregar nuevo box')
  }
}

export const updateBox = async (
  box_id: string,
  updatedData: Partial<Box>
): Promise<{
  message?: string
  updatedBox?: Box | null
}> => {
  try {
    const token = Cookies.get('authToken')
    const apiUrl = `${config.API_URL}/box/update/${box_id}`

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const body: Partial<Box> = {} // Initialize an empty object for the request body

    // Agregar cada key-value pair al cuerpo de la solicitud
    Object.entries(updatedData).forEach(([key, value]) => {
      if (key in updatedData) {
        body[key as keyof Box] = value
      }
    })

    const response = await fetch(apiUrl, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(body) // Pasar el objeto body construido
    })
    console.log('Informacion mandada:', body)
    const data = await response.json()

    if (!response.ok) {
      throw new Error(`Error en la solicitud PATCH a ${apiUrl}: ${response.statusText}`)
    }

    return {
      message: 'Box actualizado exitosamente',
      updatedBox: data.box
    }
  } catch (error: unknown) {
    console.error('Error al actualizar el box:', error)
    throw new Error('Error al actualizar el box')
  }
}

export const deleteBox = async (
  boxId: string
): Promise<{
  success: boolean
  message: string
}> => {
  const token = Cookies.get('authToken')

  try {
    const response = await fetch(`${config.API_URL}/box/delete/${boxId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      }
    })

    if (!response.ok) {
      const errorResponse = await response.json()
      throw new Error(
        `Error en la solicitud DELETE a /box/delete/: ${errorResponse.message || 'Unknown error'}`
      )
    }

    return { success: true, message: 'Box eliminado correctamente' }
  } catch (error: unknown) {
    console.error('Error al eliminar box:', JSON.stringify(error, null, 2))
    return { success: false, message: 'Error al eliminar box' }
  }
}
