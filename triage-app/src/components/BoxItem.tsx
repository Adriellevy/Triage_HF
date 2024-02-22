import { Box, BoxStatus } from '@/interfaces/Boxes'
import { Button } from './ui'
import { Link } from 'react-router-dom'

interface PropsBoxItem {
  box: Box
}

function BoxItem({ box }: PropsBoxItem) {
  const { patient_id, patient_name, box_code, box_type, box_status } = box

  return (
    <div className='border p-4 mb-4 rounded-md'>
      <h2 className='text-xl font-bold mb-2'>Box {box_code}</h2>
      <p>
        <strong>Type:</strong> {box_type}
      </p>
      <p>
        <strong>Status:</strong> {box_status}
      </p>
      {box_status === BoxStatus.OCUPADO && (
        <>
          <p>
            <strong>Patient:</strong> {patient_name}
          </p>
          <p>
            <strong>Time:</strong> {box_status}
          </p>
          <div>
            <Link to={`/patients/${patient_id}`}>
              <Button color='green'>Get patient Info</Button>
            </Link>
          </div>
        </>
      )}
    </div>
  )
}

export default BoxItem
