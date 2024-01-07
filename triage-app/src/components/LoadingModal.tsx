//import React from 'react'

function LoadingModal() {
  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center bg-gray-800 bg-opacity-50'>
      <div className='bg-white p-8 rounded-md shadow-lg'>
        <p className='text-lg font-semibold'>Loading...</p>
      </div>
    </div>
  )
}

export default LoadingModal
