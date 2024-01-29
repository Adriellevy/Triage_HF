import { User } from '@/interfaces/User'

interface PropsTeamItem {
  user: User
  onViewDetails: (user: User) => void
}

function TeamItem({ user,onViewDetails}: PropsTeamItem) {
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
          onClick={() => onViewDetails(user)}
          className='bg-green-500 text-white p-2 mt-2 rounded-md w-full'
        >
          Details modal
        </button>
        </td>
      </tr>
  )
}

export default TeamItem
