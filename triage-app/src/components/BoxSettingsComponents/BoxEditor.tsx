import React, { useState, useEffect } from 'react'
import { Box, BoxType, PartialBox } from '@/interfaces/Boxes'
import { Button, Input, Label, Select } from '@/components/ui'
import { useTranslation } from 'react-i18next'
import { CreateNewBox, deleteBox, updateBox } from '@/services/boxService'
import { toast } from 'sonner'
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline' // Puedes usar un ícono de tu preferencia
import ConfirmationDialog from '../ConfirmationDialog'

interface BoxEditorProps {
  box: Box | PartialBox
  onUpdate: (updatedBox: Box) => void
  onDelete: (boxId: string) => void
  addBox: boolean | null
  setAddBox: (value: boolean) => void
}

const BoxEditor: React.FC<BoxEditorProps> = ({ box, onUpdate, onDelete, addBox, setAddBox }) => {
  const [editableBox, setEditableBox] = useState<Box>({ ...box })
  const [isModified, setIsModified] = useState<boolean>(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<boolean>(false)

  const { t } = useTranslation('BoxEditor')
  const fieldTranslations = {
    box_code: t('Boxcode'),
    box_type: t('TypeBox'),
    box_status: t('StatusBoxString'),
    patient_name: t('PatientName'),
    patient_id: t('Patientid'),
    box_id: t('Boxid')
  }
  const ignoreFields = ['box_id', 'patient_id', 'box_time']

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

  const handleCreate = async () => {
    try {
      await CreateNewBox(editableBox)
    } catch (error) {
      toast.error('Error al intentar agregar un nuevo box', { duration: 2000 })
      console.log(error)
    } finally {
      toast.success('Box Creado', { duration: 2000 })
    }
  }

  const handleSave = async () => {
    try {
      onUpdate(editableBox)
      await updateBox(editableBox.box_id, editableBox)
      setIsModified(false)
      if (addBox) {
        setAddBox(false) // Cerrar la ventana después de guardar
      }
    } catch (error) {
      toast.error('Error al intentar editar un box', { duration: 2000 })
      console.log(error)
    } finally {
      toast.success('Box actualizado', { duration: 2000 })
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

  const handleDelete = async () => {
    setShowDeleteConfirm(true)
  }

  const confirmDelete = async () => {
    await deleteBox(editableBox.box_id)
    onDelete(editableBox.box_id)
    setShowDeleteConfirm(false)
  }

  const cancelDelete = () => {
    setShowDeleteConfirm(false)
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
          onClick={box.box_code ? handleSave : handleCreate}
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

      <ConfirmationDialog
        show={showDeleteConfirm}
        title={t('ConfirmDeleteTitle')}
        message={t('ConfirmDeleteMessage')}
        recomendation={t('ChangeLocationRecommendation')}
        warning={t('Warning')}
        confirm={t('Confirm')}
        cancel={t('Cancel')}
        object={editableBox}
        confirmDelete={confirmDelete}
        cancelDelete={cancelDelete}
        warningField='patient_name' // Campo de advertencia opcional
        fieldTranslations={fieldTranslations} // Pasa las traducciones aquí
        ignoreFields={ignoreFields}
      />
    </div>
  )
}

export default BoxEditor
