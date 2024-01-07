import { useEffect, useState } from 'react'
import PatientsList from '@/components/PatientsList'
import SearchPatientForm from '@/components/SearchPatientForm'
import { getPatients } from '../services/patientService'
import { Patient } from '../interfaces/Patinet'

function Patients() {
  const token =
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwibmFtZSI6IkRyLiBTbWl0aCIsImlhdCI6MTcwMzIwNjE1N30.TNYMTte4XaVExpZmUMgcoX_dzpBbt84QnyN81RsExiw'
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
        const data = await getPatients(token)
        //TODO: add searchTerm
        //const data = await getPatients(token, searchTerm);
        setPatientsData(data)
      } catch (error) {
        // console.error('Error al obtener pacientes:', error.message)
      }
    }

    fetchData()
  }, [token])

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
