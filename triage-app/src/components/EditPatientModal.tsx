import { useState, useEffect, ChangeEvent } from 'react'
import { Patient } from '../interfaces/Patinet'
//TODO:
import { updatePatient } from '../services/patientService'

interface EditPatientModalProps {
  patient: Patient
  onClose: () => void
  onSave: (editedPatient: { patient_name: string }) => void
}

function EditPatientModal({ patient, onClose, onSave }: EditPatientModalProps) {
  const [editedPatient, setEditedPatient] = useState<Patient | null>(null)

  useEffect(() => {
    setEditedPatient({ ...patient })
  }, [patient])

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    event.preventDefault()
    const { name, value } = event.target
    // TODO: Agregar más campos
    setEditedPatient(editedPatient)
  }

  const handleSave = async () => {
    try {
      //TODO:
      // await updatePatient(editedPatient)
      if (editedPatient) {
        onSave(editedPatient)
      }
      onClose()
    } catch (error) {
      console.error('Error al actualizar paciente:', error.message)
    }
  }

  return (
    <div className='fixed inset-0 flex items-center justify-center'>
      <div className='fixed inset-0 bg-black opacity-50'></div>
      <div className='bg-white p-6 rounded-md z-10'>
        <h2 className='text-2xl font-bold mb-4'>Edit Patient</h2>
        <label className='block mb-4'>
          Name:
          <input
            type='text'
            name='patient_name'
            value={editedPatient.patient_name}
            onChange={handleInputChange}
            className='border rounded-md p-2 w-full'
          />
        </label>
        {/* TODO: Agregar más campos */}
        <div className='flex space-x-4'>
          <button onClick={handleSave} className='bg-blue-500 text-white p-2 rounded-md flex-1'>
            Save
          </button>
          <button onClick={onClose} className='bg-gray-500 text-white p-2 rounded-md flex-1'>
            Cancel
          </button>
        </div>
      </div>
    </div>
  )
}

export default EditPatientModal
