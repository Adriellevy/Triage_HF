import { useEffect, useState } from 'react'
import Card from './Card'

interface Data {
  Patients: number
  PatientsAFUERA: number
  Boxes: number
  PatientsTriage: number
}

function Dashboard() {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [Data, setData] = useState<Data>({
    Patients: 120,
    PatientsAFUERA: 20,
    Boxes: 20,
    PatientsTriage: 2
  })

  useEffect(() => {
    const data = {
      Patients: 120,
      PatientsAFUERA: 20,
      Boxes: 20,
      PatientsTriage: 2
    }

    setData(data)
  }, [])

  return (
    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 justify-between my-14 max-w-6xl mx-auto'>
      <Card url='/patients' label='Pacientes Totales' number={Data.Patients} />
      <Card
        url='/patients/?patient_status=AFUERA'
        label='Pacientes Afuera'
        number={Data.PatientsAFUERA}
      />
      <Card url='/boxes' label='Boxes Disponibles' number={Data.Boxes} />
      <Card url='/patients/?triage=2' label='Triage II' number={Data.PatientsTriage} />
    </div>
  )
}

export default Dashboard
