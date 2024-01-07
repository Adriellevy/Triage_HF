import { User } from '../interfaces/User'

export const getAllUsers = async (token: string): Promise<User[]> => {
  try {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/users`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      }
    })

    if (!response.ok) {
      throw new Error(`Error en la solicitud GET a /users: ${response.statusText}`)
    }
    const data = await response.json()
    return data
  } catch (error) {
    console.error('Error al obtener users:', error)
    throw new Error('Error al obtener users')
  }
}

export const getUserById = async (user_id: string | undefined): Promise<User> => {
  const token =
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwibmFtZSI6IkRyLiBTbWl0aCIsImlhdCI6MTcwMzIwNjE1N30.TNYMTte4XaVExpZmUMgcoX_dzpBbt84QnyN81RsExiw'

  try {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/users/${user_id}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    if (!response.ok) {
      throw new Error(`Error al obtener el users. Código de estado: ${response.status}`)
    }
    return (await response.json()) as User
  } catch (error) {
    console.error('Error al obtener el users:', error)
    throw new Error('Error al obtener el users')
  }
}
