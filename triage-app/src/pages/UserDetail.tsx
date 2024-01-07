// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { User } from '@/interfaces/User'
import { getUserById } from '@/services/userService'
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import DoctorImg from '../assets/doctor.jpeg'

const UserProfileImage = DoctorImg

function UserDetail() {
  const { user_id } = useParams()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [User, setUser] = useState<any>({
    user_id: 1,
    user_name: 'John Doe',
    user_email: 'john.doe@example.com',
    user_password: 'securepassword',
    user_type: 'DOCTOR'
  })

  useEffect(() => {
    const fetchData = async () => {
      try {
        // TODO: Add api
        const [data] = await getUserById(user_id)
        setUser(data)
      } catch (error) {
        if (error instanceof Error) {
          console.error('Error al obtener user:', error.message)
        } else {
          console.error('Error desconocido al obtener pacientes:', error)
        }
      }
    }
    fetchData()
  }, [user_id])
  return (
    <div className=' bg-white h-full flex flex-col p-4'>
      <div className='flex items-center mb-4'>
        <img src={UserProfileImage} alt='Profile' className='w-16 h-16 rounded-full mr-4' />
        <div>
          <div className='font-semibold text-2xl'>{User.user_name}</div>
          <div className=''>{User.user_email}</div>
        </div>
      </div>
      <div>
        <div className='mb-2'>
          <span className='font-semibold'>User ID:</span> {User.user_id}
        </div>
        <div className='mb-2'>
          <span className='font-semibold'>User Type:</span> {User.user_type}
        </div>
      </div>
    </div>
  )
}

export default UserDetail
