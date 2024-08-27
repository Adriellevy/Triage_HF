import UserItem from '@/components/UserSettingsComponents/UserItem'
import { User } from '@/interfaces/User'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'

interface PropsUserList {
  users: User[]
}

function UserList({ users }: PropsUserList) {
  const { t } = useTranslation('UserList')
  const [sortColumn, setSortColumn] = useState<string | null>(null)
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc')

  const handleSort = (column: string) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortColumn(column)
      setSortDirection('asc')
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
