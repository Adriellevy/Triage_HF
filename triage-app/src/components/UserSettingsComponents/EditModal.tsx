import { useState } from 'react'
import { User, UserRole } from '@/interfaces/User'
import { Box } from '@/interfaces/Boxes'
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
  security,
  loading
}: PropsEditModal<T>) {
  const [editedObject, setEditedObject] = useState<T>(object)

  const handleChange = (key: keyof T, value: any) => {
    setEditedObject((prevState) => ({ ...prevState, [key]: value }))
  }

  const handleSave = () => {
    onSave(editedObject) // Pasar el objeto editado al método onSave
  }

  const objectEntries = Object.entries(editedObject)

  return (
    <div
      className='fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-35'
      onClick={onClose}
    >
      <div
        className='bg-white p-8 rounded-lg w-1/3 max-h-full overflow-y-auto'
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className='text-xl mb-4'>{title}</h2>
        {loading && <LoaderSpin></LoaderSpin>}
        {!loading && (
          <form>
            {objectEntries
              .filter(([key]) => !ignoreFields.includes(key)) // Filtrar campos a ignorar
              .map(([key, value]) => (
                <div key={key} className='mb-4'>
                  <label className='block text-gray-700 text-sm font-bold mb-2'>
                    {fieldTranslations[key] || key}
                    {key.includes('password') && (
                      <Tooltip id='password-tooltip' title={security}>
                        <FontAwesomeIcon
                          icon={faCircleInfo}
                          className='text-blue-500 ml-2 cursor-pointer'
                          data-tooltip-id='password-tooltip'
                          data-tooltip-content=''
                        />
                      </Tooltip>
                    )}
                  </label>

                  <div className='relative'>
                    {typeof value === 'string' || typeof value === 'number' ? (
                      <>
                        <input
                          type={key.includes('password') ? 'password' : 'text'}
                          className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
                          value={value as string}
                          onChange={(e) => handleChange(key as keyof T, e.target.value)}
                        />
                      </>
                    ) : key === 'user_type' ? (
                      <select
                        className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
                        value={value as string}
                        onChange={(e) => handleChange(key as keyof T, e.target.value)}
                      >
                        <option value={UserRole.DOCTOR}>Doctor</option>
                        <option value={UserRole.NURSE}>Nurse</option>
                        <option value={UserRole.HOSPITAL}>Hospital</option>
                      </select>
                    ) : null}
                  </div>

                  {/* Mostrar advertencia si el campo está en warningFields */}
                  {warningFields[key] && (
                    <div className='mt-2 p-2 bg-yellow-100 text-yellow-800 border border-yellow-500 rounded flex items-center'>
                      <ExclamationTriangleIcon className='w-5 h-5 mr-2' />
                      <p className='text-sm'>{warningFields[key]}</p>
                    </div>
                  )}
                </div>
              ))}
            <div className='flex justify-end'>
              <Button color='red' onClick={onClose}>
                {cancel}
              </Button>
              <Button color='green' onClick={handleSave} className='ml-2'>
                {confirm}
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}

export default EditModal
