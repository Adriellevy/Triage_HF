import { getPatients } from '@/services/patientService'
import React, { useState, useEffect } from 'react'
import HorizontalBarChart from '../components/charts/HorizontalBarChart'

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
      position: 'right' as const
    },
    title: {
      display: true,
      text: 'Horizontal Bar Chart Title' // Set your desired title here
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
        const triageCount: Record<string, number> = {}

        for (let i = 0; i < RawPacientes.length; i++) {
          const triageLevel = RawPacientes[i].patient_triage_level
          if (triageCount[triageLevel]) {
            triageCount[triageLevel]++
          } else {
            triageCount[triageLevel] = 1
          }
        }

        for (const [triageLevel, count] of Object.entries(triageCount)) {
          labels.push(triageLevel)
          dataObtained.push(count)
        }

        const data: OriginalData = {
          labels,
          datasets: [
            {
              label: 'Pacientes',
              data: dataObtained,
              borderColor: 'rgb(53, 162, 235)',
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

  if (loading) {
    return <div>Loading...</div>
  }

  return (
    <div>
      <HorizontalBarChart data={DPacientes} />
    </div>
  )
}

export default StatsPatients
