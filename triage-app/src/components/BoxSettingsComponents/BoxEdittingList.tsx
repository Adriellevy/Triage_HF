import React, { useState } from 'react'
import BoxEditor from '@/components/BoxSettingsComponents/BoxEditor'
import { Box, BoxType, BoxStatus, PartialBox } from '@/interfaces/Boxes'
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
  const [visibleTypes, setVisibleTypes] = useState<Record<BoxType, boolean>>({
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
      box_type: BoxType.CONSULTORIO
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
        className='bg-green-500 text-white my-3 py-2 px-4 rounded hover:bg-blue-600 transition duration-300'
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
      <table className='w-full border border-gray-300 mt-4'>
        <thead>
          <tr className='min-w-full bg-blue-800 text-white'>
            <th className='border p-2'>{t('Boxcode')}</th>
            <th className='border p-2'>{t('TypeBox')}</th>
            <th className='border p-2'>{t('StatusBoxString')}</th>
            <th className='border p-2'>{t('PatientName')}</th>
            <th className='border p-2'>{t('Actions')}</th>
          </tr>
        </thead>
        <tbody className='text-center text-black'>
          {boxes.map((box, index) => (
            <BoxEdittingItem box={box} key={index} index={index}></BoxEdittingItem>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default BoxEdittingList
