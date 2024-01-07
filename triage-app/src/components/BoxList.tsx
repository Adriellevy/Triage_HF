import BoxItem from '@/components/BoxItem'
import { Box } from '@/interfaces/Boxes'

interface PropsBoxList {
  boxes: Box[] | null
}

function BoxList({ boxes }: PropsBoxList) {
  if (boxes === null) {
    return <div>Cargando...</div>
  }
  return (
    <div className='mt-4 mx-8'>
      <h1 className='text-2xl font-bold mb-4'>Boxes List</h1>
      {boxes.map((box, index) => (
        <BoxItem key={index} box={box} />
      ))}
    </div>
  )
}

export default BoxList
