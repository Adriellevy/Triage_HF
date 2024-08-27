import { User, UserRole } from '@/interfaces/User'
import { Button } from '../ui'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faCancel,
  faCircleInfo,
  faCross,
  faCrosshairs,
  faDiagnoses,
  faDisease,
  faNotdef,
  faNotEqual,
  faPenToSquare,
  faXmark
} from '@fortawesome/free-solid-svg-icons'
import EditUserModal from '../UserSettingsComponents/EditUserModal'

interface PropsUserItem {
  user: User
  index: number
}

function UserItem({ user, index }: PropsUserItem) {
  const { t } = useTranslation('UserItem')
  const [isEditing, setIsEditing] = useState(false)
  const { user_id, user_name, user_full_name, user_email, user_type, user_specialization, state } =
    user
  const isOdd = index % 2 !== 0
  const bgClass = isOdd ? 'bg-white' : 'bg-gray-100'
  const handleEdit = () => {
    setIsEditing(true)
  }

  const handleClose = () => {
    setIsEditing(false)
  }
  return (
    <tr className={bgClass}>
      <td className='border p-2 '>{user_name}</td>
      <td className='border p-2 '>{user_full_name}</td>
      <td className='border p-2 '>{user_email}</td>
      <td className='border p-2 '>
        <div
          className={`rounded-md p-2 text-white ${
            user_type === UserRole.HOSPITAL ? 'bg-blue-500 shadow-md' : 'bg-green-500 shadow-md'
          }`}
        >
          {t(`UserRole.${user_type}`)}
        </div>
      </td>
      <td className='border p-2 '>{user_specialization || t('NoSpecialization')}</td>
      <td className='border p-2 '>
        <div className={`rounded-md p-2 text-white ${state ? 'bg-green-500' : 'bg-red-500'}`}>
          {state ? t('Active') : t('Inactive')}
        </div>
      </td>
      <td className='border p-2 '>
        <div className='flex gap-2'>
          <div>
            <div className='mb-2'>
              <Link to={`/users/${user_id}`}>
                <Button color='green'>
                  <FontAwesomeIcon icon={faCircleInfo}></FontAwesomeIcon>
                </Button>
              </Link>
            </div>
            <div>
              <Button wfull color='green' onClick={handleEdit}>
                <FontAwesomeIcon icon={faPenToSquare} />
              </Button>
            </div>
          </div>
          <Button wfull color='red' onClick={() => {}}>
            <FontAwesomeIcon icon={faXmark} />
          </Button>
        </div>
      </td>

      {isEditing && <EditUserModal user={user} onClose={handleClose} />}
    </tr>
  )
}

export default UserItem
