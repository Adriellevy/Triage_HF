import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { ShiftChange } from '../../interfaces/Shift-change'
import Cookies from 'js-cookie'
import { getShiftChanges } from '@/services/ShiftService'
import LoaderSpin from '../LoaderSpin'
import { getUserById } from '@/services/userService'
import { getPatientById } from '@/services/patientService'
import { Tooltip } from '@mui/material'

interface PropsShiftList {
  shift_id: string
}

function ShiftChangeList({ shift_id }: PropsShiftList) {
  const { t } = useTranslation('ShiftList')
  const [sortColumn, setSortColumn] = useState<string | null>(null)
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc')
  const [shiftChanges, setShiftChanges] = useState<ShiftChange[] | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [userNames, setUserNames] = useState<{ [key: string]: string }>({})
  const [patientNames, setPatientNames] = useState<{ [key: string]: string }>({})
  const token = Cookies.get('authToken')

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (token) {
          const data = await getShiftChanges(null, null, shift_id)
          console.log(data, 'data')
          setShiftChanges(data)
        }
      } catch (error) {
        console.error((error as Error).message)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [token, shift_id])

  useEffect(() => {
    const fetchUserNames = async (userIds: string[]) => {
      const names: { [key: string]: string } = {}
      for (const id of userIds) {
        try {
          const user = await getUserById(id)
          names[id] = user.user_name
        } catch (error) {
          console.error(`Error fetching user with ID ${id}:`, error)
        }
      }
      setUserNames(names)
    }

    const fetchPatientNames = async (patientIds: string[]) => {
      const names: { [key: string]: string } = {}
      for (const id of patientIds) {
        try {
          const patient = await getPatientById(id)
          names[id] = patient.patient_name
        } catch (error) {
          console.error(`Error fetching patient with ID ${id}:`, error)
        }
      }
      setPatientNames(names)
    }

    if (shiftChanges) {
      const userIds = [
        ...new Set(
          shiftChanges.flatMap((shiftChange) => [
            shiftChange.user_id,
            shiftChange.last_doctor_id,
            shiftChange.new_doctor_id,
            shiftChange.last_nurse_id,
            shiftChange.new_nurse_id
          ])
        )
      ]
      fetchUserNames(userIds)

      const patientIds = [...new Set(shiftChanges.map((shiftChange) => shiftChange.patient_id))]
      fetchPatientNames(patientIds)
    }
  }, [shiftChanges])

  const handleSort = (column: string) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortColumn(column)
      setSortDirection('asc')
    }
  }

  if (loading) {
    return <LoaderSpin />
  }

  if (!shift_id || shift_id === '' || !shiftChanges || shiftChanges.length === 0) {
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
          {sortedShiftChanges.map((shiftChange) => (
            <tr key={shiftChange.id}>
              {columns.map((column) => (
                <td
                  key={column.field}
                  className={`border p-2 ${column.showOnLargeScreen ? '' : 'hidden lg:table-cell'}`}
                >
                  {[
                    'user_id',
                    'last_doctor_id',
                    'new_doctor_id',
                    'last_nurse_id',
                    'new_nurse_id'
                  ].includes(column.field) ? (
                    userNames[shiftChange[column.field as keyof ShiftChange]] || 'Loading...'
                  ) : column.field === 'patient_id' ? (
                    <Tooltip title={t('PatientInformation')}>
                      <a
                        href={`/patients/${shiftChange[column.field as keyof ShiftChange]}`}
                        className='text-blue-500 underline'
                      >
                        {patientNames[shiftChange[column.field as keyof ShiftChange]] ||
                          'Loading...'}
                      </a>
                    </Tooltip>
                  ) : (
                    shiftChange[column.field as keyof ShiftChange]
                  )}
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
