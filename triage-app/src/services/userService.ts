import { User } from '../interfaces/User'
import Cookies from 'js-cookie'
export const getAllUsers = async (): Promise<User[]> => {
  //TODO: jsonwebtoken

  const token = Cookies.get('authToken')
  console.log('Token en Users: ' + token)
  try {
    const responsedocs = await fetch(`${import.meta.env.VITE_API_URL}/users`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      }
    })

    if (!responsedocs.ok) {
      throw new Error(`Error in GET request to /Users: ${responsedocs.statusText}`)
    }
    const data = await responsedocs.json()

    return data
  } catch (error) {
    console.error('Error fetching Users:', error)
    throw new Error('Error fetching Users')
  }
}

export const getUserIdByToken = async (): Promise<number> => {
  //TODO: jsonwebtoken
  const token = Cookies.get('authToken')
  console.log('Token en Users: ' + token)
  const tokenpost = {
    token: token
  }
  try {
    const responsedocs = await fetch(`${import.meta.env.VITE_API_URL}/users/getuseridbytoken`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(tokenpost)
    })
    if (!responsedocs.ok) {
      throw new Error(`Error in GET request to /Users: ${responsedocs.statusText}`)
    }
    const data = await responsedocs.json()
    return data
  } catch (error) {
    console.error('Error fetching Users:', error)
    throw new Error('Error fetching Users')
  }
}

export const getAllDoctors = async (): Promise<User[]> => {
  //TODO: jsonwebtoken

  const token = Cookies.get('authToken')
  try {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/users/doctor`, {
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

export const getAllNurses = async (): Promise<User[]> => {
  //TODO: jsonwebtoken

  const token = Cookies.get('authToken')
  try {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/users/nurse`, {
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
  const token = Cookies.get('authToken')
  try {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/users/data/${user_id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
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
