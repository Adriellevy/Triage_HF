import React from 'react'

interface PropsInput extends React.InputHTMLAttributes<HTMLInputElement> {}

export function Input(props: PropsInput) {
  return <input className='w-full p-2 border rounded-md' {...props} />
}

export default Input
