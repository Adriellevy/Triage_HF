import { useState } from 'react'
import PatientItem from '@/components/PatientList/PatientItem'
import { Patient } from '@/interfaces/Patinet'

interface PropsPatientsList {
  patients: Patient[]
}

function PatientsList({ patients }: PropsPatientsList) {
  const [sortColumn, setSortColumn] = useState<string | null>(null)
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc')

  const columns = [
    { label: 'Name', field: 'patient_name', sortable: true, showOnLargeScreen: true },
    { label: 'Age', field: 'date_of_birth', sortable: true, showOnLargeScreen: false },
    { label: 'Entry Time', field: 'entry_time', sortable: true, showOnLargeScreen: false },
    {
      label: 'Triage Level',
      field: 'patient_triage_level',
      sortable: true,
      showOnLargeScreen: true
    },
    {
      label: 'Patient Medication',
      field: 'patient_medication',
      sortable: true,
      showOnLargeScreen: false
    },
    {
      label: 'Patient Problem',
      field: 'patient_problem',
      sortable: true,
      showOnLargeScreen: false
    },
    { label: 'Patient Box', field: 'box_code', sortable: true, showOnLargeScreen: true },
    { label: 'Medic', field: 'doctor_name', sortable: true, showOnLargeScreen: false },
    { label: 'Nurse', field: 'nurse_name', sortable: true, showOnLargeScreen: false },
    { label: 'Patient Status', field: 'patient_status', sortable: true, showOnLargeScreen: true },
    { label: 'Patients Actions', field: 'actions', sortable: false, showOnLargeScreen: true }
  ]

  const handleSort = (column: string) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortColumn(column)
      setSortDirection('asc')
    }
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
        <tbody>
          {sortedPatients.map((patient, index) => (
            <PatientItem key={patient?.patient_id} patient={patient} index={index} />
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default PatientsList
