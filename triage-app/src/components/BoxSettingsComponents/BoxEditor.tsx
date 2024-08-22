import React, { useState, useEffect } from 'react'
import { Box, BoxType } from '@/interfaces/Boxes'
import { Button, Input, Label, Select } from '@/components/ui'
import { useTranslation } from 'react-i18next'

interface BoxEditorProps {
  box: Box
  onUpdate: (updatedBox: Box) => void
  onDelete: (boxId: string) => void
  addBox: boolean | null
  setAddBox: (value: boolean) => void
}

const BoxEditor: React.FC<BoxEditorProps> = ({ box, onUpdate, onDelete, addBox, setAddBox }) => {
  const [editableBox, setEditableBox] = useState<Box>({ ...box })
  const [isModified, setIsModified] = useState<boolean>(false)

  const { t } = useTranslation('BoxEditor')

  useEffect(() => {
    setEditableBox({ ...box })
  }, [box])

  const handleChange = (field: keyof Box, value: any) => {
    setEditableBox((prev) => ({
      ...prev,
      [field]: value
    }))
    setIsModified(true)
  }

  const handleSave = () => {
    onUpdate(editableBox)
    setIsModified(false)
    if (addBox) {
      setAddBox(false) // Cerrar la ventana después de guardar
    }
  }

  const handleCancel = () => {
    if (addBox) {
      setAddBox(false) // Cerrar la ventana si estamos en modo de agregar
    } else {
      setEditableBox({ ...box })
      setIsModified(false)
    }
  }

  const handleDelete = () => {
    onDelete(editableBox.box_id)
  }

  return (
    <div className='box-editor p-4 bg-gray-100 rounded-lg shadow-md'>
      <div className='mb-4'>
        <Label htmlFor={`box_code-${editableBox.box_id}`} className='text-gray-700 font-semibold'>
          {t('Boxcode')}
        </Label>
        <Input
          id={`box_code-${editableBox.box_id}`}
          type='text'
          value={editableBox.box_code || ''}
          onChange={(e) => handleChange('box_code', e.target.value)}
          className='mt-1 block w-full'
        />
      </div>

      <div className='mb-4'>
        <Label htmlFor={`box_type-${editableBox.box_id}`} className='text-gray-700 font-semibold'>
          {t('TypeBox')}
        </Label>
        <Select
          id={`box_type-${editableBox.box_id}`}
          value={editableBox.box_type}
          onChange={(e) => handleChange('box_type', e.target.value as BoxType)}
          className='mt-1 block w-full'
        >
          {Object.values(BoxType).map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </Select>
      </div>

      <div className='flex justify-between'>
        <Button
          onClick={handleSave}
          className={`bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600 transition duration-300`}
          color={'green'}
        >
          {box.box_code ? t('Save') : t('Add')}
        </Button>

        <Button
          onClick={isModified || addBox ? handleCancel : handleDelete}
          className={`${
            isModified || addBox ? 'bg-red-500' : 'bg-yellow-500'
          } text-white py-2 px-4 rounded hover:bg-${
            isModified || addBox ? 'red-600' : 'yellow-600'
          } transition duration-300`}
          color={isModified || addBox ? 'red' : 'yellow'}
        >
          {isModified || addBox ? t('Cancel') : t('Delete')}
        </Button>
      </div>
    </div>
  )
}

export default BoxEditor
