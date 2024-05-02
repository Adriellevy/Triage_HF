import React from 'react'
import { useState, useEffect } from 'react'

interface PropsSelect extends React.SelectHTMLAttributes<HTMLSelectElement> {
  error_active?: { value: boolean | null; message: string }
}

export function Select(props: PropsSelect) {
  const errorBorder = props.error_active?.value == true ? 'border-red-500' : ''
  const errorMessage = props.error_active?.message
  const [isFilled, setIsFilled] = useState<boolean>(false)

  const handleBlur = () => {
    props.value ? setIsFilled(true) : setIsFilled(false)
  }
  useEffect(() => {
    if (props.value === '' || props.value === 0) {
      setIsFilled(false);
  }
  }, [props.value])
  return (
    <>
      <select onBlur={handleBlur} className={`w-full p-2 border rounded-md ${errorBorder} ${
          isFilled ? 'opacity-60 bg-gray-400' : ''
        }`} {...props}></select>
      {errorBorder && <span className='text-red-500'>{errorMessage}</span>}
    </>
  )
}

export default Select
