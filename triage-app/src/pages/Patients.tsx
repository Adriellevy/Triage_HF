import { useContext, useEffect, useState } from 'react'
import Cookies from 'js-cookie'
import PatientsList from '@/components/PatientsList'
import SearchPatientForm from '@/components/SearchPatientForm'
import { getPatients } from '../services/patientService'
import { Patient } from '../interfaces/Patinet'
import { SocketContext } from '@/contex/SocketContext'
import { SocketEvent, UpdateEvent } from '@/interfaces/Socket'

function Patients() {
  const socket = useContext(SocketContext)
  const token = Cookies.get('authToken')
  const [patientsData, setPatientsData] = useState<Patient[] | null>(null)
  const [searchTerm, setSearchTerm] = useState<string>('')
  const [filteredPatients, setFilteredPatients] = useState<Patient[] | null>(null)

  const handleonSearch = ({ term, by }: { term: string; by: string }) => {
    setSearchTerm(term)
    const filterOptions: Record<string, (patient: Patient) => boolean> = {
      name: (patient) => patient.patient_name.toLowerCase().includes(term.toLowerCase()),
      status: (patient) => patient.patient_status.toLowerCase().includes(term.toLowerCase()),
      triage_level: (patient) => patient.patient_triage_level === Number(term),
      date_of_birth: () => false
    }
    const filtered = patientsData?.filter((patient) => {
      const filterFunction = filterOptions[by]
      return filterFunction(patient)
    })
    if (filtered?.length === 0 || filtered === undefined) setFilteredPatients(null)
    else setFilteredPatients(filtered)
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (token) {
          const data = await getPatients()
          setPatientsData(data)
        }
      } catch (error) {
        console.error((error as Error).message)
      }
    }
    fetchData()
  }, [token])

  useEffect(() => {
    const token = Cookies.get('authToken')
    const fetchData = async () => {
      try {
        if (token) {
          const data = await getPatients()
          setPatientsData(data)
        }
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
    <div>
      <SearchPatientForm onSearch={handleonSearch} />
      {searchTerm === '' && patientsData ? (
        <PatientsList patients={patientsData} />
      ) : searchTerm !== '' && filteredPatients ? (
        <PatientsList patients={filteredPatients} />
      ) : (
        <p>No se encontraron pacientes.</p>
      )}
    </div>
  )
}

export default Patients
