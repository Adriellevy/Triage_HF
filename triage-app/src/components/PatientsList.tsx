import { useState } from 'react'
import PatientItem from '@/components/PatientItem'
import { Patient } from '@/interfaces/Patinet'

interface PropsPatientsList {
  patients: Patient[]
}

function PatientsList({ patients }: PropsPatientsList) {
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
          <tr className='min-w-full bg-blue-400'>
            <th className='border p-2 ' onClick={() => handleSort('patient_name')}>
              {' '}
              Name{' '}
              {sortColumn === 'patient_name' && <span>{sortDirection === 'asc' ? '▲' : '▼'}</span>}
            </th>
            <th
              className='border p-2 hidden lg:table-cell'
              onClick={() => handleSort('date_of_birth')}
            >
              Age{' '}
              {sortColumn === 'date_of_birth' && <span>{sortDirection === 'asc' ? '▲' : '▼'}</span>}
            </th>
            <th
              className='border p-2 hidden lg:table-cell'
              onClick={() => handleSort('entry_time')}
            >
              Entry Time{' '}
              {sortColumn === 'entry_time' && <span>{sortDirection === 'asc' ? '▲' : '▼'}</span>}
            </th>
            <th className='border p-2' onClick={() => handleSort('patient_triage_level')}>
              Triage Level{' '}
              {sortColumn === 'patient_triage_level' && (
                <span>{sortDirection === 'asc' ? '▲' : '▼'}</span>
              )}
            </th>
            <th
              className='border p-2 hidden lg:table-cell'
              onClick={() => handleSort('patient_medication')}
            >
              Patient Medication{' '}
              {sortColumn === 'patient_medication' && (
                <span>{sortDirection === 'asc' ? '▲' : '▼'}</span>
              )}
            </th>
            <th
              className='border p-2 hidden lg:table-cell'
              onClick={() => handleSort('patient_problem')}
            >
              Patient Problem{' '}
              {sortColumn === 'patient_problem' && (
                <span>{sortDirection === 'asc' ? '▲' : '▼'}</span>
              )}
            </th>
            <th className='border p-2' onClick={() => handleSort('box_id')}>
              Patient Box{' '}
              {sortColumn === 'box_id' && <span>{sortDirection === 'asc' ? '▲' : '▼'}</span>}
            </th>
            <th
              className='border p-2 hidden lg:table-cell'
              onClick={() => handleSort('doctor_name')}
            >
              Medic{' '}
              {sortColumn === 'doctor_name' && <span>{sortDirection === 'asc' ? '▲' : '▼'}</span>}
            </th>
            <th
              className='border p-2 hidden lg:table-cell'
              onClick={() => handleSort('nurse_name')}
            >
              Nurse{' '}
              {sortColumn === 'nurse_name' && <span>{sortDirection === 'asc' ? '▲' : '▼'}</span>}
            </th>
            <th className='border p-2' onClick={() => handleSort('patient_status')}>
              Patient Status{' '}
              {sortColumn === 'patient_status' && (
                <span>{sortDirection === 'asc' ? '▲' : '▼'}</span>
              )}
            </th>
            <th className='border p-2'>Patients Actions</th>
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
