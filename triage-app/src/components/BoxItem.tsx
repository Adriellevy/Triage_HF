import { Box } from '@/interfaces/Boxes'

interface PropsBoxItem {
  box: Box
}

function BoxItem({ box }: PropsBoxItem) {
  const { box_id, box_type } = box
  return (
    <div className='border p-4 mb-4 rounded-md'>
      <h2 className='text-xl font-bold mb-2'>Box {box_id}</h2>
      <p>
        <strong>Type:</strong> {box_type}
      </p>
    </div>
  )
}

export default BoxItem
