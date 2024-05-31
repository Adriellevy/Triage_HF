import { PatientHistoryItem } from '@/interfaces/Patinet'

interface PropsPatientHystoryItem {
  item: PatientHistoryItem
  index: number
}

function PatientHystoryItem({ item, index }: PropsPatientHystoryItem) {
  const { update_date, updated_column, old_value, new_value, user_name } = item

  const isOdd = index % 2 !== 0

  const bgClass = isOdd ? 'bg-white' : 'bg-gray-100'

  return (
    <tr className={bgClass}>
      <td className='border p-2 '>{update_date}</td>
      <td className='border p-2 '>{String(updated_column)}</td>
      <td className='border p-2 '>{old_value}</td>
      <td className='border p-2 '>{new_value}</td>
      <td className='border p-2 '>{user_name}</td>
    </tr>
  )
}

export default PatientHystoryItem
