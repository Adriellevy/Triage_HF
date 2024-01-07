import { Patient } from '../interfaces/Patinets'
import { getPatientById } from '../services/patientService'
import { useState, useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'

function PatientDetail() {
  const { patient_id } = useParams()
  const [Patient, setPatient] = useState<Patient | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [data] = await getPatientById(patient_id)
        setPatient(data)
      } catch (error) {
        if (error instanceof Error) {
          console.error('Error al obtener pacientes:', error.message)
        } else {
          console.error('Error desconocido al obtener pacientes:', error)
        }
      }
    }
    fetchData()
  }, [patient_id])

  return (
    <div className='container mx-auto my-8 p-8 bg-white rounded shadow-md'>
      <div className='flex justify-between items-center mb-4'>
        <h2 className='text-2xl font-bold'>Patient Details </h2>
        <Link to={`/patients/`}>
          <button className='bg-green-500 text-white p-2 mt-2 rounded-md w-full'>Back</button>
        </Link>
      </div>
      {Patient && (
        <ul className='list-disc pl-4'>
          <li>
            <strong>Patient Name:</strong> {Patient.patient_name}
          </li>
          <li>
            <strong>Date of Birth:</strong> {Patient.date_of_birth}
          </li>
          <li>
            <strong>Entry Time:</strong> {Patient.entry_time}
          </li>
          <li>
            <strong>Triage Level:</strong> {Patient.patient_triage_level}
          </li>
          <li>
            <strong>Patient Medication:</strong> {Patient.patient_medication}
          </li>
          <li>
            <strong>Patient Problem:</strong> {Patient.patient_problem}
          </li>
          <li>
            <strong>Box ID:</strong> {Patient.box_id}
          </li>
          <li>
            <strong>Doctor Name:</strong> {Patient.doctor_name}
          </li>
          <li>
            <strong>Nurse Name:</strong> {Patient.nurse_name}
          </li>
          <li>
            <strong>Patient Status:</strong> {Patient.patient_status}
          </li>
        </ul>
      )}
    </div>
  )
}

export default PatientDetail
