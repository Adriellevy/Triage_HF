import { User } from '@/interfaces/User'
import PatientDetailModal from './PatientDetailModal' 

interface PropsTeamItem {
  user: User
  onDelete: (user_id: string) => void  
  onViewDetails: (patient_id: string) => void
}

function TeamItem({ user}: PropsTeamItem) {
  const {
    user_name,
    user_type,
    speciality,
    state,
  } = user
  return (
    <tr>
      <td className='border p-2'>{user_name}</td>
      <td className='border p-2'>{user_type}</td>
      <td className='border p-2'>{speciality}</td>
      <td className='border p-2'>{state}</td>
      <td className='border p-2'>
        <button
          onClick={() => onViewDetails(patient)}
          className='bg-green-500 text-white p-2 mt-2 rounded-md w-full'
        >
          Details modal
        </button>
        </td>
      </tr>
  )
}

export default TeamItem
