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
  invalidPatients: Patient[]
}

function PatientsListShiftExchange({
  patients,
  mode,
  lastDoctor,
  lastNurse,
  invalidPatients
}: PropsPatientsList) {
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
      showOnLargeScreen: true
    },
    {
      label: t('LastDoctorNameLabel'),
      field: 'last_doctor_name',
      sortable: false,
      showOnLargeScreen: false
    },
    {
      label: t('LastNurseNameLabel'),
      field: 'last_nurse_name',
      sortable: false,
      showOnLargeScreen: false
    },
    {
      label: t('NewDoctorNameLabel'),
      field: 'doctor_name',
      sortable: false,
      showOnLargeScreen: false
    },
    {
      label: t('NewNurseNameLabel'),
      field: 'nurse_name',
      sortable: false,
      showOnLargeScreen: false
    },
    {
      label: t('Observations'),
      field: 'observation',
      sortable: false,
      showOnLargeScreen: true
    },
    {
      label: t('Procedures'),
      field: 'procedures',
      sortable: false,
      showOnLargeScreen: true
    },
    {
      label: t('Record'),
      field: 'record',
      sortable: false,
      showOnLargeScreen: true
    },
    {
      label: t('PatientActionsLabel'),
      field: 'actions',
      sortable: false,
      showOnLargeScreen: true
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
  console.log('invalidPatients', invalidPatients)
  return (
    <>
      <div className='text-xs lg:text-sm mt-4 lg:mx-8'>
        <table className='w-full border border-gray-300'>
          <thead>
            <tr className='bg-blue-800 text-white'>
              {columns.map((column) => {
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
                isInvalid={invalidPatients.some((invalidPatient) => {
                  console.log(invalidPatient)
                  console.log(patient.patient_id)
                  return String(invalidPatient) === String(patient.patient_id)
                })}
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
