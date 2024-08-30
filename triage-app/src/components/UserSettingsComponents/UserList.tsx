import UserItem from '@/components/UserSettingsComponents/UserItem'
import { PartialUser, User, UserRole } from '@/interfaces/User'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import EditModal from './EditModal'
import { CreateNewUser } from '@/services/userService'
import { toast } from 'sonner'

interface PropsUserList {
  users: User[]
}

function UserList({ users }: PropsUserList) {
  const { t } = useTranslation('UserItem')
  const [sortColumn, setSortColumn] = useState<string | null>(null)
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc')
  const [isAddingUser, setIsAddingUser] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [UsuarioAuxiliar, setUsuarioAuxiliar] = useState<PartialUser>()
  const [errorsWarnings, setErrorsWarnings] = useState<{ [key: string]: string }>({})
  const fieldTranslations = {
    user_name: t('Name'),
    user_password: t('Password'),
    user_full_name: t('FullName'),
    user_type: t('Role'),
    user_specialization: t('Specialization'),
    user_email: t('Email'),
    state: t('State'),
    user_cellphone: t('user_cellphone'),
    user_password_check: t('ChequearPassword')
  }
  const handleSort = (column: string) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortColumn(column)
      setSortDirection('asc')
    }
  }

  const handleAddUser = () => {
    setIsAddingUser(true)
    const newUser: PartialUser = {
      user_name: '',
      user_full_name: '',
      user_password: '',
      user_password_check: '',
      user_email: '',
      user_specialization: '',
      user_type: UserRole.DOCTOR
    }
    setUsuarioAuxiliar(newUser)
  }

  const handleCancel = () => {
    setIsAddingUser(false)
  }

  const handleCreateUser = async (updatedUser: PartialUser) => {
    const errors: { [key: string]: string } = {}

    if (updatedUser?.user_password !== updatedUser?.user_password_check) {
      errors['user_password_check'] = t('Password_err')
    }

    if (Object.keys(errors).length > 0) {
      setErrorsWarnings(errors)
      // Asegúrate de no cerrar el modal aquí
      return
    }

    setIsLoading(true)
    try {
      delete updatedUser.user_password_check
      await CreateNewUser(updatedUser)
      setIsAddingUser(false)
      setErrorsWarnings({})
      toast.success('User added successfully', { duration: 2000 })
    } catch (error) {
      console.error('Error adding the user:', error)
      toast.error('Error adding the user', { duration: 2000 })
    } finally {
      setIsLoading(false)
    }
  }

  const sortedUsers = [...users].sort((a, b) => {
    if (!sortColumn) {
      return 0
    }
    const columnA = a[sortColumn as keyof User]
    const columnB = b[sortColumn as keyof User]
    if (typeof columnA === 'string' && typeof columnB === 'string') {
      return sortDirection === 'asc'
        ? columnA.localeCompare(columnB)
        : columnB.localeCompare(columnA)
    } else if (typeof columnA === 'number' && typeof columnB === 'number') {
      return sortDirection === 'asc' ? columnA - columnB : columnB - columnA
    } else {
      return 0
    }
  })

  const columns = [
    { label: t('Name'), field: 'user_name', showOnLargeScreen: true, sortable: true },
    { label: t('FullName'), field: 'user_full_name', showOnLargeScreen: true, sortable: true },
    { label: t('Email'), field: 'user_email', showOnLargeScreen: true, sortable: true },
    { label: t('Role'), field: 'user_type', showOnLargeScreen: true, sortable: true },
    {
      label: t('Specialization'),
      field: 'user_specialization',
      showOnLargeScreen: true,
      sortable: false
    },
    { label: t('State'), field: 'state', showOnLargeScreen: true, sortable: false },
    { label: t('Action'), field: 'action', showOnLargeScreen: true, sortable: false }
  ]

  return (
    <div className='mx-0 mt-4 lg:mx-8'>
      <button
        className='bg-green-500 text-white my-3 py-2 px-4 rounded hover:bg-blue-600 transition duration-300'
        onClick={handleAddUser}
      >
        {t('AddUser')}
      </button>
      {isAddingUser && (
        <>
          <EditModal
            // La advertencia sucede porque no esta el campo user_id, user_email y user_cellphone
            object={UsuarioAuxiliar as User}
            onClose={handleCancel}
            title={t('AddUser')}
            onSave={handleCreateUser}
            fieldTranslations={fieldTranslations}
            confirm={t('AddUserSimple')}
            cancel={t('Cancel')}
            ignoreFields={['user_id']}
            loading={isLoading}
            ErrorFields={errorsWarnings}
          />
        </>
      )}
      <table className='w-full border border-gray-300'>
        <thead>
          <tr className='min-w-full bg-blue-800 text-white'>
            {columns.map((column) => (
              <th
                key={column.field}
                className={`border p-2 ${column.showOnLargeScreen ? '' : 'hidden lg:table-cell'}`}
                onClick={() => (column.sortable ? handleSort(column.field) : null)}
              >
                {column.label}{' '}
                {column.sortable && sortColumn === column.field && (
                  <span>{sortDirection === 'asc' ? '▲' : '▼'}</span>
                )}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className='text-center text-black'>
          {sortedUsers.map(
            (user, index) => users && <UserItem key={user.user_id} user={user} index={index} />
          )}
        </tbody>
      </table>
    </div>
  )
}

export default UserList
