import { useState } from 'react'
import { User, UserRole } from '@/interfaces/User'
import { Box, BoxType } from '@/interfaces/Boxes'
import { Patient } from '@/interfaces/Patient'
import { Button } from '@/components/ui'
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCircleInfo } from '@fortawesome/free-solid-svg-icons'
import { Tooltip } from '@mui/material'
import LoaderSpin from '../LoaderSpin'

interface PropsEditModal<T> {
  title: string
  object: T
  onClose: () => void
  onSave: (updatedObject: T) => void
  fieldTranslations: { [key: string]: string }
  cancel: string
  confirm: string
  ignoreFields?: string[]
  warningFields?: { [key: string]: string }
  ErrorFields?: { [key: string]: string }
  security?: string
  loading?: boolean
}

function EditModal<T extends User | Box | Patient>({
  title,
  object,
  onClose,
  onSave,
  fieldTranslations,
  cancel,
  confirm,
  ignoreFields = [],
  warningFields = {},
  ErrorFields = {},
  security,
  loading
}: PropsEditModal<T>) {
  const [editedObject, setEditedObject] = useState<T>(object)

  const handleChange = (key: keyof T, value: any) => {
    setEditedObject((prevState) => ({ ...prevState, [key]: value }))
  }

  const handleSave = () => {
    onSave(editedObject)
  }

  const handleContainerClick = () => {
    onClose()
  }

  const objectEntries = Object.entries(editedObject)
  return (
    <div
      className='fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-35'
      onClick={handleContainerClick}
    >
      <div
        className='bg-white p-8 rounded-lg w-1/3 max-h-full overflow-y-auto'
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className='text-xl mb-4'>{title}</h2>
        {loading && <LoaderSpin />}
        {!loading && (
          <div>
            <form>
              {objectEntries
                .filter(([key]) => !ignoreFields.includes(key))
                .map(([key, value]) => (
                  <div key={key} className='mb-4'>
                    <label className='block text-gray-700 text-sm font-bold mb-2'>
                      {fieldTranslations[key] || key}
                      {key.includes('password') && security && (
                        <Tooltip title={security}>
                          <FontAwesomeIcon
                            icon={faCircleInfo}
                            className='text-blue-500 ml-2 cursor-pointer'
                          />
                        </Tooltip>
                      )}
                    </label>

                    {ErrorFields[key] && (
                      <div className='mb-2 p-2 bg-red-100 text-yellow-800 border border-red-500 rounded flex items-center'>
                        <ExclamationTriangleIcon className='w-5 h-5 mr-2' />
                        <p className='text-sm'>{ErrorFields[key]}</p>
                      </div>
                    )}

                    {key === 'user_type' ? (
                      <select
                        className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
                        value={value as string}
                        onChange={(e) => handleChange(key as keyof T, e.target.value)}
                      >
                        <option value={UserRole.DOCTOR}>
                          {fieldTranslations['UserRole.DOCTOR']}
                        </option>
                        <option value={UserRole.NURSE}>
                          {fieldTranslations['UserRole.NURSE']}
                        </option>
                        <option value={UserRole.HOSPITAL}>
                          {fieldTranslations['UserRole.HOSPITAL']}
                        </option>
                      </select>
                    ) : key === 'box_type' ? (
                      <select
                        className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
                        value={value as string}
                        onChange={(e) => handleChange(key as keyof T, e.target.value)}
                      >
                        <option value={BoxType.CONSULTORIO}>
                          {fieldTranslations['BoxType.CONSULTORIO']}
                        </option>
                        <option value={BoxType.HOSPITALIZATION}>
                          {fieldTranslations['BoxType.HOSPITALIZATION']}
                        </option>
                        <option value={BoxType.OBSERVACION}>
                          {fieldTranslations['BoxType.OBSERVACION']}
                        </option>
                        <option value={BoxType.SHOOCKROOM}>
                          {fieldTranslations['BoxType.SHOOCKROOM']}
                        </option>
                      </select>
                    ) : typeof value === 'string' || typeof value === 'number' ? (
                      <input
                        type={key.includes('password') ? 'password' : 'text'}
                        className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
                        value={value as string}
                        onChange={(e) => handleChange(key as keyof T, e.target.value)}
                      />
                    ) : null}

                    {warningFields[key] && (
                      <div className='mt-2 p-2 bg-yellow-100 text-yellow-800 border border-yellow-500 rounded flex items-center'>
                        <ExclamationTriangleIcon className='w-5 h-5 mr-2' />
                        <p className='text-sm'>{warningFields[key]}</p>
                      </div>
                    )}
                  </div>
                ))}
            </form>
            <div className='flex justify-end'>
              <div className='p-2'>
                <Button color='red' onClick={onClose}>
                  {cancel}
                </Button>
              </div>
              <div className='p-2'>
                <Button color='green' onClick={handleSave}>
                  {confirm}
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default EditModal
