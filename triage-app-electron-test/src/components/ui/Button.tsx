import React from 'react'

interface PropsInput extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  color: 'red' | 'blue' | 'green'
  wfull?: boolean
}

export function Button({ children, color, wfull = false, ...props }: PropsInput) {
  const colorVariants = {
    blue: 'bg-blue-500 hover:bg-blue-700',
    green: 'bg-green-500 hover:bg-green-700',
    red: 'bg-red-500 hover:bg-red-700'
  }

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
