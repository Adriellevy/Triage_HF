import { Patient } from '@/interfaces/Patinet'
import PatientItem from './PatientItem'

interface PropsPatientsList {
  patients: Patient[]
}

function PatientsList({ patients }: PropsPatientsList) {
  return (
    <div className='mx-0 mt-4 lg:mx-8'>
      <table className='w-full border border-gray-300'>
        <thead>
          <tr className='min-w-full bg-blue-400'>
            <th className='border p-2 '>Name</th>
            <th className='border p-2 hidden lg:table-cell'>Age</th>
            <th className='border p-2 hidden lg:table-cell'>Entry Time</th>
            <th className='border p-2'>Triage Level</th>
            <th className='border p-2 hidden lg:table-cell'>Patient Medication</th>
            <th className='border p-2 hidden lg:table-cell'>Patient Problem</th>
            <th className='border p-2'>Patient Box</th>
            <th className='border p-2 hidden lg:table-cell'>Medic</th>
            <th className='border p-2 hidden lg:table-cell'>Nurse</th>
            <th className='border p-2'>Patient Status</th>
            <th className='border p-2'>Patients Actions</th>
          </tr>
        </thead>
        <tbody>
          {patients.map(
            (patient, index) =>
              patient && <PatientItem key={patient?.patient_id} patient={patient} index={index} />
          )}
        </tbody>
      </table>
    </div>
  )
}

export default PatientsList
