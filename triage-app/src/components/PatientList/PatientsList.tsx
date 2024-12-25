import { useState } from 'react'
import PatientItem from '@/components/PatientList/PatientItem'
import { Patient } from '@/interfaces/Patinet'
import { useTranslation } from 'react-i18next'
import Pagination from '../Pagination/Pagination'

interface PropsPatientsList {
  patients: Patient[]
  currentPage: number
  setCurrentPage: (page: number) => void
  turnExchange: boolean
  newDoctor: string
  newNurse: string
}

function PatientsList({
  patients,
  currentPage,
  setCurrentPage,
  turnExchange,
  newDoctor,
  newNurse
}: PropsPatientsList) {
  const { t } = useTranslation('PatientList')
  const [sortColumn, setSortColumn] = useState<string | null>(null)
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc')
  const patientsPerPage = 20

  const columns = [
    {
      label: t('NameLabel'),
      field: 'patient_name',
      sortable: true,
      showOnLargeScreen: true,
      showOnTurnExchange: true
    },
    {
      label: t('AgeLabel'),
      field: 'date_of_birth',
      sortable: true,
      showOnLargeScreen: false,
      showOnTurnExchange: false
    },
    {
      label: t('EntryTimeLabel'),
      field: 'entry_time',
      sortable: true,
      showOnLargeScreen: false,
      showOnTurnExchange: false
    },
    {
      label: t('TriageLevelLabel'),
      field: 'patient_triage_level',
      sortable: true,
      showOnLargeScreen: true
    },
    {
      label: t('PatientProblem'),
      field: 'patient_problem',
      sortable: true,
      showOnLargeScreen: false,
      showOnTurnExchange: false
    },
    {
      label: t('PatientBoxLabel'),
      field: 'box_code',
      sortable: true,
      showOnLargeScreen: true,
      showOnTurnExchange: false
    },
    {
      label: t('DoctorNameLabel'),
      field: 'doctor_name',
      sortable: true,
      showOnLargeScreen: false,
      showOnTurnExchange: true
    },
    {
      label: t('NurseNameLabel'),
      field: 'nurse_name',
      sortable: true,
      showOnLargeScreen: false,
      showOnTurnExchange: true
    },
    {
      label: t('PatientStatusLabel'),
      field: 'patient_status',
      sortable: true,
      showOnLargeScreen: true,
      showOnTurnExchange: true
    },
    {
      label: t('PatientActionsLabel'),
      field: 'actions',
      sortable: false,
      showOnLargeScreen: true,
      showOnTurnExchange: true
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
      {turnExchange ? (
        <div className='text-xs md:text-sm mt-4 lg:mx-8'>
          <table className='w-full border border-gray-300'>
            <thead>
              <tr className='bg-blue-800 text-white'>
                {columns.map((column) => (
                  <th
                    key={column.field}
                    className={`border cursor-pointer p-2 ${
                      column.showOnTurnExchange ? '' : 'hidden'
                    }`}
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
            <tbody>
              {currentPatients.map((patient, index) => (
                <PatientItem
                  key={patient.patient_id}
                  patient={patient}
                  index={index}
                  turnExchange={true}
                  newDoctor={newDoctor}
                  newNurse={newNurse}
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
      ) : (
        <div className='text-xs md:text-sm mt-4 lg:mx-8'>
          <table className='w-full border border-gray-300'>
            <thead>
              <tr className='bg-blue-800 text-white'>
                {columns.map((column) => (
                  <th
                    key={column.field}
                    className={`border cursor-pointer p-2 ${
                      column.showOnLargeScreen ? '' : 'hidden lg:table-cell'
                    }`}
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
            <tbody>
              {currentPatients.map((patient, index) => (
                <PatientItem
                  key={patient.patient_id}
                  patient={patient}
                  index={index}
                  turnExchange={false}
                  newDoctor={''}
                  newNurse={''}
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
      )}
    </>
  )
}

export default PatientsList
