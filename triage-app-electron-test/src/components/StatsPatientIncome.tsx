// Import LineChart instead of VerticalBarChart
import { getPatients } from '@/services/patientService'
import React, { useState, useEffect } from 'react'
import LineCharts from './charts/LineCharts' // Change the import to LineChart

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

function StatsPatientsIncome() {
  const [DPacientes, setDPacientes] = useState<OriginalData>({ labels: [], datasets: [] })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const RawPacientes = await getPatients()

        const labels: string[] = []
        const dataObtained: number[] = []
        const patientsPerDay: Record<string, number> = {} // Count patients per day

        for (let i = 0; i < RawPacientes.length; i++) {
          const entryDate = RawPacientes[i].entry_time
          const entryDay = entryDate.split('T')[0] // Extract the day from entry_date

          if (patientsPerDay[entryDay]) {
            patientsPerDay[entryDay]++
          } else {
            patientsPerDay[entryDay] = 1
          }
        }

        for (const [entryDay, count] of Object.entries(patientsPerDay)) {
          labels.push(entryDay)
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

  if (loading) {
    return <div>Loading...</div>
  }

  return (
    <div>
      {/* Use LineChart instead of VerticalBarChart */}
      <LineCharts data={DPacientes}></LineCharts>
    </div>
  )
}

export default StatsPatientsIncome
