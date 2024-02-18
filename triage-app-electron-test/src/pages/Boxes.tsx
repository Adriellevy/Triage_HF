import { useState, useEffect, useContext } from 'react'
import Cookies from 'js-cookie'
import { SocketContext } from '@/contex/SocketContext'
import BoxList from '@/components/BoxList'
import { getBoxes } from '@/services/boxService'
import { Box } from '@/interfaces/Boxes'
import { SocketEvent, UpdateEvent } from '@/interfaces/Socket'

function Boxes() {
  const socket = useContext(SocketContext)
  const [isLoading, setIsLoading] = useState(false)
  const [boxesData, setboxesData] = useState<Box[] | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true)
        const data = await getBoxes()
        setboxesData(data)
        setIsLoading(false)
      } catch (error) {
        console.error((error as Error).message)
      }
    }
    fetchData()
  }, [])

  useEffect(() => {
    const token = Cookies.get('authToken')
    const fetchData = async () => {
      try {
        if (token) {
          const data = await getBoxes()
          setboxesData(data)
        }
      } catch (error) {
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
  }, [socket])

  return <div>{!isLoading ? <BoxList boxes={boxesData} /> : <p>Cargando boxes...</p>}</div>
}

export default Boxes
