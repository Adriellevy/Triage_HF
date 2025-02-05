import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { ShiftChange } from '../../interfaces/Shift-change'
import Cookies from 'js-cookie'
import { getShiftById, getShiftChanges } from '@/services/ShiftService'

interface PropsShiftList {
  shift_id: string
}

function ShiftChangeList({ shift_id }: PropsShiftList) {
  const { t } = useTranslation('ShiftList')
  const [sortColumn, setSortColumn] = useState<string | null>(null)
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc')
  const [shiftChanges, setShiftChanges] = useState<ShiftChange[]>([])
  const token = Cookies.get('authToken')

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (token) {
          const data = await getShiftChanges(null, null, shift_id)
          console.log('data', data)
          setShiftChanges(data)
        }
      } catch (error) {
        console.error((error as Error).message)
      }
    }
    fetchData()
  }, [token, shift_id])

  const handleSort = (column: string) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortColumn(column)
      setSortDirection('asc')
    }
  }

  if (!shift_id || shift_id === '') {
    return <div className='mx-0 mt-4 lg:mx-8'>{t('No shift changes available')}</div>
  }

  const sortedShiftChanges = [...shiftChanges].sort((a, b) => {
    if (!sortColumn) {
      return 0
    }
    const columnA = a[sortColumn as keyof ShiftChange]
    const columnB = b[sortColumn as keyof ShiftChange]
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
    { label: t('Shift ID'), field: 'shift_id', showOnLargeScreen: true, sortable: true },
    { label: t('User ID'), field: 'user_id', showOnLargeScreen: false, sortable: true },
    {
      label: t('Last Doctor ID'),
      field: 'last_doctor_id',
      showOnLargeScreen: true,
      sortable: true
    },
    { label: t('New Doctor ID'), field: 'new_doctor_id', showOnLargeScreen: true, sortable: true },
    { label: t('Last Nurse ID'), field: 'last_nurse_id', showOnLargeScreen: true, sortable: true },
    { label: t('New Nurse ID'), field: 'new_nurse_id', showOnLargeScreen: true, sortable: true },
    { label: t('Patient ID'), field: 'patient_id', showOnLargeScreen: true, sortable: true },
    {
      label: t('Patient Observations'),
      field: 'patient_observations',
      showOnLargeScreen: true,
      sortable: false
    },
    {
      label: t('Patient Records'),
      field: 'patient_records',
      showOnLargeScreen: true,
      sortable: false
    },
    {
      label: t('Patient Procedures'),
      field: 'patient_procedures',
      showOnLargeScreen: true,
      sortable: false
    }
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
          {sortedShiftChanges.map((shiftChange, index) => (
            <tr key={shiftChange.id}>
              {columns.map((column) => (
                <td
                  key={column.field}
                  className={`border p-2 ${column.showOnLargeScreen ? '' : 'hidden lg:table-cell'}`}
                >
                  {shiftChange[column.field as keyof ShiftChange]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default ShiftChangeList
