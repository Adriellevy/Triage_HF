import { useState, useEffect, useContext } from 'react'
import { getAllUsers } from '@/services/userService'
import LoaderSpin from '@/components/LoaderSpin'
import UserList from '../../components/UserSettingsComponents/UserList'
import { SocketContext } from '@/contex/SocketContext'
import { SocketEvent, UpdateEvent } from '@/interfaces/Socket'
import { User } from '@/interfaces/User'

function UserSettings() {
  const [isLoading, setIsLoading] = useState(false)
  const [UsersData, setUsersData] = useState<User[]>([])
  const socket = useContext(SocketContext)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true)
        const data = await getAllUsers()
        setUsersData(data)
        setIsLoading(false)
      } catch (error) {
        console.error((error as Error).message)
      }
    }
    fetchData()
  }, [])

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true)
        const data = await getAllUsers()
        setUsersData(data)
        setIsLoading(false)
      } catch (error) {
        console.error((error as Error).message)
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
    <div className='bg-white pb-4'>
      {isLoading ? <LoaderSpin /> : <UserList users={UsersData} />}
    </div>
  )
}

export default UserSettings
