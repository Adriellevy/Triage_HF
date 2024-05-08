import React from 'react'
import { useState } from 'react'
//import {useEffect}from 'react'
interface PropsInput extends React.InputHTMLAttributes<HTMLInputElement> {
  error_active?: { value: boolean | null; message: string }
}

export function Input(props: PropsInput) {
  //detect Error for red border
  const errorBorder = props.error_active?.value == true ? 'border-red-500' : ''
  const errorMessage = props.error_active?.message
  const [isFilled, setIsFilled] = useState<boolean>(false)
  const handleBlur = () => {
    props.value ? setIsFilled(true) : setIsFilled(false)
  }
  // useEffect(() => {
  //   if (props.value === '' || props.value === 0) {
  //     setIsFilled(false)
  //   }
  // }, [props.value])

  //console.log(props.value);
  return (
    <>
      <input
        onBlur={handleBlur}
        className={`w-full p-2 border rounded-md border-gray-300 ${errorBorder} ${
          isFilled ? 'opacity-60 bg-gray-400' : ''
        }`}
        {...props}
      />
      {errorBorder && <span className='text-red-500'>{errorMessage}</span>}
    </>
  )
}

export default Input
