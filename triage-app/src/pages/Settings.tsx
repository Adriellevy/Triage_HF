import { useEffect } from 'react'

import { getSettings } from '@/services/settingsService'

function Settings() {
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getSettings()
        console.log(data)
      } catch (error) {
        if (error instanceof Error) {
          console.error('Error', error.message)
        } else {
          console.error('Error desconocido:', error)
        }
      }
    }
    fetchData()
  }, [])

  return <div className='flex h-screen'></div>
}

export default Settings
