import { DashboardData } from '@/interfaces/Dashboard'
import Cookies from 'js-cookie'

export const getDashboardData = async (): Promise<DashboardData> => {
  const token = Cookies.get('authToken')
  try {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/dashboard`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      }
    })

    if (!response.ok) {
      throw new Error(`Error en la solicitud GET a /dashboard: ${response.statusText}`)
    }
    const data = await response.json()
    return data
  } catch (error) {
    console.error('Error al obtener dashboard:', error)
    throw new Error('Error al obtener dashboard')
  }
}
