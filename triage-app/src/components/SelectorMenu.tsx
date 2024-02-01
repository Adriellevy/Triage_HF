import React, { useState } from 'react'

interface Option {
  label: string
  image: string
}

interface SelectorMenuProps {
  options: Option[]
  onSelect: (index: number) => void
}

const SelectorMenu: React.FC<SelectorMenuProps> = ({ options, onSelect }) => {
  const [selectedOption, setSelectedOption] = useState<number | null>(null)

  return (
    <div className='selector-menu-container ml-4 w-40 border-r border-gray-300 p-2 bg-white rounded-lg shadow-md'>
      <div className='selector-menu'>
        {options.map((option, index) => (
          <div
            key={index}
            className={`selector-option flex items-center p-2 mt-2 cursor-pointer transition duration-200  ${
              selectedOption === index
                ? 'active bg-blue-500 text-white'
                : 'bg-gray-100 hover:bg-gray-200'
            }`}
            onClick={() => {
              setSelectedOption(index)
              onSelect(index)
            }}
          >
            <div className='relative w-8 h-8 mr-2'>
              <div className='absolute -bottom-4 left-0 right-0 top-4 transform -translate-y-1/3 bg-gray-200 rounded-full border-2'>
                <img
                  src={option.image}
                  alt={option.label}
                  className='w-6 h-6 absolute left-0 bottom-0 right-0  rounded-full'
                />
              </div>
            </div>
            <p className='truncate'>{option.label}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default SelectorMenu
