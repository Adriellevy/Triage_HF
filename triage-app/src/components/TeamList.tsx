import { useState } from 'react'
import { User } from '../interfaces/User'
import TeamItem from'../components/TeamItem'
import UserDetailModal from './UserDetailModal'

interface PropsTeamList {
  Team_members: User[]
  onDelete: (user_id: string) => void
  onViewDetails: (user: User) => void
}

function TeamList({ Team_members}: PropsTeamList) {
  
  const [showDetailModal, setShowDetailModal] = useState(false)
  const [selectedPatient, setSelectedUser] = useState<User | null>(null)
  
  const handleViewDetails = (user: User) => {
    setSelectedUser(user)
    setShowDetailModal(true)
  }

  const handleDetailModalClose = () => {
    setShowDetailModal(false)
    setSelectedUser(null)
  }
  //console.log(user)
  return (
    <div className='mt-4 mx-8'>
      {/*<h2 className='text-2xl font-semibold mb-4'>Patients List</h2> */}
      <table className='min-w-full border border-gray-300'>
        <thead>
          <tr>
            <th className='border p-2'>Name</th>
            <th className='border p-2'>User Type</th>
            <th className='border p-2'>Speciality</th>
            <th className='border p-2'>State</th>
            <th className='border p-2'>Authorizations</th>
          </tr>
        </thead>
        <tbody>
          {Team_members.map((Team_members) => (
            <TeamItem
              key={Team_members.user_name}
              user={Team_members}
              onViewDetails={handleViewDetails}
            />
          ))}
        </tbody>
      </table>
      {showDetailModal && (
        <UserDetailModal user={selectedPatient} onClose={handleDetailModalClose} />
      )}
    </div>
  )
}

export default TeamList
