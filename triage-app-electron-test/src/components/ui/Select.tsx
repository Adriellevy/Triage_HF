import React from 'react'

interface PropsSelect extends React.SelectHTMLAttributes<HTMLSelectElement> {}

export function Select(props: PropsSelect) {
  return <select className='w-full p-2 border rounded-md' {...props}></select>
}

export default Select