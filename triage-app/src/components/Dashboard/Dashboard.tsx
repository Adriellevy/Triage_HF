import { useContext, useEffect, useState } from 'react'
import { DashboardData } from '@/interfaces/Dashboard'
import Card from './Card'
import { SocketEvent, UpdateEvent } from '@/interfaces/Socket'
import { getDashboardData } from '@/services/dashboardService'
import { SocketContext } from '@/contex/SocketContext'

function Dashboard() {
  const socket = useContext(SocketContext)
  const [Data, setData] = useState<DashboardData>({
    PatientsCount: 0,
    OutsidePatientsCount: 0,
    TriageIIPatientsCount: 0,
    AvailableBoxesCount: 0,
    message: 'Loading'
  })

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getDashboardData()
        setData(data)
      } catch (error) {
        console.error((error as Error).message)
      }
    }
    fetchData()
  }, [])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getDashboardData()
        setData(data)
      } catch (error) {
        console.error((error as Error).message)
      }
    }
    if (socket) {
      socket.on(SocketEvent.UPDATE, (data) => {
        if (data.message == UpdateEvent.NEW_PATIENT || data.message == UpdateEvent.UPDATE_PATIENT) {
          fetchData()
        }
      })
      return () => {
        socket.off(SocketEvent.UPDATE)
      }
    }
  }, [socket])

  return (
    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 justify-between my-14 max-w-6xl mx-auto'>
      <Card url='/patients' label='Pacientes Totales' number={Data.PatientsCount} />
      <Card
        url='/patients/?patient_status=AFUERA'
        label='Pacientes Afuera'
        number={Data.OutsidePatientsCount}
      />
      <Card url='/boxes' label='Boxes Disponibles' number={Data.AvailableBoxesCount} />
      <Card url='/patients/?triage=2' label='Triage II' number={Data.TriageIIPatientsCount} />
    </div>
  )
}

export default Dashboard
