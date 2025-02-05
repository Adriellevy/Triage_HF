import { useState, useEffect, useContext } from 'react'
import { getAllBoxes } from '@/services/boxService'
import { Box } from '@/interfaces/Boxes'
import LoaderSpin from '@/components/LoaderSpin'
import BoxEdittingList from '../../components/BoxSettingsComponents/BoxEdittingList'
import { SocketContext } from '@/contex/SocketContext'
import { SocketEvent, UpdateEvent } from '@/interfaces/Socket'

import { useAuth } from '@/contex/AuthContext'
function BoxSettings() {
  const [isLoading, setIsLoading] = useState(false)
  const [boxesData, setboxesData] = useState<Box[]>([])
  const socket = useContext(SocketContext)
  const { logout } = useAuth()
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true)
        const data = await getAllBoxes()
        setboxesData(data)
        setIsLoading(false)
      } catch (error) {
        if (error.message === 'Cerrar sesion') {
          logout()
        } else {
          console.error((error as Error).message)
        }
      }
    }
    fetchData()
  }, [])

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true)
        const data = await getAllBoxes()
        setboxesData(data)
        setIsLoading(false)
      } catch (error) {
        if (error.message === 'Cerrar sesion') {
          logout()
        } else {
          console.error((error as Error).message)
        }
      }
      if (socket) {
        socket.on(SocketEvent.UPDATE, (data) => {
          if (data.message == UpdateEvent.BOX_UPDATE) {
            fetchData()
          }
        })
        return () => {
          socket.off(SocketEvent.UPDATE)
        }
      }
    }
    fetchData()
  }, [socket])

  return (
    <div className=' pb-4 mt-5 md:mt-0 '>
      {isLoading ? <LoaderSpin /> : <BoxEdittingList initialBoxes={boxesData} />}
    </div>
  )
}

export default BoxSettings
