import Cookies from 'js-cookie'
import { config } from '../config/env'

//import { Settings } from '../interfaces/Settings'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
//TODO string por el settings que no existe
export const getSettings = async (): Promise<string> => {
  const token = Cookies.get('authToken')
  try {
    const responsedocs = await fetch(`${config.API_URL}/settings`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      }
    })
    if (!responsedocs.ok) {
      throw new Error(`Error in GET request to /Settings: ${responsedocs.statusText}`)
    }
    const data = await responsedocs.json()
    return data
  } catch (error: unknown) {
    console.error('Error fetching Settings:', error)
    throw new Error('Error fetching Settings')
  }
}
