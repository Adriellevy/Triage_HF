import { useState } from 'react'
import { User } from '../interfaces/User'
import TeamItem from'../components/TeamItem'

interface PropsTeamList {
  Team_members: User[]
  onDelete: (patient_id: string) => void
}

function PatientsList({ Team_members, onDelete }: PropsTeamList) {

  // console.log(patients)
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
              onDelete={onDelete}
            />
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default PatientsList
