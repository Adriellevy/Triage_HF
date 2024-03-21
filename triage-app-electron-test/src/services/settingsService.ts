import Cookies from 'js-cookie'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const getSettings = async (): Promise<any> => {
  const token = Cookies.get('authToken')
  try {
    const responsedocs = await fetch(`${import.meta.env.VITE_API_URL}/settings`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      }
    })
    if (!responsedocs.ok) {
      throw new Error(`Error in GET request to /Settngs: ${responsedocs.statusText}`)
    }
    const data = await responsedocs.json()
    return data
  } catch (error) {
    console.error('Error fetching Settings:', error)
    throw new Error('Error fetching Settings')
  }
}
