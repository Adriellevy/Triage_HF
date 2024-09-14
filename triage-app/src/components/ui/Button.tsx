import { grey } from '@mui/material/colors'
import React from 'react'

interface PropsInput extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  color: 'red' | 'blue' | 'green' | 'yellow' | 'grey' | 'grey_disabled' | null
  wfull?: boolean
}

export function Button({ children, color, wfull = false, ...props }: PropsInput) {
  const colorVariants = {
    blue: 'bg-blue-500 hover:bg-blue-700',
    green: 'bg-green-500 hover:bg-green-700',
    red: 'bg-red-500 hover:bg-red-700',
    yellow: 'bg-yellow-500 hover:bg-yellow-700',
    grey: 'bg-slate-500 hover:bg-slate-700',
    grey_disabled: 'bg-slate-500'
  }
  if (!color) color = 'grey_disabled'
  return (
    <button
      className={`
    ${wfull ? 'w-full' : ' '}
    py-2 px-4 ${colorVariants[color]} text-white rounded-md`}
      {...props}
    >
      {children}
    </button>
  )
}

export default Button
