import React, { useState } from 'react'
import SelectorMenu from '@/components/SelectorMenu'
import TeamUsers from '@/components/UserConfig'
import BoxConfig from '@/components/Boxconfig'
import personas from '../assets/personas.png'
import carpa from '../assets/carpa-medica (3).png'

const GuidedEntry = () => {
  const [selectedOption, setSelectedOption] = useState(0)

  const options = [
    {
      label: 'Team Users',
      image: personas
    },
    {
      label: 'Box Config',
      image: carpa
    }
  ]

  return (
    <div className='flex h-screen'>
      <div className='w-1/4 pt-44 mr-4' style={{ minWidth: '100px' }}>
        {' '}
        {/* Adjust the minWidth as needed */}
        <SelectorMenu options={options} onSelect={setSelectedOption} />
      </div>
      <div className='pt-20'>
        {selectedOption === 0 && <TeamUsers />}
        {selectedOption === 1 && <BoxConfig />}
      </div>
    </div>
  )
}

export default GuidedEntry
