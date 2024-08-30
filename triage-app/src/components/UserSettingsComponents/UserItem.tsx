import { PartialUser, User, UserRole } from '@/interfaces/User'
import { Button } from '../ui'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCircleInfo, faPenToSquare, faXmark } from '@fortawesome/free-solid-svg-icons'
import ConfirmationDialog from '../ConfirmationDialog'
import EditModal from './EditModal'
import { deleteUser, updateUser } from '@/services/userService'
import { toast } from 'sonner'

interface PropsUserItem {
  user: User
  index: number
}

function UserItem({ user, index }: PropsUserItem) {
  const { t } = useTranslation('UserItem')
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<boolean>(false)
  const [isEditing, setIsEditing] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const { user_name, user_full_name, user_email, user_type, user_specialization, state } = user

  const fieldTranslations = {
    user_name: t('Name'),
    user_password: t('Password'),
    user_full_name: t('FullName'),
    user_type: t('Role'),
    user_specialization: t('Specialization'),
    user_email: t('Email'),
    state: t('State'),
    user_cellphone: t('user_cellphone')
  }

  const userWithPasswordAndCellphone = {
    user_name: user.user_name,
    user_password: '', // Inicializa el campo de contraseña
    user_full_name: user.user_full_name,
    user_type: user.user_type,
    user_specialization: user.user_specialization,
    user_email: user.user_email,
    //state: user.state,
    user_cellphone: null // Inicializa el campo de celular
  }

  const warningFunctionalityFieldsArray = [
    'user_specialization',
    'user_email',
    // 'state',
    'user_cellphone'
  ]

  const warningMessages = warningFunctionalityFieldsArray.reduce((acc, field) => {
    acc[field] = t('NotAveilableFeatures')
    return acc
  }, {} as { [key: string]: string })

  const isOdd = index % 2 !== 0
  const bgClass = isOdd ? 'bg-white' : 'bg-gray-100'
  const handleEdit = () => {
    setIsEditing(true)
  }

  const handleClose = () => {
    setIsEditing(false)
  }

  const confirmDelete = async () => {
    setShowDeleteConfirm(false)
    try {
      await deleteUser(user.user_id)
      setIsEditing(false)
    } catch (error) {
      console.error('Error al actualizar el usuario:', error)
      toast.error('Error al intentar eliminar un nuevo Usuario', { duration: 2000 })
    } finally {
      setIsLoading(false) // Ocultar Loader
      toast.success('Usuario eliminado', { duration: 2000 })
    }
  }

  const cancelDelete = () => {
    setShowDeleteConfirm(false)
  }
  const handleShowDeleteConfirmation = async () => {
    setShowDeleteConfirm(true)
  }

  const handleSaveUser = async (updatedUser: User) => {
    setIsLoading(true) // Mostrar Loader
    try {
      await updateUser(user.user_id, updatedUser)
      setIsEditing(false)
    } catch (error) {
      console.error('Error al actualizar el usuario:', error)
      toast.error('Error al intentar agregar un nuevo Usuario', { duration: 2000 })
    } finally {
      setIsLoading(false) // Ocultar Loader
      toast.success('Usuario actualizado', { duration: 2000 })
    }
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
              <Link to={`/users/${user.user_id}`}>
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
          <Button wfull color='red' onClick={handleShowDeleteConfirmation}>
            <FontAwesomeIcon icon={faXmark} />
          </Button>
        </div>
      </td>
      {isEditing && (
        <EditModal
          // La advertencia sucede porque no esta el campo user_id, user_email y user_cellphone
          object={userWithPasswordAndCellphone}
          onClose={handleClose}
          title={t('EditUserTitle')}
          onSave={handleSaveUser}
          fieldTranslations={fieldTranslations}
          confirm={t('Confirm')}
          cancel={t('Cancel')}
          warningFields={warningMessages}
          ignoreFields={['user_id']}
          security={t('Security')}
          loading={isLoading}
        />
      )}

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
