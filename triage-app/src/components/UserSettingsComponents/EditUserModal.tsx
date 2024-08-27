import { useState } from 'react'
import { User, UserRole } from '@/interfaces/User'
import { Button } from '@/components/ui'

interface PropsEditUserModal {
  user: User
  onClose: () => void
}

function EditUserModal({ user, onClose }: PropsEditUserModal) {
  const [userName, setUserName] = useState(user.user_name)
  const [userFullName, setUserFullName] = useState(user.user_full_name)
  const [userEmail, setUserEmail] = useState(user.user_email)
  const [userPassword, setUserPassword] = useState('')
  const [userType, setUserType] = useState(user.user_type)
  const [userSpecialization, setUserSpecialization] = useState(user.user_specialization || '')

  const handleSave = () => {
    // Aquí deberías manejar la lógica de actualización del usuario
    // Por ejemplo, llamar a una API para actualizar los datos del usuario
    onClose()
  }

  return (
    <div className='fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-35'>
      <div className='bg-white p-8 rounded-lg w-1/3'>
        <h2 className='text-xl mb-4'>Edit User</h2>
        <form>
          <div className='mb-4'>
            <label className='block text-gray-700 text-sm font-bold mb-2'>Username</label>
            <input
              type='text'
              className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
            />
          </div>
          <div className='mb-4'>
            <label className='block text-gray-700 text-sm font-bold mb-2'>Full Name</label>
            <input
              type='text'
              className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
              value={userFullName}
              onChange={(e) => setUserFullName(e.target.value)}
            />
          </div>
          <div className='mb-4'>
            <label className='block text-gray-700 text-sm font-bold mb-2'>Email</label>
            <input
              type='email'
              className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
              value={userEmail}
              onChange={(e) => setUserEmail(e.target.value)}
            />
          </div>
          <div className='mb-4'>
            <label className='block text-gray-700 text-sm font-bold mb-2'>Password</label>
            <input
              type='password'
              className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
              value={userPassword}
              onChange={(e) => setUserPassword(e.target.value)}
            />
          </div>
          <div className='mb-4'>
            <label className='block text-gray-700 text-sm font-bold mb-2'>User Type</label>
            <select
              className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
              value={userType}
              onChange={(e) => setUserType(e.target.value as UserRole)}
            >
              <option value={UserRole.DOCTOR}>Doctor</option>
              <option value={UserRole.NURSE}>Nurse</option>
              <option value={UserRole.HOSPITAL}>Hospital</option>
            </select>
          </div>
          <div className='mb-4'>
            <label className='block text-gray-700 text-sm font-bold mb-2'>Specialization</label>
            <input
              type='text'
              className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
              value={userSpecialization}
              onChange={(e) => setUserSpecialization(e.target.value)}
            />
          </div>
          <div className='flex justify-end'>
            <Button color='red' onClick={onClose}>
              Cancel
            </Button>
            <Button color='green' onClick={handleSave} className='ml-2'>
              Save
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default EditUserModal
