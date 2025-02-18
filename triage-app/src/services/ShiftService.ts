import Cookies from 'js-cookie'
import { config } from '../config/env'

export const getCurrentShift = async () => {
  try {
    const token = Cookies.get('authToken')
    const response = await fetch(`${config.API_URL}/shift/current`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      }
    })

    if (!response.ok) {
      throw new Error(`Error in GET request to /shift/current: ${response.statusText}`)
    }

    return await response.json()
  } catch (error) {
    console.error('Error in getCurrentShift:', error)
    throw new Error('Error fetching current shift')
  }
}

export const getAllShifts = async (date?: string) => {
  try {
    const token = Cookies.get('authToken')
    const url = new URL(`${config.API_URL}/shift`)
    if (date) url.searchParams.append('date', date)

    const response = await fetch(url.toString(), {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      }
    })

    if (!response.ok) {
      throw new Error(`Error in GET request to /shift: ${response.statusText}`)
    }

    return await response.json()
  } catch (error) {
    console.error('Error in getAllShifts:', error)
    throw new Error('Error fetching all shifts')
  }
}

export const getShiftChanges = async (patient?: string, date?: string, shift?: string) => {
  try {
    if ((shift && date) || (!patient && !shift && !date)) {
      throw new Error(
        'Invalid query parameters: Cannot combine shift and date, and at least one filter must be provided'
      )
    }

    const token = Cookies.get('authToken')
    const url = new URL(`${config.API_URL}/shift/changes`)
    if (patient) url.searchParams.append('patient', patient)
    if (shift) url.searchParams.append('shift', shift)
    if (date) url.searchParams.append('date', date)

    const response = await fetch(url.toString(), {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      }
    })

    if (!response.ok) {
      throw new Error(`Error in GET request to /shift/changes: ${response.statusText}`)
    }

    return await response.json()
  } catch (error) {
    console.error('Error in getShiftChanges:', error)
    throw new Error('Error fetching shift changes')
  }
}

export const getShiftById = async (id: string) => {
  try {
    const token = Cookies.get('authToken')
    const response = await fetch(`${config.API_URL}/shift/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      }
    })

    if (!response.ok) {
      throw new Error(`Error in GET request to /shift/${id}: ${response.statusText}`)
    }

    return await response.json()
  } catch (error) {
    console.error('Error in getShiftById:', error)
    throw new Error('Error fetching shift by ID')
  }
}
