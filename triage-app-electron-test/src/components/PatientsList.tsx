import { useState } from 'react'
import { Patient } from '@/interfaces/Patinet'
import PatientItem from './PatientItem'
import PatientDetailModal from './PatientDetailModal'

interface PropsPatientsList {
  patients: Patient[]
}

function PatientsList({ patients }: PropsPatientsList) {
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

  const handleEditPatient = (updatedPatient: Patient) => {
    // Update the patient in the parent component's state
    // You need to implement the logic to update the patient in your state here
    console.log('Updated patient:', updatedPatient)
  }

  // console.log(patients)
  return (
    <div className='mx-0 mt-4 lg:mx-8'>
      {/*<h2 className='text-2xl font-semibold mb-4'>Patients List</h2> */}
      <table className='w-full border border-gray-300'>
        <thead>
          <tr className='min-w-full'>
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
            (patient) =>
              patient && (
                <PatientItem
                  key={patient?.patient_id}
                  patient={patient}
                  onViewDetails={handleViewDetails}
                />
              )
          )}
        </tbody>
      </table>
      {showDetailModal && selectedPatient && (
        <PatientDetailModal
          patient={selectedPatient}
          onClose={handleDetailModalClose}
          onEdit={handleEditPatient}
        />
      )}
    </div>
  )
}

export default PatientsList
