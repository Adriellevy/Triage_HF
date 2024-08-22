import React, { useState } from 'react'
import BoxEditor from '@/components/BoxSettingsComponents/BoxEditor'
import { Box, BoxType, BoxStatus } from '@/interfaces/Boxes'
import { useTranslation } from 'react-i18next'

interface BoxEdittingListProps {
  initialBoxes: Box[]
}

const BoxEdittingList: React.FC<BoxEdittingListProps> = ({ initialBoxes }) => {
  const { t } = useTranslation('BoxEditor')
  const [boxes, setBoxes] = useState<Box[]>(initialBoxes)
  const [addBox, setAddBox] = useState<boolean>(false)
  const [boxAuxiliar, setboxAuxiliar] = useState<Box>()
  const [visibleTypes, setVisibleTypes] = useState<Record<BoxType, boolean>>({
    [BoxType.CONSULTORIO]: false
  })

  const handleUpdate = (updatedBox: Box) => {
    setBoxes((prev) => prev.map((box) => (box.box_id === updatedBox.box_id ? updatedBox : box)))
  }

  const handleDelete = (boxId: string) => {
    setBoxes((prev) => prev.filter((box) => box.box_id !== boxId))
  }

  const handleAddBox = () => {
    setAddBox(true)
    const newBox: Box = {
      box_id: `new- ${Date.now()}`,
      box_code: '',
      box_type: BoxType.CONSULTORIO,
      box_status: BoxStatus.LIBRE,
      box_time: new Date().toISOString(),
      patient_name: '',
      [Symbol.iterator]: function (): IterableIterator<Box> {
        throw new Error('Function not implemented.')
      }
    }
    setboxAuxiliar(newBox)
    // setBoxes(prev => [...prev, newBox]);
  }

  const toggleVisibility = (type: BoxType) => {
    setVisibleTypes((prev) => ({
      ...prev,
      [type]: !prev[type]
    }))
  }

  return (
    <div className='box-list-container p-4 bg-white shadow rounded-lg'>
      <div className='flex justify-between items-center mb-4'>
        <h2 className='text-xl font-semibold text-gray-800'>Lista de Boxes</h2>
      </div>

      {Object.keys(BoxType).map((type) => {
        const boxType = type as BoxType
        return (
          <div key={boxType}>
            <button
              className='bg-gray-200 text-gray-800 my-2 py-2 px-4 rounded hover:bg-gray-300 transition duration-300'
              onClick={() => toggleVisibility(boxType)}
            >
              {visibleTypes[boxType]
                ? `${t('MinimizeList')} ${boxType}`
                : `${t('ExpandList')} ${boxType}`}
            </button>

            {visibleTypes[boxType] && (
              <ul className='space-y-4'>
                {boxes
                  .filter((box) => box.box_type === boxType)
                  .map((box) => (
                    <li key={box.box_id} className='box-item bg-gray-100 p-4 rounded-lg shadow'>
                      <BoxEditor
                        box={box}
                        onUpdate={handleUpdate}
                        onDelete={handleDelete}
                        addBox={null}
                        setAddBox={setAddBox}
                      />
                    </li>
                  ))}
              </ul>
            )}
          </div>
        )
      })}
      {!addBox && (
        <button
          className='bg-green-500 text-white my-3 py-2 px-4 rounded hover:bg-blue-600 transition duration-300'
          onClick={handleAddBox}
        >
          {t('AddAtentionPlace')}
        </button>
      )}
      {addBox && boxAuxiliar && (
        <div className='space-y-4 my-3 '>
          <h2 className='text-2xl font-semibold mb-5'>{t('AddAtentionPlace')}</h2>
          <BoxEditor
            box={boxAuxiliar}
            onUpdate={handleUpdate}
            onDelete={handleDelete}
            addBox={addBox}
            setAddBox={setAddBox}
          />
        </div>
      )}
    </div>
  )
}

export default BoxEdittingList
