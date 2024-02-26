import { PatientHistoryItem } from '@/interfaces/Patinet'

interface PropsPatientHystoryItem {
  item: PatientHistoryItem
  index: number
}

function PatientHystoryItem({ item, index }: PropsPatientHystoryItem) {
  const { time, patientitem, before, after, user } = item

  const isOdd = index % 2 !== 0

  const bgClass = isOdd ? 'bg-white' : 'bg-gray-100'

  return (
    <tr className={bgClass}>
      <td className='border p-2 '>{time}</td>
      <td className='border p-2 '>{patientitem}</td>
      <td className='border p-2 '>{before}</td>
      <td className='border p-2 '>{after}</td>
      <td className='border p-2 '>{user}</td>
    </tr>
  )
}

export default PatientHystoryItem
