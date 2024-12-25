import { PartialUser, User } from '../interfaces/User'
import Cookies from 'js-cookie'
import { config } from '../config/env'

export const getAllUsers = async (): Promise<User[]> => {
  const token = Cookies.get('authToken')
  try {
    const responsedocs = await fetch(`${config.API_URL}/users/users`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      }
    })
    // Verificamos el estado de la respuesta antes de procesarla
    if (responsedocs.status === 207) {
      console.log('Llego el 207, procesando el error...')
      throw new Error('Cerrar sesion')
    }

    if (!responsedocs.ok) {
      throw new Error(`Error in GET request to /Users: ${responsedocs.statusText}`)
    }
    const data = await responsedocs.json()

    return data
  } catch (error: unknown) {
    if (error instanceof Error && error.message === 'Cerrar sesion') {
      throw new Error('Cerrar sesion')
    } else {
      console.error('Error fetching Users:', error)
      throw new Error('Error fetching Users')
    }
  }
}

export const getUserIdByToken = async (): Promise<number> => {
  const token = Cookies.get('authToken')
  const tokenpost = {
    token: token
  }
  try {
    const responsedocs = await fetch(`${config.API_URL}/users/getuseridbytoken`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(tokenpost)
    })
    // Verificamos el estado de la respuesta antes de procesarla
    if (responsedocs.status === 207) {
      console.log('Llego el 207, procesando el error...')
      throw new Error('Cerrar sesion')
    }
    if (!responsedocs.ok) {
      console.log("Se lanzo el error en: 'getUserIdByToken' ")
      throw new Error(`Error in GET request to /Users: ${responsedocs.statusText}`)
    }
    const data = await responsedocs.json()
    return data
  } catch (error: unknown) {
    if (error instanceof Error && error.message === 'Cerrar sesion') {
      throw new Error('Cerrar sesion')
    } else {
      console.log("catch el error en: 'getUserIdByToken' ")
      console.error('Error fetching Users:', error)
      throw new Error('Error fetching Users')
    }
  }
}

export const getAllDoctors = async (withPatients?: boolean): Promise<User[]> => {
  const token = Cookies.get('authToken')
  try {
    const response = await fetch(
      `${config.API_URL}/users/doctor?withPatients=${withPatients || false}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        }
      }
    )
    if (response.status === 207) {
      console.log('Llego el 207, procesando el error...')
      throw new Error('Cerrar sesion')
    }
    if (!response.ok) {
      throw new Error(`Error in GET request to /Users: ${response.statusText}`)
    }
    const data = await response.json()
    return data
  } catch (error: unknown) {
    if (error instanceof Error && error.message === 'Cerrar sesion') {
      throw new Error('Cerrar sesion')
    } else {
      console.error('Error fetching Users:', error)
      throw new Error('Error fetching Users')
    }
  }
}

export const getAllNurses = async (withPatients?: boolean): Promise<User[]> => {
  const token = Cookies.get('authToken')
  try {
    const response = await fetch(
      `${config.API_URL}/users/nurse?withPatients=${withPatients || false}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        }
      }
    )

    if (!response.ok) {
      throw new Error(`Error in GET request to /Users: ${response.statusText}`)
    }
    const data = await response.json()
    return data
  } catch (error: unknown) {
    console.error('Error fetching Users:', error)
    throw new Error('Error fetching Users')
  }
}

export const CreateNewUser = async (
  newUserData: PartialUser
): Promise<{
  data?: PartialUser | null
  errors?: { message: string; path: string }[] | null
}> => {
  const token = Cookies.get('authToken')

  try {
    const response = await fetch(`${config.API_URL}/users/add/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(newUserData)
    })

    console.log('body del mensaje enviado \n', newUserData)

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

      throw new Error(`Error en la solicitud POST a /User/add/: ${errorResponse}`)
    }

    const data = await response.json()
    return { data, errors: null }
  } catch (error: unknown) {
    console.error('Error al agregar nuevo User:', JSON.stringify(error, null, 2))
    throw new Error('Error al agregar nuevo User')
  }
}

export const updateUser = async (
  user_id: string,
  updatedData: Partial<User>
): Promise<{
  message?: string
  updatedUser?: User | null
}> => {
  try {
    const token = Cookies.get('authToken')
    const apiUrl = `${config.API_URL}/users/update/${user_id}`

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const body: PartialUser = {} // Initialize an empty object for the request body

    // Agregar cada key-value pair al cuerpo de la solicitud
    Object.entries(updatedData).forEach(([key, value]) => {
      if (key in updatedData) {
        body[key as keyof User] = value
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

    const data = await response.json()

    if (!response.ok) {
      throw new Error(`Error en la solicitud PATCH a ${apiUrl}: ${response.statusText}`)
    }

    return {
      message: 'User actualizado exitosamente',
      updatedUser: data.User
    }
  } catch (error: unknown) {
    console.error('Error al actualizar el User:', error)
    throw new Error('Error al actualizar el User')
  }
}

export const deleteUser = async (
  UserId: string
): Promise<{
  success: boolean
  message: string
}> => {
  const token = Cookies.get('authToken')

  try {
    const response = await fetch(`${config.API_URL}/Users/delete/${UserId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      }
    })

    if (!response.ok) {
      const errorResponse = await response.json()
      throw new Error(
        `Error en la solicitud DELETE a /users/delete/: ${errorResponse.message || 'Unknown error'}`
      )
    }

    return { success: true, message: 'User eliminado correctamente' }
  } catch (error: unknown) {
    console.error('Error al eliminar User:', JSON.stringify(error, null, 2))
    return { success: false, message: 'Error al eliminar User' }
  }
}

export const getUserById = async (user_id: string | undefined): Promise<User> => {
  const token = Cookies.get('authToken')
  try {
    const response = await fetch(`${config.API_URL}/users/data/${user_id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      }
    })

    if (response.status === 206) {
      const data = await response.json()
      const newAccessToken = data.newAccessToken
      console.log('Se refresco el token del usuario')
      if (newAccessToken) {
        Cookies.set('authToken', newAccessToken)
        return await getUserById(user_id)
      }
    }
    if (!response.ok) {
      throw new Error(`Error in GET request to /user:${response.status}`)
    }
    return (await response.json()) as User
  } catch (error: unknown) {
    // console.error('Error fetching user:', error)
    throw new Error('Error fetching user')
  }
}
