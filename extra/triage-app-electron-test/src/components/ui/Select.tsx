import React from 'react'

interface PropsSelect extends React.SelectHTMLAttributes<HTMLSelectElement> {
  error_active?: { value: boolean | null; message: string }
}

export function Select(props: PropsSelect) {
  const errorBorder = props.error_active?.value == true ? 'border-red-500' : ''
  const errorMessage = props.error_active?.message
  return (
    <>
      <select className={`w-full p-2 border rounded-md ${errorBorder}`} {...props}></select>
      {errorBorder && <span className='text-red-500'>{errorMessage}</span>}
    </>
  )
}

export default Select
