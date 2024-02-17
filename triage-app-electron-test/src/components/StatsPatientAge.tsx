import { getPatients } from '@/services/patientService'
import React, { useState, useEffect } from 'react'
import VerticalBarChart from '../components/charts/VerticalBarChart'

interface OriginalData {
  labels: string[]
  datasets: {
    label: string
    data: number[]
    backgroundColor: string
  }[]
}

const options = {
  responsive: true,
  plugins: {
    legend: {
      position: 'top' as const
    },
    title: {
      display: true
    }
  }
}

function StatsPatients() {
  const [DPacientes, setDPacientes] = useState<OriginalData>({ labels: [], datasets: [] })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const RawPacientes = await getPatients()

        const labels: string[] = []
        const dataObtained: number[] = []
        const ageCount: Record<string, number> = {}

        for (let i = 0; i < RawPacientes.length; i++) {
          const ageGroup = getAgeGroup(RawPacientes[i].date_of_birth) // Assuming you have a property dateOfBirth
          if (ageCount[ageGroup]) {
            ageCount[ageGroup]++
          } else {
            ageCount[ageGroup] = 1
          }
        }

        for (const [ageGroup, count] of Object.entries(ageCount)) {
          labels.push(ageGroup)
          dataObtained.push(count)
        }

        const data: OriginalData = {
          labels,
          datasets: [
            {
              label: 'Pacientes',
              data: dataObtained,
              backgroundColor: 'rgba(53, 162, 235, 0.5)'
            }
          ]
        }

        setDPacientes(data)
        setLoading(false)
      } catch (error) {
        console.log('Error obtaining patient statistics: ' + error)
        setDPacientes({ labels: [], datasets: [] })
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const getAgeGroup = (dob: string): string => {
    const today = new Date()
    const birthDate = new Date(dob)
    const age = today.getFullYear() - birthDate.getFullYear()
    const decade = Math.floor(age / 10) * 10

    return `${decade}s`
  }

  if (loading) {
    return <div>Loading...</div>
  }

  return (
    <div>
      <VerticalBarChart data={DPacientes}></VerticalBarChart>
    </div>
  )
}

export default StatsPatients
