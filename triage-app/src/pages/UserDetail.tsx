import { PartialUser } from '@/interfaces/User'
import { getUserById } from '@/services/userService'
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import DoctorImg from '../assets/doctor.jpeg'
import { useRoleContext } from '@/contex/RoleContext'
import PatientsList from '@/components/PatientsList'
import Cookies from 'js-cookie'
import { getPatients } from '@/services/patientService'
import { Patient } from '../interfaces/Patinet'

const UserProfileImage = DoctorImg

function UserDetail() {
  const { user_id } = useParams()
  const { role } = useRoleContext()
  const [patientsData, setPatientsData] = useState<Patient[] | null>(null)
  const [User, setUser] = useState<PartialUser>({
    user_id: '',
    user_name: '',
    user_email: '',
    user_password: '',
    user_type: role
  })

  const onDelete = (patient_id: string) => {
    console.log(patient_id)
  }

  const onViewDetails = (patient_id: string) => {
    console.log(patient_id)
  }

  const onEdit = (patient_id: string) => {
    console.log(patient_id)
  }
  const token = Cookies.get('authToken')
  useEffect(() => {
    const fetchData = async () => {
      try {
        if (token) {
          const data = await getPatients()
          const filteredData = data.filter((data) => data.doctor_name === User.user_name)
          setPatientsData(filteredData)
        } else {
          // console.log('Error en fetch data de Patients.tsx')
        }
      } catch (error) {
        // console.error('Error al obtener pacientes:', error.message)
      }
    }
    fetchData()
  }, [User, token])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getUserById(user_id)
        setUser(data)
      } catch (error) {
        if (error instanceof Error) {
          console.error('Error al obtener user:', error.message)
        } else {
          console.error('Error desconocido al obtener pacientes:', error)
        }
      }
    }
    fetchData()
  }, [user_id])
  return (
    <div className=' bg-white h-full flex flex-col p-4'>
      <div className='flex items-center mb-4'>
        <img src={UserProfileImage} alt='Profile' className='w-16 h-16 rounded-full mr-4' />
        <div>
          <div className='font-semibold text-2xl'>{User.user_name}</div>
          <div className=''>{User.user_email}</div>
        </div>
      </div>
      <div>
        <div className='mb-2'>
          <span className='font-semibold'>User ID:</span> {User.user_id}
        </div>
        <div className='mb-2'>
          <span className='font-semibold'>User Type:</span> {User.user_type}
        </div>
      </div>

      <div>
        {
          //agregar selector de tipos de pacientes
        }
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
    </div>
  )
}

export default UserDetail
