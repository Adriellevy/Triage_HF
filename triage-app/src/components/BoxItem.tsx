import { Box, BoxStatus } from '@/interfaces/Boxes'
import { Button } from './ui'
import { Link } from 'react-router-dom'

interface PropsBoxItem {
  box: Box
  index: number
}

function BoxItem({ box, index }: PropsBoxItem) {
  const { patient_id, patient_name, box_code, box_type, box_status } = box
  const isOdd = index % 2 !== 0
  const bgClass = isOdd ? 'bg-white' : 'bg-gray-100'

  return (
    <tr className={bgClass}>
      <td className='border p-2 '>{box_code}</td>
      <td className='border p-2 hidden lg:table-cell'>{box_type}</td>
      <td className='border p-2'>
        <div
          className={`rounded-md p-2 ${
            box_status !== BoxStatus.OCUPADO ? 'bg-green-500 shadow-md' : 'bg-red-500 shadow-md'
          }`}
        >
          {box_status}
        </div>
      </td>
      <td className='border p-2 '>{box_status !== BoxStatus.OCUPADO ? null : patient_name}</td>
      <td className='border p-2 hidden lg:table-cell'>
        {box_status !== BoxStatus.OCUPADO ? null : <>tiempo</>}
      </td>
      <td className='border p-2 '>
        {box_status !== BoxStatus.OCUPADO ? null : (
          <Link to={`/patients/${patient_id}`}>
            <Button color='green'>Get patient Info</Button>
          </Link>
        )}
      </td>
    </tr>
  )
}

export default BoxItem
