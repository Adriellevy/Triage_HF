import React, { useState } from 'react'
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline'
import { Button } from './ui/Button'
import { User } from '../interfaces/User'
import { Box } from '../interfaces/Boxes'
import { Patient } from '../interfaces/Patinet'

interface ConfirmationDialogProps {
  show: boolean
  title: string
  message: string
  recomendation: string
  warning: string
  confirm: string
  cancel: string
  object: Box | Patient | User
  confirmDelete: () => void
  cancelDelete: () => void
  warningField?: string
  fieldTranslations: { [key: string]: string }
  ignoreFields?: string[]
}

const ConfirmationDialog: React.FC<ConfirmationDialogProps> = ({
  show,
  title,
  message,
  recomendation,
  warning,
  confirm,
  cancel,
  object,
  confirmDelete,
  cancelDelete,
  warningField,
  fieldTranslations,
  ignoreFields = []
}) => {
  if (!show) return null

  // VARIABLE DE ESTADO PARA PROBAR COMO SE RECIBE EL OBJETO
  const [showNullFields, setShowNullFields] = useState(false)

  const objectEntries = Object.entries(object)

  return (
    <div className='fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-50'>
      <div className='bg-white p-8 rounded-lg shadow-lg'>
        <h2 className='text-center text-lg font-semibold mb-4'>{title}</h2>
        <p className='text-center mb-4'>{message}</p>

        <div className='mb-4'>
          {objectEntries
            .filter(([key, value]) => !ignoreFields.includes(key)) // Filtrar campos a ignorar
            .filter(([key, value]) => showNullFields || value !== null) // Filtrar campos nulos si showNullFields es false
            .map(([key, value]) => (
              <p key={key}>
                {fieldTranslations[key] || key}: {value}
              </p>
            ))}
          {warningField && object[warningField] && (
            <div className='p-4 border border-yellow-500 bg-yellow-100 rounded'>
              <div className='flex items-center text-yellow-600 mb-2'>
                <ExclamationTriangleIcon className='w-5 h-5 mr-2' />
                <strong>{warning}</strong>
              </div>
              <p className='text-yellow-800 mb-2'>
                {fieldTranslations[warningField] || warningField}:{' '}
                <span className='font-semibold'>{object[warningField]}</span>
              </p>
              <p className='text-yellow-700'>{recomendation}</p>
            </div>
          )}
        </div>
        <div className='flex justify-center gap-4'>
          <Button
            onClick={confirmDelete}
            className='bg-red-500 text-white py-2 px-4 rounded flex items-center hover:bg-red-600 transition duration-300'
            color={'red'}
          >
            {warningField && object[warningField] && (
              <ExclamationTriangleIcon className='w-5 h-5 mr-2' />
            )}
            {confirm}
          </Button>
          <Button
            onClick={cancelDelete}
            className='bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600 transition duration-300'
            color={'grey'}
          >
            {cancel}
          </Button>
        </div>
      </div>
    </div>
  )
}

export default ConfirmationDialog
