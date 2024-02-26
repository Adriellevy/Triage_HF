import React from 'react'

interface PropsInput extends React.InputHTMLAttributes<HTMLInputElement> {
  error_active?: any
}

export function Input(props: PropsInput) {
  //detect Error for red border
  const errorBorder = props.error_active?.value == true ? 'border-red-500' : ''
  const errorMessage = props.error_active?.message
  return (
    <>
      <input className={`w-full p-2 border rounded-md ${errorBorder}`} {...props} />
      {errorBorder && <span className='text-red-500'>{errorMessage}</span>}
    </>
  )
}

export default Input
