import React, { useState } from 'react'
import { User } from '../interfaces/User'
import EditPencil from '../icons/edit-pencil.svg'

interface PropsPatientDetailModal {
  user: User
  onClose: () => void
  onEdit: (editedUser: User) => void
}

type FieldConfig = {
  label: string
  type: string
  editable: boolean
}

type FieldsConfig = Record<string, FieldConfig>

const UserDetailModal: React.FC<PropsPatientDetailModal> = ({ user, onClose, onEdit }) => {
  const [isEditing, setIsEditing] = useState(false)
  const [editedData, setEditedData] = useState({ ...user })
  const [editingField, setEditingField] = useState<string | null>(null)

  const fieldsConfig: FieldsConfig = {
    user_name: { label: 'User ID', type: 'text', editable: false },
    user_type: { label: 'User Name', type: 'text', editable: false },
    speciality: { label: 'Speciality', type: 'text', editable: true },
    state: { label: 'State', type: 'text', editable: true }
  }

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
    setEditedData({ ...user })
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
        <h2 className='text-2xl font-bold mb-4'>User Details</h2>
        <div className='flex flex-col space-y-2'>
          {Object.entries(fieldsConfig).map(([user_name, fieldConfig]) => (
            <p key={user_name}>
              <strong>{fieldConfig.label}:</strong>{' '}
              {isEditing && editingField === user_name ? (
                <>
                  <input
                    type={fieldConfig.type}
                    name={user_name}
                    value={editedData[user_name]}
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
                  {user[user_name]}
                  {!isEditing && fieldConfig.editable && (
                    <button
                      onClick={() => handleEdit(user_name)}
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

export default UserDetailModal
