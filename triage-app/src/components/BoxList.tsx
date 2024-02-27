import BoxItem from '@/components/BoxItem'
import { Box } from '@/interfaces/Boxes'

interface PropsBoxList {
  boxes: Box[] | null
}

function BoxList({ boxes }: PropsBoxList) {
  if (boxes === null) {
    return <div>Cargando...</div>
  }
  {
    /*
    return (
    <div className='mt-4 mx-8'>
      <h1 className='text-2xl font-bold mb-4'>Boxes List</h1>
      {boxes.map((box, index) => (
        <BoxItem key={index} box={box} />
      ))}
    </div>
  )*/
  }

  return (
    <div className='mx-0 mt-4 lg:mx-8'>
      <table className='w-full border border-gray-300'>
        <thead>
          <tr className='min-w-full bg-blue-400'>
            <th className='border p-2 '>Code</th>
            <th className='border p-2 hidden lg:table-cell'>Type</th>
            <th className='border p-2 '>Status</th>
            <th className='border p-2 '>Patient</th>
            <th className='border p-2 hidden lg:table-cell'>Time</th>
            <th className='border p-2 '>Action</th>
          </tr>
        </thead>
        <tbody className='text-center'>
          {boxes.map(
            (Item, index) => boxes && <BoxItem key={Item.box_id} box={Item} index={index} />
          )}
        </tbody>
      </table>
    </div>
  )
}

export default BoxList
