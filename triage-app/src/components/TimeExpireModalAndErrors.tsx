import React from 'react'
import { useTranslation } from 'react-i18next'

interface TimeExpireModalProps {
  message: string
  onClose: () => void
}

const TimeExpireModalAndErrors: React.FC<TimeExpireModalProps> = ({ message, onClose }) => {
  const { t } = useTranslation('TimeExpireModalAndErrors')
  return (
    <div className='fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-50 z-10'>
      <div className='bg-white p-8 rounded-lg shadow-lg'>
        <h2 className='text-center text-lg font-semibold mb-4'>{t('Time_Expired')} </h2>
        <p className='text-center mb-4'>{message}</p>
        <div className='flex justify-center gap-4'>
          <button
            onClick={onClose}
            className='bg-green-500 text-white py-2 px-4 rounded hover:bg-gray-600 transition duration-300'
          >
            {t('Renew')}
          </button>
          <button
            onClick={onClose}
            className='bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600 transition duration-300'
          >
            {t('CloseSesion')}
          </button>
        </div>
      </div>
    </div>
  )
}

export default TimeExpireModalAndErrors
