import React from 'react'

interface PropsInput extends React.LabelHTMLAttributes<HTMLLabelElement> {}

export function Label({ children, ...props }: PropsInput) {
  return (
    <label className='block text-gray-600 text-sm font-bold mb-2' {...props}>
      {children}
    </label>
  )
}

export default Label
