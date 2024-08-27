import { User, UserRole } from '@/interfaces/User'
import { Button } from '../ui'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCircleInfo, faPenToSquare, faXmark } from '@fortawesome/free-solid-svg-icons'
import EditUserModal from '../UserSettingsComponents/EditUserModal'
import ConfirmationDialog from '../ConfirmationDialog'

interface PropsUserItem {
  user: User
  index: number
}

function UserItem({ user, index }: PropsUserItem) {
  const { t } = useTranslation('UserItem')
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<boolean>(false)
  const [isEditing, setIsEditing] = useState(false)
  const { user_id, user_name, user_full_name, user_email, user_type, user_specialization, state } =
    user
  const fieldTranslations = {
    user_name: t('Name'),
    user_full_name: t('FullName'),
    user_specialization: t('Specialization'),
    user_type: t('Role')
  }
  const isOdd = index % 2 !== 0
  const bgClass = isOdd ? 'bg-white' : 'bg-gray-100'
  const handleEdit = () => {
    setIsEditing(true)
  }

  const handleClose = () => {
    setIsEditing(false)
  }

  const confirmDelete = async () => {
    await deleteBox(editableBox.box_id)
    onDelete(editableBox.box_id)
    setShowDeleteConfirm(false)
  }

  const cancelDelete = () => {
    setShowDeleteConfirm(false)
  }
  const handleDelete = async () => {
    setShowDeleteConfirm(true)
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
          <Button wfull color='red' onClick={handleDelete}>
            <FontAwesomeIcon icon={faXmark} />
          </Button>
        </div>
      </td>

      {isEditing && <EditUserModal user={user} onClose={handleClose} />}
      {
        <ConfirmationDialog
          show={showDeleteConfirm}
          title={t('ConfirmDeleteTitle')}
          message={t('ConfirmDeleteMessage')}
          recomendation={t('ChangeLocationRecommendation')}
          warning={t('Warning')}
          confirm={t('Confirm')}
          cancel={t('Cancel')}
          object={user}
          confirmDelete={confirmDelete}
          cancelDelete={cancelDelete}
          fieldTranslations={fieldTranslations}
          ignoreFields={['user_id']}
        ></ConfirmationDialog>
      }
    </tr>
  )
}

export default UserItem
