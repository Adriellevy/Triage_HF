import { useState } from 'react'
import { Patient } from '@/interfaces/Patinet'
import { useTranslation } from 'react-i18next'
import Pagination from '../Pagination/Pagination'
import PatientItemShiftExchange from './PatientItemShiftExchange'

interface PropsPatientsList {
  patients: Patient[]
  mode: string
  lastDoctor?: { value: string; label: string }
  lastNurse?: { value: string; label: string }
}

function PatientsListShiftExchange({ patients, mode, lastDoctor, lastNurse }: PropsPatientsList) {
  const { t } = useTranslation('PatientList')
  const [currentPage, setCurrentPage] = useState(1)
  const [sortColumn, setSortColumn] = useState<string | null>(null)
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc')
  const patientsPerPage = 5

  const columns = [
    {
      label: t('NameLabel'),
      field: 'patient_name',
      sortable: true,
      showOnLargeScreen: true,
      mode: 'all'
    },
    {
      label: t('TriageLevelLabel'),
      field: 'patient_triage_level',
      sortable: true,
      showOnLargeScreen: true,
      mode: 'all'
    },
    {
      label: t('LastDoctorNameLabel'),
      field: 'last_doctor_name',
      sortable: false,
      showOnLargeScreen: false,
      mode: 'doctor'
    },
    {
      label: t('NewDoctorNameLabel'),
      field: 'doctor_name',
      sortable: false,
      showOnLargeScreen: false,
      mode: 'doctor'
    },
    {
      label: t('LastNurseNameLabel'),
      field: 'last_nurse_name',
      sortable: false,
      showOnLargeScreen: false,
      mode: 'nurse'
    },
    {
      label: t('NewNurseNameLabel'),
      field: 'nurse_name',
      sortable: false,
      showOnLargeScreen: false,
      mode: 'nurse'
    },
    {
      label: t('PatientStatusLabel'),
      field: 'patient_status',
      sortable: true,
      showOnLargeScreen: true,
      mode: 'all'
    },
    {
      label: t('PatientActionsLabel'),
      field: 'actions',
      sortable: false,
      showOnLargeScreen: true,
      mode: 'all'
    }
  ]

  const handleSort = (column: string) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortColumn(column)
      setSortDirection('asc')
    }
  }

  const handlePagination = (pageNumber: number) => {
    setCurrentPage(pageNumber)
  }

  const sortedPatients = [...patients].sort((a, b) => {
    if (!sortColumn) {
      return 0
    }
    const columnA = a[sortColumn as keyof Patient]
    const columnB = b[sortColumn as keyof Patient]
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

  const indexOfLastPatient = currentPage * patientsPerPage
  const indexOfFirstPatient = indexOfLastPatient - patientsPerPage
  const currentPatients = sortedPatients.slice(indexOfFirstPatient, indexOfLastPatient)

  return (
    <>
      <div className='text-xs lg:text-sm mt-4 lg:mx-8'>
        <table className='w-full border border-gray-300'>
          <thead>
            <tr className='bg-blue-800 text-white'>
              {columns
                .filter((column) => column.mode === 'all' || column.mode === mode)
                .map((column) => {
                  const shouldHideColumn =
                    column.field === 'patient_status' ||
                    column.field === 'last_doctor_name' ||
                    column.field === 'last_nurse_name'
                  return (
                    <th
                      key={column.label}
                      className={`border cursor-pointer p-2 ${
                        shouldHideColumn ? 'hidden lg:table-cell' : ''
                      }`}
                      onClick={() => (column.sortable ? handleSort(column.field) : null)}
                    >
                      {column.label}{' '}
                      {column.sortable && sortColumn === column.field && (
                        <span>{sortDirection === 'asc' ? '▲' : '▼'}</span>
                      )}
                    </th>
                  )
                })}
            </tr>
          </thead>
          <tbody>
            {currentPatients.map((patient, index) => (
              <PatientItemShiftExchange
                key={patient.patient_id}
                patient={patient}
                index={index}
                mode={mode}
                lastDoctor={lastDoctor}
                lastNurse={lastNurse}
              />
            ))}
          </tbody>
        </table>
        <div className='flex justify-center'>
          <Pagination
            patientsPerPage={patientsPerPage}
            length={patients.length}
            currentPage={currentPage}
            onPageChange={handlePagination}
          />
        </div>
      </div>
    </>
  )
}

export default PatientsListShiftExchange
