import React, { useEffect, useState } from 'react'
import Cookies from 'js-cookie'
import { AuthProvider } from '@/contex/AuthContext'
import { HorizontalBarChart } from '../components/charts/HorizontalBarChart'
import { LineChart } from '../components/charts/LineCharts'
import { VerticalBarChart } from '../components/charts/VerticalBarChart'
import SelectorMenu from '@/components/SelectorMenu'
import TeamUsers from '@/components/UserConfig'
import BoxConfig from '@/components/Boxconfig'
import personas from '../assets/personas.png'
import carpa from '../assets/carpa-medica (3).png'
import StatsPatients from '@/components/StatsPatien'

function Stats() {
  const [windowWidth, setWindowWidth] = useState(window.innerWidth)

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth)
    }

    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  const token = Cookies.get('authToken')
  const [selectedOption, setSelectedOption] = useState(0)

  const chartOptions = [
    {
      label: 'Line Chart',
      image: null
    },
    {
      label: 'Vertical Bar Chart (1)',
      image: null
    },
    {
      label: 'Horizontal Bar Chart',
      image: carpa
    },
    {
      label: 'Vertical Bar Chart (2)',
      image: personas
    }
  ]

  return (
    <div className='flex h-screen justify-between items-center'>
      <div>
        <SelectorMenu options={chartOptions} onSelect={setSelectedOption} />
      </div>
      <div className={`w-full h-full lg:w-3/4 lg:h-5/6 ${windowWidth < 1100 ? 'lg:w-full' : ''}`}>
        {selectedOption === 0 && <LineChart />}
        {selectedOption === 1 && <StatsPatients />}
        {selectedOption === 2 && <HorizontalBarChart />}
        {selectedOption === 3 && <VerticalBarChart />}
      </div>
    </div>
  )
}

export default Stats
