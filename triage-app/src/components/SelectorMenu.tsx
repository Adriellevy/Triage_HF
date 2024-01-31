import React, { useState, useEffect, useRef } from 'react'

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

  const [sidebarVisible, setSidebarVisible] = useState(true)
  const sidebarRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const handleResize = () => {
      if (sidebarRef.current) {
        const itemCount = options.length
        const minWidth = 40 // Minimum width for the selector
        const maxWidth = 300 // Maximum width for the selector

        const calculatedWidth = Math.min(
          minWidth + (itemCount - 1) * 20, // Adjust 30 as needed based on your design
          maxWidth
        )
        if (window.innerWidth <= 767) {
          setSidebarVisible(false)
          sidebarRef.current.style.left = '0%'
          sidebarRef.current.style.right = '0%'
          sidebarRef.current.style.maxWidth = '90%'
        } else if (window.innerWidth <= 1100) {
          setSidebarVisible(false)
          sidebarRef.current.style.position = 'fixed'
          sidebarRef.current.style.bottom = '0'
          sidebarRef.current.style.width = `${calculatedWidth * 100}px`
          sidebarRef.current.style.maxWidth = '68%'
          sidebarRef.current.style.left = '28%'
          sidebarRef.current.style.right = '0%'
        } else {
          setSidebarVisible(true)
          sidebarRef.current.style.position = 'static'
          sidebarRef.current.style.bottom = 'unset'
          sidebarRef.current.style.width = 'auto'
          sidebarRef.current.style.left = '28%'
          sidebarRef.current.style.right = '30%'
        }
      }
    }

    window.addEventListener('resize', handleResize)
    handleResize()

    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [options.length])

  return (
    <div
      ref={sidebarRef}
      className={`selector-menu-container ${
        sidebarVisible ? 'mx-auto ml-4' : 'fixed bottom-0 w-full mx-auto pl-6 '
      } w-40 border-r border-gray-300 p-2 bg-white rounded-lg shadow-md`}
    >
      <div
        className={`selector-menu ${
          sidebarVisible ? 'flex flex-col' : 'flex flex-row overflow-x-auto'
        }`}
      >
        {options.map((option, index) => (
          <div
            key={index}
            className={` align-middle selector-option flex p-2 mt-2 cursor-pointer transition duration-200 ml-1  ${
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
