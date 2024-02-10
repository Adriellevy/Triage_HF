import React from 'react'

interface PropsInput extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  color: 'red' | 'blue' | 'green'
}

export function Button({ children, color, ...props }: PropsInput) {
  const colorVariants = {
    blue: 'bg-blue-500 hover:bg-blue-700',
    green: 'bg-green-500 hover:bg-green-700',
    red: 'bg-red-500 hover:bg-red-700'
  }

  return (
    <button className={`w-full ${colorVariants[color]} text-white p-2 rounded-md`} {...props}>
      {children}
    </button>
  )
}

export default Button
