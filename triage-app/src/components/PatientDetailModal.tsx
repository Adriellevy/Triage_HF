import React, { useState, useEffect } from 'react'
import { Patient } from '../interfaces/Patinet'
import EditPencil from '../icons/edit-pencil.svg'

interface PropsPatientDetailModal {
  patient: Patient
  onClose: () => void
  onEdit: (editedPatient: Patient) => void
}

type FieldConfig = {
  label: string
  type: string
  editable: boolean
}

type FieldsConfig = Record<string, FieldConfig>

const PatientDetailModal: React.FC<PropsPatientDetailModal> = ({ patient, onClose, onEdit }) => {
  const [isEditing, setIsEditing] = useState(false)
  const [editedData, setEditedData] = useState({ ...patient })
  const [editingField, setEditingField] = useState<string | null>(null)

  const [birthDate, setBirthDate] = useState<string | null>(null)
  const [entryTime, setEntryTime] = useState<string | null>(null)
  const [formatPatient, setFormatPatient] = useState(patient)

  useEffect(() => {
    const originalBirthDate = new Date(patient.date_of_birth)
    const entryTimeOriginal = new Date(patient.entry_time)
    //format options
    const dateFormat = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      hour12: true
    }
    const birthFormat = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour12: true
    }
    const formatoFechaHora = new Intl.DateTimeFormat('es-ES', dateFormat)
    const formatoNacimiento = new Intl.DateTimeFormat('es-ES', birthFormat)
    const formatEntryTime = formatoFechaHora.format(entryTimeOriginal)
    const formatBirthDate = formatoNacimiento.format(originalBirthDate)
    setEntryTime(formatEntryTime)
    setBirthDate(formatBirthDate)
    setFormatPatient({
      ...formatPatient,
      date_of_birth: formatBirthDate,
      entry_time: formatEntryTime
    })
  }, [])

  const fieldsConfig: FieldsConfig = {
    // patient_id: { label: 'Patient ID', type: 'text', editable: false },  //innecesario
    patient_name: { label: 'Patient Name', type: 'text', editable: false },
    date_of_birth: { label: 'Date of Birth', type: 'text', editable: false },
    entry_time: { label: 'Entry Time', type: 'text', editable: false },
    patient_triage_level: { label: 'Triage Level', type: 'text', editable: true },
    patient_medication: { label: 'Patient Medication', type: 'text', editable: true },
    patient_problem: { label: 'Patient Problem', type: 'text', editable: true },
    box_id: { label: 'Patient Box', type: 'text', editable: true },
    doctor_name: { label: 'Medic', type: 'text', editable: true },
    nurse_name: { label: 'Nurse', type: 'text', editable: true },
    patient_status: { label: 'Patient Status', type: 'text', editable: true }
  }

  console.log(fieldsConfig)

  const handleEdit = (field: string) => {
    if (!isEditing) {
      setIsEditing(true)
      setEditingField(field)
    }
  }

  const handleSave = () => {
    // onEdit(editedData)
    setIsEditing(false)
    setEditingField(null)
  }

  const handleCancelEdit = () => {
    setIsEditing(false)
    setEditingField(null)
    setEditedData({ ...patient })
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target

    if (fieldsConfig[name].editable) {
      setEditedData((prevData) => ({
        ...prevData,
        [name]: value
      }))
    }
  }

  return (
    <div className='fixed inset-0 flex items-center justify-center'>
      <div className='fixed inset-0 bg-black opacity-50'></div>
      <div className='bg-white p-6 rounded-md z-10'>
        <h2 className='text-2xl font-bold mb-4'>Patient Detailsa</h2>
        <div className='flex flex-col space-y-2'>
          {Object.entries(fieldsConfig).map(([fieldName, fieldConfig]) => (
            <p key={fieldName}>
              <strong>{fieldConfig.label}:</strong>{' '}
              {isEditing && editingField === fieldName ? (
                <>
                  <input
                    type={fieldConfig.type}
                    name={fieldName}
                    value={editedData[fieldName]}
                    onChange={handleChange}
                    className='border p-2 rounded-md'
                  />
                  {fieldConfig.editable && (
                    <>
                      <button
                        onClick={() => handleSave()}
                        className='bg-green-500 text-white p-2 rounded-md ml-2'
                      >
                        Save
                      </button>
                      <button
                        onClick={() => handleCancelEdit()}
                        className='bg-gray-500 text-white p-2 rounded-md ml-2'
                      >
                        Cancel
                      </button>
                    </>
                  )}
                </>
              ) : (
                <>
                  {formatPatient[fieldName]}
                  {!isEditing && fieldConfig.editable && (
                    <button
                      onClick={() => handleEdit(fieldName)}
                      className='bg-blue-500 text-sm text-white p-2 rounded-md ml-2'
                    >
                      Edit
                    </button>
                  )}
                </>
              )}
            </p>
          ))}
        </div>
        {!isEditing && (
          <button onClick={onClose} className='bg-gray-500 text-white p-2 rounded-md mt-4'>
            Close
          </button>
        )}
      </div>
    </div>
  )
}

export default PatientDetailModal
