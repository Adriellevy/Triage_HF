import { getPatients } from '@/services/patientService'
import React, { useState, useEffect } from 'react'
import { VerticalBarChart } from './charts/VerticalBarChart'

function StatsPatients() {
  const [DPacientes, setDPacientes] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const RawPacientes = await getPatients()
        console.log(RawPacientes)

        const labels = []
        let dataObtained = []
        const triageCount = {}

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
        console.log('Labels: ' + labels)
        console.log('Data obtened: ' + dataObtained)
        const data = {
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
        setDPacientes(null) // Set an empty array or handle the error state accordingly
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  // Render the rest of your component using JSX
  if (loading) {
    return <div>Loading...</div> // or any other loading state
  }
  //PARECE QUE HAY UN TEMA COMO SE PASAN LOS DATOS O CUANDO PERO LOS DATOS LLEGAN BIEN
  console.log('Dpacientes: ' + DPacientes)
  return (
    <div>
      <VerticalBarChart data={DPacientes}></VerticalBarChart>
    </div>
  )
}

export default StatsPatients
