import { User } from '../interfaces/User'

export const getAllUsers = async (): Promise<User[]> => {
  //TODO: jsonwebtoken
  const token =
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwibmFtZSI6IkRyLiBTbWl0aCIsImlhdCI6MTcwMzIwNjE1N30.TNYMTte4XaVExpZmUMgcoX_dzpBbt84QnyN81RsExiw'

  try {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/users`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      }
    })

    if (!response.ok) {
      throw new Error(`Error in GET request to /Users: ${response.statusText}`)
    }
    const data = await response.json()
    return data
  } catch (error) {
    console.error('Error fetching Users:', error)
    throw new Error('Error fetching Users')
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
      throw new Error(`Error in GET request to /user:${response.status}`)
    }
    return (await response.json()) as User
  } catch (error) {
    console.error('Error fetching user:', error)
    throw new Error('Error fetching user')
  }
}
