import { useContext, useEffect, useState } from 'react'
import Cookies from 'js-cookie'
import PatientsList from '@/components/PatientsList'
import SearchPatientForm from '@/components/SearchPatientForm'
import { getPatients } from '../services/patientService'
import { Patient } from '../interfaces/Patinet'
import { SocketContext } from '@/contex/SocketContext'
import { SocketEvent, UpdateEvent } from '@/interfaces/Socket'
import Select from 'react-select'
const options = [
  {
    label: 'TRIAGE LEVEL',
    options: [
      { value: 'patient_triage_level', label: '1', color: '#FF5630' },
      { value: 'patient_triage_level', label: '2', color: '#FFC400' },
      { value: 'patient_triage_level', label: '3', color: '#FF8B00' },
      { value: 'patient_triage_level', label: '4', color: '#36B37E' },
      { value: 'patient_triage_level', label: '1-4', color: '#5243AA', isFixed: true }
    ]
  },
  {
    label: 'PATIENT STATE',
    options: [
      { value: 'patient_status', label: 'EN ESPERA', color: '#36B37E' },
      { value: 'patient_status', label: 'EN ESPERA DE INTERNACION', color: '#36B37E' },
      { value: 'patient_status', label: 'EN INTERNACION', color: '#36B37E' },
      { value: 'patient_status', label: 'AFUERA', color: '#36B37E' },
      { value: 'patient_status', label: 'EN AISLAMIENTO', color: '#36B37E' },
      { value: 'patient_status', label: 'ALTA', color: '#36B37E' },
      { value: 'patient_status', label: 'TODOS', color: '#36B37E' }
    ]
  },
  {
    label: 'From Who',
    options: [
      { value: 'type_user', label: 'ALL', color: '#36B37E' },
      { value: 'type_user', label: 'MINE', color: '#36B37E' }
    ]
  }
]

function Patients() {
  const socket = useContext(SocketContext)
  const token = Cookies.get('authToken')
  const [patientsData, setPatientsData] = useState<Patient[] | null>(null)
  const [searchTerm, setSearchTerm] = useState<string>('')
  const [filteredPatients, setFilteredPatients] = useState<Patient[] | null>(null)
  const [RawData, setRawData] = useState<Patient[] | null>(null)
  //hardoceado ver como obtenerlo de otra forma

  const onChangeSelect = (selectedOptions: readonly Option[]) => {
    // Filtrar patientsData
    if (RawData) {
      const filteredData = RawData.filter((patient) => {
        // Verificar si el paciente cumple con todas las opciones seleccionadas
        return selectedOptions.every((option) => {
          if (option.label === 'TODOS' || option.label === '1-4') {
            return patient[option.value]
          } else if (option.label === 'MINE') {
            // Verificar si el paciente tiene el doctor_name igual a 'Dr. Smith'
            return patient.doctor_name === 'Dr. Smith'
          }
          // Comprobar si el paciente tiene el valor de la opción seleccionada
          return patient[option.value].toString() === option.label
        })
      })
      setPatientsData(filteredData)
    }
  }

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
          const sortedData = data.sort((a, b) => {
            return new Date(b.entry_time).getTime() - new Date(a.entry_time).getTime()
          })
          setRawData(sortedData)
          setPatientsData(sortedData)
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
          const sortedData = data.sort((a, b) => {
            return new Date(b.entry_time).getTime() - new Date(a.entry_time).getTime()
          })
          setRawData(sortedData)
          setPatientsData(sortedData)
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
      <div>
        <SearchPatientForm onSearch={handleonSearch} />
        <Select options={options} isMulti closeMenuOnSelect={false} onChange={onChangeSelect} />
      </div>

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
