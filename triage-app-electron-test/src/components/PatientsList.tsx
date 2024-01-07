import { useState } from 'react'
import { Patient } from '../interfaces/Patinets'
import PatientItem from './PatientItem'
import PatientDetailModal from './PatientDetailModal'

interface PropsPatientsList {
  patients: Patient[]
  onDelete: (patient_id: string) => void
  onViewDetails: (patient_id: string) => void
  onEdit: (patient_id: string) => void
}

function PatientsList({ patients, onDelete }: PropsPatientsList) {
  const [showDetailModal, setShowDetailModal] = useState(false)
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null)

  const handleViewDetails = (patient: Patient) => {
    setSelectedPatient(patient)
    setShowDetailModal(true)
  }

  const handleDetailModalClose = () => {
    setShowDetailModal(false)
    setSelectedPatient(null)
  }

  // console.log(patients)
  return (
    <div className='mt-4 mx-8'>
      {/*<h2 className='text-2xl font-semibold mb-4'>Patients List</h2> */}
      <table className='min-w-full border border-gray-300'>
        <thead>
          <tr>
            <th className='border p-2'>Name</th>
            <th className='border p-2'>Date of Birth</th>
            <th className='border p-2'>Entry Time</th>
            <th className='border p-2'>Triage Level</th>
            <th className='border p-2'>Patient Medication</th>
            <th className='border p-2'>Patient Problem</th>
            <th className='border p-2'>Patient Box</th>
            <th className='border p-2'>Medic</th>
            <th className='border p-2'>Nurse</th>
            <th className='border p-2'>Patient Status</th>
            <th className='border p-2'>Patients Actions</th>
          </tr>
        </thead>
        <tbody>
          {patients.map((patient) => (
            <PatientItem
              key={patient.patient_id}
              patient={patient}
              onViewDetails={handleViewDetails}
              onEdit={() => console.log(123)}
              onDelete={onDelete}
            />
          ))}
        </tbody>
      </table>
      {showDetailModal && (
        <PatientDetailModal patient={selectedPatient} onClose={handleDetailModalClose} />
      )}
    </div>
  )
}

export default PatientsList
