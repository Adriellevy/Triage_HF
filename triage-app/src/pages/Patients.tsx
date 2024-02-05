import { useContext, useEffect, useState } from 'react'
import Cookies from 'js-cookie'
import PatientsList from '@/components/PatientsList'
import SearchPatientForm from '@/components/SearchPatientForm'
import { getPatients } from '../services/patientService'
import { Patient } from '../interfaces/Patinet'
import { SocketContext } from '@/contex/SocketContext'

function Patients() {
  const socket = useContext(SocketContext)
  const token = Cookies.get('authToken')
  const [patientsData, setPatientsData] = useState<Patient[] | null>(null)

  const onDelete = (patient_id: string) => {
    console.log(patient_id)
  }

  const onViewDetails = (patient_id: string) => {
    console.log(patient_id)
  }

  const onEdit = (patient_id: string) => {
    console.log(patient_id)
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (token) {
          if (token) {
            const data = await getPatients()
            setPatientsData(data)
          }
        } else {
          console.log('Error en fetch data de Patients.tsx')
        }
      } catch (error) {
        // console.error('Error al obtener pacientes:', error.message)
      }
    }
    fetchData()
  }, [token])

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (token) {
          if (token) {
            const data = await getPatients()
            setPatientsData(data)
          }
        } else {
          console.log('Error en fetch data de Patients.tsx')
        }
      } catch (error) {
        // console.error('Error al obtener pacientes:', error.message)
      }
    }
    if (socket) {
      socket.on('update', (data) => {
        if (data.message == 'New patient') {
          fetchData()
        }
      })
      return () => {
        socket.off('notification')
      }
    }
  }, [socket])

  return (
    <div>
      <SearchPatientForm onSearch={() => console.log('123')} />
      {patientsData ? (
        <PatientsList
          patients={patientsData}
          onDelete={onDelete}
          onViewDetails={onViewDetails}
          onEdit={onEdit}
        />
      ) : (
        <p>Cargando pacientes...</p>
      )}
    </div>
  )
}

export default Patients
