import { useEffect, useState } from 'react'
import SelectorMenu from '@/components/SelectorMenu'
import personas from '../assets/personas.png'
import carpa from '../assets/carpa-medica (3).png'
import StatsPatients from '@/components/StatsPatientTriage'
import StatsUsers from '@/components/StatsUsers'
import StatsPatientsIncome from '@/components/StatsPatientIncome'
import StatsPatientsAge from '@/components/StatsPatientAge'
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

  const [selectedOption, setSelectedOption] = useState(0)

  const chartOptions = [
    {
      label: 'Ingreso Pacientes por Fecha',
      image: null
    },
    {
      label: 'Pacientes por Triage',
      image: null
    },
    {
      label: 'Pacientes por Triage (2)',
      image: carpa
    },
    {
      label: 'Pacientes por decadas',
      image: personas
    }
  ]

  return (
    <div className='flex h-screen justify-between items-center'>
      <div>
        <SelectorMenu options={chartOptions} onSelect={setSelectedOption} />
      </div>
      <div className={`w-full h-full lg:w-3/4 lg:h-5/6 ${windowWidth < 1100 ? 'lg:w-full' : ''}`}>
        {selectedOption === 0 && <StatsPatientsIncome />}
        {selectedOption === 1 && <StatsPatients />}
        {selectedOption === 2 && <StatsUsers />}
        {selectedOption === 3 && <StatsPatientsAge />}
      </div>
    </div>
  )
}

export default Stats
