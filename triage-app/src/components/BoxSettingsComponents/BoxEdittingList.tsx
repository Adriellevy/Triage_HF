import React, { useState } from 'react'
import BoxEditor from '@/components/BoxSettingsComponents/BoxEditor'
import { Box, BoxType, PartialBox } from '@/interfaces/Boxes'
import { useTranslation } from 'react-i18next'
import BoxEdittingItem from './BoxEdittingItem'

interface BoxEdittingListProps {
  initialBoxes: Box[]
}

const BoxEdittingList: React.FC<BoxEdittingListProps> = ({ initialBoxes }) => {
  const { t } = useTranslation('BoxEditor')
  const [boxes, setBoxes] = useState<Box[]>(initialBoxes)
  const [addBox, setAddBox] = useState<boolean>(false)
  const [boxAuxiliar, setboxAuxiliar] = useState<PartialBox>()
  const [visibleTypes, setVisibleTypes] = useState<Partial<Record<BoxType, boolean>>>({
    [BoxType.CONSULTORIO]: true
  })

  const handleUpdate = (updatedBox: Box) => {
    setBoxes((prev) => prev.map((box) => (box.box_id === updatedBox.box_id ? updatedBox : box)))
  }

  const handleDelete = (boxId: string) => {
    setBoxes((prev) => prev.filter((box) => box.box_id !== boxId))
  }

  const handleAddBox = () => {
    setAddBox(true)
    const newBox: PartialBox = {
      box_code: '',
      box_type: BoxType.CONSULTORIO,
      [Symbol.iterator]: function (): IterableIterator<Box> {
        throw new Error('Function not implemented.')
      }
    }
    setboxAuxiliar(newBox)
  }

  const handleCancel = () => {
    setAddBox(false)
  }

  const toggleVisibility = (type: BoxType) => {
    setVisibleTypes((prev) => ({
      ...prev,
      [type]: !prev[type]
    }))
  }

  return (
    <div className='mx-0 mt-4 lg:mx-8'>
      <button
        className='ml-2 bg-green-500 text-white mt-3 py-2 px-4 rounded hover:bg-blue-600 transition duration-300'
        onClick={handleAddBox}
      >
        {t('AddAtentionPlace')}
      </button>

      {addBox && boxAuxiliar && (
        <div className='space-y-4 my-3 '>
          <BoxEditor
            box={boxAuxiliar}
            onUpdate={handleUpdate}
            onDelete={handleDelete}
            addBox={addBox}
            setAddBox={setAddBox}
          />
        </div>
      )}
      
      <div className='overflow-x-auto'>
        <table className='w-full border border-gray-300 mt-4'>
          <thead>
            <tr className='min-w-full bg-blue-800 text-white'>
              <th className='border p-1 lg:p-2 text-sm lg:text-lg'>{t('Boxcode')}</th>
              <th className='border lg:p-2 text-sm lg:text-lg hidden lg:table-cell'>{t('TypeBox')}</th>
              <th className='border lg:p-2 text-sm lg:text-lg'>{t('StatusBoxString')}</th>
              <th className='border lg:p-2 text-sm lg:text-lg'>{t('PatientName')}</th>
              <th className='border lg:p-2 text-sm lg:text-lg'>{t('Actions')}</th>
            </tr>
          </thead>
          <tbody className='text-center text-black'>
            {boxes.map((box, index) => (
              <BoxEdittingItem box={box} key={index} index={index} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default BoxEdittingList
